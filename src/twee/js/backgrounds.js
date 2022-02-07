/**
 * backgrounds.js
 * LICENSE: MIT-0
 *
 * A small plugin for Snowman which makes it easy to apply passage-specific CSS rules using Twine tags.
 * The attribute body[data-tags] is set to the tags of the currently active passage. You can style a specific tags using a CSS rule like body[data-tags~="mytag"] { background: green; }
 */
$(window).on("sm.passage.shown", function (event, eventObject) {
  $("body").attr("data-tags", passage.tags.join(" "));
});

/**
 * On [vore] passages, change --bg-rotation (direction of background gradient)
 * to a random value based on the passage number.
 * This is specific to Life of the Party.
 */
$(window).on("sm.passage.shown", (ev, { passage }) => {
  if (passage.tags.includes("vore")) {
    let rotation = (passage.id * 30) % 360;
    document.body.style.setProperty("--bg-rotation", `${rotation}deg`);
  } else {
    document.body.style.removeProperty("--bg-rotation");
  }
});
