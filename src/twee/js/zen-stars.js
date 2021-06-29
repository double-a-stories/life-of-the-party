// MIT-0

// Creates the following markup,
// <div#space-bg>
//   <div.space.stars1>
//   <div.space.stars2>
//   <div.space.stars3>

$(window).on("sm.story.started", (ev, { passage }) => {
  const space = document.createElement("div");
  space.id = "space-bg";
  space.setAttribute("role", "presentation");
  for (let i = 1; i <= 3; i++) {
    const stars = document.createElement("div");
    stars.classList.add("space", `stars${i}`);
    space.appendChild(stars);
  }
  document.querySelector("tw-story").appendChild(space);
})
