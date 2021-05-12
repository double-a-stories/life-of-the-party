// LICENSE: MIT-0
// Fadein effect when showing passages
// Passages can disable this by adding the tag "no_fade"

$(window).on('sm.passage.hidden', () => {
  story.$passageEl.css({ opacity: 0 });
})

$(window).on('sm.passage.shown', (ev, { passage }) => {
  const noFade = passage.tags.some(tag => tag === "no_fade");
  story.$passageEl.animate({ opacity: 1 }, { duration: noFade ? 0 : "slow", queue: false });
})