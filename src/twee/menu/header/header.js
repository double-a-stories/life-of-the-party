// LICENSE: MIT-0

/* Page Header */
/* use the tag `header` on a passage to render it before the passage */

$(window).on('sm.story.started', function (event, {
  story
}) {
  const passages = story.passages.filter(p => p);
  const $headerEl = $("<header></header>").attr("id", "header");
  passages.filter(p => p.tags.includes("header")).forEach(p => {
    const html = $.parseHTML(story.render(p.id));
    $(html).appendTo($headerEl);
  })
  $headerEl.insertBefore(story.$passageEl);
});

// Make a passage loading work like page loading
$(window).on('sm.passage.hidden', function (event, {
  story
}) {
  window.scrollTo(0, 0); // scroll to top
  $(":focus").blur(); // unselect selected item
});

/* Previous Command API */
// Show the text of the clicked link as the title of the next passage
// e.g. the link [[Foo|Bar]] goes to the passage Bar, but shows Foo.
$(window).on('sm.passage.shown', (e, {
  passage
}) => {
  $("a").on("click", ({
    currentTarget
  }) => {
    const $this = $(currentTarget);
    // Data attributes:
    // Add data-nocommand to use the linked passage's title
    // Use data-command="..." to set custom titles
    const data = $this.data();
    if (data["command"] !== "" && data["nocommand"] !== "") {
      story.state.previousCommand = data["command"] || $this.html();
    }
  })
  const passageTitle = story.state.previousCommand || passage.name
  $("#recent-command").html(passageTitle)
  story.state.previousCommand = "";
})