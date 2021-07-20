// LICENSE: MIT-0

/* History Commands */

window.setup = window.setup || {};

// Undo Command
setup.undo = () => {
  window.history.back(); // load last checkpoint
  $("#back-button:focus").blur(); // unfocus the back button
}
// Restart
setup.restart = () => {
  story.history = []; // erase history (resets page visit counts)
  story.state = {}; // reset state
  story.show(story.startPassage); // load startPassage
}
// save a Snowman checkpoint on every passage.
$(window).on('sm.passage.shown', (e, {passage}) => {
  if (!passage.tags.includes("no_checkpoint")) {
    story.checkpoint(); // required for "undo" to restore previous state
  }
})

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
}