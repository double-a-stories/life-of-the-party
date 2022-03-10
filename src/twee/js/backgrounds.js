/**
 * @file A Snowman plugin which sets the [data-tags] attribute to the current list of body tags
 * @author Double-A <https://github.com/double-a-stories>
 * @license MIT-0
 *
 * You can use a CSS selector like body[data-tags~="mytag"] to style the body when on a passage with mytag.
 */

jQuery(window).on("sm.passage.shown", function (event, { passage }) {
  document.body.dataset.tags = passage.tags.join(" ");
});
