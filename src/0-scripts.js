// The Snowbunny Engine

// Global Variable: "setup"
window.setup = window.setup || {};
setup.version = "v0.4.1"

// Move story styles to before the passages.
// This prioritizes styles declared inside passages.
$("tw-story > style").appendTo($("head"));

/* History Commands */

// Undo Command
setup.undo = () => {
  window.history.back(); // load last checkpoint
  $("#back-button:focus").blur(); // unfocus the back button
}
// Restart
setup.restart = () => {
  console.info("localStorage = ", localStorage);
  story.history = []; // erase history (resets page visit counts)
  story.state = {}; // reset state

  // reset the startPassage variable to a passage with the tag 'start'
  const passages = story.passages.filter(p => p);
  const start = passages.find(p => p.tags.includes("start"));
  story.startPassage = start ? start.id : story.startPassage;
  story.show(story.startPassage); // load startPassage
}
// save a Snowman checkpoint on every passage.
$(window).on('sm.passage.shown', e => {
  story.checkpoint(); // required for "undo" to restore previous state
})

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

// DEBUG: Handle Errors without Crashing
story.ignoreErrors = true;
$(window).on("sm.story.error", ev => {
  if (story.ignoreErrors) {
    window.alert(story.errorMessage);
    console.error(story.errorMessage);
  }
})

// Basic Fadein. Override by adding "no_fade" tag.
$(window).on('sm.passage.hidden', () => {
  story.$passageEl.css({ opacity: 0 });
})

$(window).on('sm.passage.shown', (ev, { passage }) => {
  if (!passage.tags.some(tag => tag === "no_fade")) {
    story.$passageEl.css({
      opacity: 0
    }).animate({
      opacity: 1
    }, {
      duration: "slow",
      queue: false
    });
  } else {
    story.$passageEl.css({ opacity: 1 });
  }
})

/*
 * Keyboard Controls
 */
window.controls = window.controls || {}; {
  controls.getFocusables = () => $("a[href], button, input, select, [tabindex]").filter(":visible");

  controls.focusNext = () => {
    const $focusables = controls.getFocusables();
    let index = $focusables.index(document.activeElement);
    if (index != -1) {
      $focusables.eq(index + 1).focus();
    } else {
      if ($("tw-passage").find($focusables)[0]) {
        $("tw-passage").find($focusables).first().focus();
      } else {
        $focusables.first().focus();
      }
    }
  }
  controls.focusPrev = () => {
    const $focusables = controls.getFocusables();
    let index = $focusables.index(document.activeElement);
    if (index >= 0) {
      $focusables.eq(index - 1).focus();
    } else {
      controls.focusNext();
      controls.focusPrev();
    }
  }
  controls.selectFocused = () => {
    const $focusables = controls.getFocusables();
    if ($focusables.index(document.activeElement) != -1) {
      document.activeElement.click();
    } else {
      controls.focusNext();
    }
  }
  controls.goNext = () => {
    let p = passage.id;
    if (!$(":focus")[0]) {
      window.history.forward();
    }
    if (p == passage.id) {
      controls.selectFocused();
    }
  }
}
$(document).keydown(function (e) {
  if ($(e.target).is("input[type!='button'], [contenteditable]") &&
    !e.key.startsWith("Arrow")) {
    return;
  }
  switch (e.key.toLowerCase()) {
    case "enter":
    case "e":
    case " ":
      controls.selectFocused();
      e.preventDefault();
      break;
    case "h":
    case "a":
    case "arrowleft":
      setup.undo();
      e.preventDefault();
      break;
    case "d":
    case "l":
    case "arrowright":
      controls.goNext();
      e.preventDefault();
      break;
    case "w":
    case "k":
    case "arrowup":
      controls.focusPrev();
      e.preventDefault();
      break;
    case "s":
    case "j":
    case "arrowdown":
      controls.focusNext();
      e.preventDefault();
      break;
  }
});

// Persistent Achievement API
// Achievements are stored as a JSON array in localStorage.achievements
setup.getAchievements = () => {
  localStorage.achievements = localStorage.achievements || "[]";
  const achievements = JSON.parse(localStorage.achievements);
  return achievements;
}
setup.addAchievement = (name) => {
  let achievements = setup.getAchievements();
  if (!setup.getAchievements().includes(name)) {
    achievements = [...achievements, name]
  }
  localStorage.achievements = JSON.stringify(achievements);
}
setup.resetAchievements = () => {
  localStorage.achievements = JSON.stringify([]);
}

/* Adds passage tags to body[data-tags]. This enables CSS rules which change the page background based on passage tags.
A sample selector looks like body[data-tags~="mytag"];
*/
$(window).on('sm.passage.shown', function (event, eventObject) {
  $("body").attr("data-tags", passage.tags.join(" "));
});