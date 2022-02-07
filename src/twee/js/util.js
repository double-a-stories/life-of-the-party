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

// Set document language to English.
// This causes <q> to implicitly render as curly double quotes.
$("html").attr("lang", "en-us");

// All external links open in a new tab by default.
$(window).on('sm.passage.shown', function (event, eventObject) {
    $("a[href^='https']").attr("target", "_blank");
});

// Debug feature
// Set starting passage based on URL search params
// /life-of-the-party/?passage=Warp%20zone
$(window).on('sm.story.started', function(event, { story }) {
    const params = new URLSearchParams(window.location.search);

    if (story.passage(params.get("start"))) {
        story.startPassage = params.get("start");
    }
})

setup.setStart = () => {
    const params = new URLSearchParams();
    params.set("start", passage.name);
    location.search = params.toString();
}