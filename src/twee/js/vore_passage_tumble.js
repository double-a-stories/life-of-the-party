/**
 * On [vore] passages, change --bg-rotation (direction of background gradient)
 * to a random value based on the passage number.
 * This is specific to Life of the Party.
 */
$(window).on("sm.passage.shown", (ev, { passage }) => {
  if (passage.tags.includes("vore")) {
    let rotation = (passage.id * 30) % 360;
    document.body.style.setProperty("--bg-rotation", `${rotation}deg`);
  } else {
    document.body.style.removeProperty("--bg-rotation");
  }
});
