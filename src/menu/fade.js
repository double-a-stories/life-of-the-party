// Fadein effect when showing passages
// Passages can disable this by adding the tag "no_fade"

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