/**
 * achievements.js
 *
 * A plugin for "Life of the Party". Manages story flags which are preserved
 * between sessions.
 * Provides an API for persistent browser storage, using Lockr
 * License: MIT-0
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
 * These achievements are used in Life of the Party
 * Lotp Achievements are stored like [emoji, location, title, description]
 */
setup.ALL_ACHIEVEMENTS = setup.ALL_ACHIEVEMENTS || {};

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
  return [
    setup.getAchievements().length,
    Object.keys(setup.ALL_ACHIEVEMENTS).length,
  ];
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
  const message = `This will reset your save file, including the ${
    setup.getAchievements().length
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
