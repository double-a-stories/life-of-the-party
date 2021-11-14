/**
 * achievements.js (MIT-0)
 * A basic API for managing persistent story state, achievements, global flags, etc.
 */

window.setup = window.setup || {};

// Achievement version
// Can be updated to introduce breaking changes with previous achievement formats.
const ACHIEVEMENT_KEY_VERSION = 8;

window.achievementStorage = new PersistentStorageList(
  story.name + ACHIEVEMENT_KEY_VERSION + "achievements"
);

/**  @returns {[name: string, desc: string][]} The list of achivemeent. ∏*/
setup.getAchievements = () => achievementStorage.getData();
/**
 *
 * @param {string} name The name of the achievement, e.g. "Ana Ending"
 * @param {string} desc A witty namme for the achievement e.g "No Laughing Matter"
 */
setup.addAchievement = (name, desc) => {
  if (!setup.getAchievements().some((a) => a[0] == name)) {
    achievementStorage.add([name, desc]);
  }
};

/** Removes all achievements. */
setup.resetAchievements = () => achievementStorage.setData([]);

/** @type {boolean} Whether or not achievements are persistent. */
setup.localStorageWorks = !achievementStorage.noStorage;

/** Prompts the user to reset their save data. */
setup.resetAchievementsPrompt = function () {
  const message = `This will reset your save file, including the ${
    setup.getAchievements().length
  } achievement(s) you have acquired so far.

Are you sure you want to continue?`;
  if (window.confirm(message)) {
    setup.resetAchievements();
    setup.resetFlags();
    setup.restart();
  }
};

/**
 * @type {PersistentFlags} Global setup flags.
 */
const flagStorage = new PersistentFlags(story.name + "flags");
/** @returns {string[]} The list of set flags */
setup.getFlags = () => flagStorage.getFlags();
/**
 * @params {string} name The name of the flag to check.
 * @returns {boolean} Whether or not the given flag is set. */
setup.isFlagSet = (name) => flagStorage.isFlagSet(name);
/** @params {string} The flag to set. */
setup.setFlag = (name) => flagStorage.setFlag(name);
/** @params {string} The flag to unset. */
setup.unsetFlag = (name) => flagStorage.unsetFlag(name);
/** Unsets all set flags. */
setup.resetFlags = () => flagStorage.resetFlags();
