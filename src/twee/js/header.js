// LICENSE: MIT-0

/* Page Header */
/* use the tag `header` on a passage to render it before the passage */

$(window).one("sm.passage.showing", function (event, { passage }) {
  const headerWrapper = $("<div></div>")
    .attr("id", "header-container")
    .insertBefore(story.$passageEl)
    .html(story.render("Header"));
});

// Make a passage loading work like page loading
$(window).on("sm.passage.hidden", function (event, { story }) {
  window.scrollTo(0, 0); // scroll to top
  $(":focus").blur(); // unselect selected item
});

setup.help = () => {
  if (passage.name != "Help") {
    story.show("Help");
  } else {
    setup.undo();
  }
};

setup.refreshHeader = () => {
  renderToSelector("#header", "Topbar controls");
}

$(window).on("sm.passage.shown", (event, { passage }) => {
  if (passage.name == "Help") {
    setup.refreshHeader();
    $(window).one("sm.passage.shown", () => {
      setup.refreshHeader();
    });
  }
});

setup.toggleMute = () => {
  if (!StoryFlags.isSet("enableSound")) {
    StoryFlags.set("enableSound");
    Howler.mute(false);
  } else {
    StoryFlags.unset("enableSound");
    Howler.mute(true);
  }
  setup.refreshHeader();
};
