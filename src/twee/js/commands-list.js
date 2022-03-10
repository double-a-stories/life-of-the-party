/**
 * @file Custom Passage Link Styles for Snowman
 * @author Double-A <https://github.com/double-a-stories>
 * @license MIT-0
 *
 * Applies the classname .command-link to all Snowman passage links and <a0> elements.
 * If an unstyled ul list has such a link in it, it gets the .command-list class.
 */
/*
 * Make a command list with the following Markdown:

    - [[Passage 1]]
    - [[Passage 2]]

 * Resulting HTML:

    <ul class="commands-list">
      <li><a class="command-link" href="javascript:void(0)" data-passage="Passage 1" >Passage 1</a></li>
      <li><a class="command-link" href="javascript:void(0)" data-passage="Passage 2">Passage 2</a></li>
    </ul>

*/

$(window).on("sm.passage.shown", () => {
  $("tw-passage ul a[href='javascript:void(0)'], .command-link").each(
    (i, el) => {
      $(el).unwrap("p");
      $(el).addClass("command-link");
      $(el).parents("ul").not("[class]").addClass("commands-list");
    }
  );
});