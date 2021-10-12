// MIT-0
$(window).on('sm.passage.shown', () => {
  $("tw-passage ul a[href='javascript:void(0)'], .command-link").each((i, el) => {
    $(el).unwrap("p");
    $(el).parents("ul").not("[class]").addClass("commands-list");
  })
});