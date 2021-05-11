// LICENSE: MIT-0
// Fadein effect when showing passages
// Passages can disable this by adding the tag "no_fade"

$(window).on('sm.passage.hidden', () => {
  story.$passageEl.fadeTo(0, 0);
})

$(window).on('sm.passage.shown', (ev, { passage }) => {
  const noFade = passage.tags.some(tag => tag === "no_fade");
  story.$passageEl.fadeTo(noFade ? 0 : "slow", 1);
})