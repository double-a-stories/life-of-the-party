// MIT-0

// Creates the following markup, and displays it exclusively on passages with the "stars" tag.
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

$(window).on("sm.passage.shown", (ev, { passage }) => {
  const space = document.querySelector("#space-bg");
  space.style.display = passage.tags.includes("stars") ? "" : "none";
})