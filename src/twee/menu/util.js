// LICENSE: MIT-0

// Global Variable: "setup"
window.setup = window.setup || {};

// Move story styles to before the passages.
// This prioritizes styles declared inside passages.
// $("tw-story style, tw-storydata style").appendTo($("head"));

// DEBUG: Handle Errors without Crashing
story.ignoreErrors = true;
$(window).on("sm.story.error", (event, error) => {
    if (story.ignoreErrors) {
        const message =
            `${error.message}
        ---
        Error occured while viewing "${window.passage ? passage.name : "undefined"}". Check debug console for for details.

        To report this bug, please message the developer with the following:
        1) What version is your browser?
        2) Steps to reproduce?
        3) A screenshot of the debug console
        `;
        window.alert(message);
        console.error(error);
    }
})

/* Adds passage tags to body[data-tags]. This enables CSS rules which change the page background based on passage tags.
A sample selector looks like body[data-tags~="mytag"];
*/
$(window).on('sm.passage.shown', function (event, eventObject) {
  $("body").attr("data-tags", passage.tags.join(" "));
});

// Set document language to English.
// This causes <q> to implicitly render as curly double quotes.
$("html").attr("lang", "en-us");

$(window).on('sm.passage.shown', function (event, eventObject) {
    $("a[href^='https']").attr("target", "_blank");
});