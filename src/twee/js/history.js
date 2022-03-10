/**
 * @file A Snowman plugin which provides an Undo, Redo, and Restart function.
 * @author Double-A <https://github.com/double-a-stories>
 * @license MIT-0
 */
window.setup = window.setup || {};

// setup.historyCount is used as a guard to stop the "Undo" function from going further back into the user's history.
setup.historyCount = 0;
$(window).on("sm.passage.shown", (e, { passage }) => {
  setup.historyCount++;
});

/**
 * Return to the previous checkpoint.
 */
setup.undo = () => {
  $(window).trigger("bunny.undo");
  if (setup.historyCount > 1) {
    setup.historyCount -= 2;
    window.history.back();
    return true;
  }
  return false;
};
setup.redo = () => {
  window.history.forward();
};
/**
 * Return to the start passage. Reset history and state variables.
 */
setup.restart = () => {
  story.history = []; // erase history (resets page visit counts)
  story.state = {}; // reset state
  story.show(story.startPassage); // load startPassage
};
// save a Snowman checkpoint on every passage.
$(window).on("sm.passage.shown", (e, { passage }) => {
  if (!passage.tags.includes("no_checkpoint")) {
    story.checkpoint(); // required for "undo" to restore previous state
  }
});

setup.rewind = () => {
  if (story.history.length >= 1) {
    // find the most recent passage with tag "checkpoint"
    for (let i = story.history.length - 2; i >= 0; i--) {
      let pid = story.history[i];
      if (story.passages[pid].tags.includes("checkpoint")) {
        // load it now, while still preserving story state.
        story.show(pid);
        // clip history up until that passage
        story.history = story.history.slice(0, i + 1);
        return;
      }
    }
    // else:
    setup.restart();
  }
};