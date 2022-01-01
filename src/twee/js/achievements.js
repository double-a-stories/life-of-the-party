/**
 * achievements.js
 * Provides an API for persistent browser storage, using Lockr
 * Author: Double-A <https://github.com/double-a-stories>
 * License: MIT-0
 */

/**
 * setup - Global object.
 */
window.setup = window.setup || {};

// Savegame format version
// Can be updated to introduce breaking changes with previous achievement storage formats.
const ACHIEVEMENT_KEY_VERSION = 8;

// This object stores valid achievement names. Create it if it isn't already defined.
setup.ALL_ACHIEVEMENTS = setup.ALL_ACHIEVEMENTS || {};

// Lockr key is the name of the story, plus the savegame version.
Lockr.prefix = (`${story.name} ${ACHIEVEMENT_KEY_VERSION} `).replace(/\s/g, "_");

/**
 * @returns {string[]} The list of achievements which are currently unlocked.
 */
setup.getAchievements = () => Lockr.smembers("achievements");
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
setup.hasAchievement = (name) => 
  Lockr.sismember("achievements", name);

setup.addAllAchievements = () => {
  Object.keys(setup.ALL_ACHIEVEMENTS).forEach(setup.addAchievement);
  story.show(passage.id);
}
setup.resetAchievements = () => Lockr.set("achievements", []);

setup.resetAchievementsPrompt = function () {
  const message = `This will reset your save file, including the ${setup.getAchievements().length} achievement(s) you have acquired so far.

Are you sure you want to continue?`;
  if (window.confirm(message)) {
    Lockr.flush();
    setup.restart();
  }
}

setup.getFlags = () => Lockr.get("flags", {});
setup.isFlagSet = (name) => !!Lockr.get("flags", {})[name];
setup.setFlag = (name, val = true) => Lockr.set("flags", { ...Lockr.get("flags"), [name]: val })
setup.unsetFlag = (name) => {
  Lockr.set("flags", { ...Lockr.get("flags"), [name]: undefined });
}
setup.resetFlags = () => Lockr.set("flags", {});