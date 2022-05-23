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

/* Previous Command API */
// Show the text of the clicked link as the title of the next passage
// e.g. the link [[Foo|Bar]] goes to the passage Bar, but shows Foo.
$(window).on("sm.passage.shown", (e, { passage }) => {
  const s = story.state;
  const passageTitle = s.previousCommand || passage.name;
  $("#recent-command").html(passageTitle);
  s.previousCommand = "";
  $("a").on("click", function () {
    // Data attributes:
    // Add data-nocommand to use the linked passage's title
    // Use data-command="..." to set custom titles
    const { dataset } = this;
    if (dataset.command) {
      // custom command attribute
      s.previousCommand = dataset.command;
    } else if (dataset.nocommand !== undefined
      || passage.tags.includes("no_command")) {
        s.previousCommand = "";
    } else {
      s.previousCommand = $(this).html();
    }
  });
});

setup.help = () => {
  if (passage.name != "Help") {
    story.show("Help");
  } else {
    setup.undo();
  }
};

$(window).on("sm.passage.shown", (event, { passage }) => {
  if (passage.name == "Help") {
    renderToSelector("#header", "Topbar controls");
    $(window).one("sm.passage.shown", () => {
      renderToSelector("#header", "Topbar controls");
    });
  }
});

setup.toggleMute = () => {
  if (!setup.isFlagSet("enableSound")) {
    setup.setFlag("enableSound");
    Howler.mute(false);
  } else {
    setup.unsetFlag("enableSound");
    Howler.mute(true);
  }
  renderToSelector("#header", "Topbar controls");
};
