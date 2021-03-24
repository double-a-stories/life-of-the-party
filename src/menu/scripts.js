// The Snowbunny Engine

// Global Variable: "setup"
window.setup = window.setup || {};
setup.version = "v0.4.2"

// Move story styles to before the passages.
// This prioritizes styles declared inside passages.
// $("tw-story style, tw-storydata style").appendTo($("head"));

// DEBUG: Handle Errors without Crashing
story.ignoreErrors = true;
$(window).on("sm.story.error", ev => {
  if (story.ignoreErrors) {
    window.alert(story.errorMessage);
    console.error(story.errorMessage);
  }
})

/* Adds passage tags to body[data-tags]. This enables CSS rules which change the page background based on passage tags.
A sample selector looks like body[data-tags~="mytag"];
*/
$(window).on('sm.passage.shown', function (event, eventObject) {
  $("body").attr("data-tags", passage.tags.join(" "));
});