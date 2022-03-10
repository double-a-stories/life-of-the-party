/**
 * @file Snowman plugin to add a fade-in effect when showing passages
 * @license MIT-0
 *
 * Applies the .fadeleft or .faderight class whenever the passage changes.
 */

{
  const $el = story.$passageEl; // the <tw-passage> element

  let isUndoing = false; // did we just issue an undo command?
  $(window).on("bunny.undo", () => {
    // custom event must be triggered on Undo
    isUndoing = true;
  });

  // Apply animation classes when a new passage loads
  $(window).on("sm.passage.shown", (ev, { passage }) => {
    if (!passage.tags.includes("no_fade")) {
      $el.addClass(isUndoing ? "faderight" : "fadeleft");
    }
    isUndoing = false;
  });

  // Remove animation classes before loading the next passage.
  $(window).on("sm.passage.hidden", () => {
    $el.removeClass("faderight");
    $el.removeClass("fadeleft");
  });
  // Remove animation classes when the animation finishes.
  $el[0].addEventListener("animationend", ({ animationName }) => {
    $el.removeClass("faderight");
    $el.removeClass("fadeleft");
  });
}
