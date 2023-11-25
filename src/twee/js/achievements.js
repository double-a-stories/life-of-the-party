/**
 * @file A plugin for "Life of the Party". Manages story flags which are preserved between sessions.
 * @author double-a-stories
 * @license MIT-0
 */

/**
 * setup - Global object.
 */
window.setup = window.setup || {};

if (window.Lockr == undefined) {
  // make sure Lockr is loaded.
  throw new Error("achievements.js: Lockr.js was not loaded in time!");
}

// Savegame format version
// Can be updated to introduce breaking changes with previous achievement storage formats.
setup.ACHIEVEMENT_KEY_VERSION = 8;

/**
 * 
 * @returns {string} A formatted table
 */
setup.getAchievementTable = () => passage.render(`<table class="table">
<% for (const key of setup.getAllAchievementsSorted()) {
  const [emoji, hint, name, desc, hidden] = setup.ALL_ACHIEVEMENTS[key];
  let unlocked = setup.hasAchievement(key);
  if (hidden && !unlocked) continue; 
  %>
    <tr class="<% if (!unlocked) %>locked-achievement<%;%>">
      <td><%= unlocked ? emoji: "🔒" %></span></td>
      <td width="99%"><b><%= unlocked ? name : "???" %><%= hidden ? " (secret)" : "" %></b><%= unlocked ? "<br>" : "" %>
      <%= unlocked ? desc : "<i>" + hint + "</i>" %></td>
    </tr>
<% } %>
</table>`);

/**
 * These achievements are used in Life of the Party
 * Lotp Achievements are stored like [emoji, location, title, description]
 */
setup.ALL_ACHIEVEMENTS = {
  ANA_VORE_ENDING: ["🗑️", "Outside...", "Rebel Girl", "Made a new friend. (Ana vore ending)"],
  BASIL_VORE_ENDING: ["🐴", "Dance...", "Party Animal", "Got everyone's attention. (Basil vore ending)"],
  HAZEL_VORE_ENDING: ["🐻", "Bathroom...", "A Grizzly's End", "Reunited with an old face. (Hazel vore ending)"],
  LACEY_VORE_ENDING: [`🎠`, "Bedroom...", "Two for One Meal", "Found your friend. (Lacey vore ending)"],
  REN_VORE_ENDING: ["🦊", "Garage...", "🐇🥱😊!!!", "Went on a joy ride. (Ren vore ending)"],
  BYRON_VORE_ENDING: ["🐺", "Couch...", "A Belly You Can't Get Out", "Learned your place. (Byron vore ending)"],
  NIKKI_NOX_VORE_ENDING: ["🍸", "Drink...", "Sauced & Swallowed", "Tried something new (Nikki & Nox ending)"],
  CLOSET_ENDING: ["🧹", "Closet...", "My Favorite", "Utilized time effectively. (Broom closet ending)", true],
  ZEN_ENDING: ["🌌", "", "Space Out", "Hollis broke free. (Dissassociation ending)", true],
  ANA_CHOMP_GAME_OVER: ["💋", "", "Tackleglomp", "Overstepped some boundaries. (Ana game over)", true],
  WINDOW_GAME_OVER: ["🪟", "", "splat.MP3", "Tried to escape through the window. (Bathroom game over)", true],
  BYRON_SCRATCH_GAME_OVER: ["🩸", "...", "Only a flesh wound", "Attempted to deprive your superior of their rightful property. (Byron game over)", true],
  NIKKI_BITE_GAME_OVER: ["🙀", "...", "Love bite", "Tried to rescue Faith. (Nikki game over)", true],
};


// Lockr key is the name of the story, plus the savegame version.
Lockr.prefix = `${story.name} ${setup.ACHIEVEMENT_KEY_VERSION} `.replace(
  /\s/g,
  "_"
);

/**
 * @returns {string[]} The list of achievements which are currently unlocked.
 */
setup.getAchievements = () => Lockr.smembers("achievements");
/**
 * @returns {string[]} The list of all achievements, with unlocked ones first.
 */
setup.getAllAchievementsSorted = () => {
  return [
    ...Object.keys(setup.ALL_ACHIEVEMENTS).filter((k) =>
      setup.hasAchievement(k)
    ),
    ...Object.keys(setup.ALL_ACHIEVEMENTS).filter(
      (k) => !setup.hasAchievement(k)
    ),
  ];
};
/**
 * @returns {[number, number]} The number of active achievements, and the total.
 */
setup.getAchievementCount = () => {
  let count = setup.getAchievements().length;
  let total = Object.entries(setup.ALL_ACHIEVEMENTS).filter(
    ([key, [emoji, hint, name, desc, hidden]]) => setup.hasAchievement(key) || !hidden).length;
    return [count, total];
};
/**
 * @param {string} name The name of a valid achievement.
 * @throws If the name is not a defined achievement.
 */
setup.addAchievement = (name) => {
  if (name in setup.ALL_ACHIEVEMENTS) {
    Lockr.sadd("achievements", name);
  } else {
    throw new Error(`${name} is not a valid achievement.`);
  }
};
/**
 * @param {string} name The name of an achievement
 * @returns Whether the given achievement has been acquired.
 */
setup.hasAchievement = (name) => Lockr.sismember("achievements", name);

setup.addAllAchievements = () => {
  Object.keys(setup.ALL_ACHIEVEMENTS).forEach(setup.addAchievement);
  story.show(passage.id);
};
setup.resetAchievements = () => Lockr.set("achievements", []);

setup.resetAchievementsPrompt = function () {
  const message = `This will reset your save file, including the ${setup.getAchievements().length
    } achievement(s) you have acquired so far.\n\nAre you sure you want to continue?`;
  if (window.confirm(message)) {
    Lockr.flush();
    setup.restart();
  }
};

/*
 * Story Flags API. These are represented as a hashset on an object.
 */

/** Get all flags which are set.
 * @returns {object} Returns an object { [flagName]: count, ... }
 */
setup.getFlags = () => Lockr.get("flags", {});
/**
 *
 * @param {string} name The flag to check
 * @returns
 */
// Returns whether a flag is set to a non-zero value
setup.isFlagSet = (name) => {
  return !!Lockr.get("flags", {})[name];
};
/** Gets the count of a flag
 * @param {string} name The name of the flag to check
 * @returns {number} The number of times the flag was set
 */
setup.getFlag = (name) => {
  let flags = Lockr.get("flags", {});
  return +flags[name] | 0;
};
/**
 * @param {string} name The flag to set
 * @param {number} count The number to set it to (integer >= 0)
 */
setup.setFlag = (name, count = 1) => {
  let flags = Lockr.get("flags", {});
  flags[name] = Math.max(0, +count | 0); // increment
  Lockr.set("flags", flags);
};
/**
 * Adds a flag with the given name to the set of flags.
 * @param {string} name The flag to increment
 * @param {number} amt An integer number to add/subtract
 */
setup.addFlag = (name, amt = 1) => {
  let count = setup.getFlag(name);
  count = Math.max(0, (count + +amt) | 0); // increment
  setup.setFlag(name, count);
};
/**
 * Unsets a flag
 * @param {string} name The flag to unset
 */
setup.unsetFlag = (name) => {
  let flags = Lockr.get("flags", {});
  flags[name] = undefined;
  Lockr.set("flags", flags);
};
/**
 * Unsets all flags.
 */
setup.resetFlags = () => Lockr.set("flags", {});
