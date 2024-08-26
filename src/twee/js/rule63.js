/**
 * @author double-a-stories
 * @license MIT-0
 * 
 * This module is an over-engineered utility for getting a character's 
 * and allowing it to be swapped according to several rules.
 */

// @ts-ignore
const Rule63 = window.Rule63 = window.R = {};
(() => {
  "use strict";


  ///////////////////////////////////
  // Code for handling R63 state   //
  ///////////////////////////////////

  /**
   * @returns {Setting} The current Rule63 mode setting
   */
  const getSetting = () => StoryFlags.get("rule63Mode") ?? Setting.DISABLED;
  /** @returns {boolean} Whether Rule63 mode is enabled */
  const isEnabled = () => getSetting() !== Setting.DISABLED;

  /**
   * @enum {number} Possible states
   */
  const Setting = {
    DISABLED: 0,
    PREFER_MALE: 1,
    PREFER_FEMALE: 2,
    NEUTER: 3,
  };
  /**
   * @param {Setting} val The Rule63 setting to use.
   */
  const setSetting = (val) => {
    if (!Object.values(Setting).includes(val)) {
      throw new Error(`invalid param at setModes('${val}')`);
    }
    StoryFlags.set("rule63Mode", val);
    // side effect: update the page background
    setBackground();
    setup.refreshHeader();
  };

  /**
   * @enum {number} Determines how the pronouns should 
   */
  const Rule63Behavior = {
    /** Change pronouns to match preference */
    MATCH_PREFERENCE: 1,
    /** Change gender to match the opposite of the preference */
    OPPOSITE_PREFERENCE: 2,
    /** Don't change. */
    CONSTANT: 3,
  }

  /**
   * Character genders.
   * 
   * @enum {number}
   */
  const Gender = {
    Male: 1,
    Female: 0,
  }

  /**
   * 
   * @param {Gender} defaultGender 
   * @param {boolean?} opposite 
   * @returns 
   */
  const getGender = (defaultGender, opposite = false) => {
    switch (getSetting()) {
      case Setting.DISABLED:
        return defaultGender;
      case Setting.PREFER_FEMALE:
        return !opposite ? Gender.Female : Gender.Male;
      case Setting.PREFER_MALE:
        return !opposite ? Gender.Male : Gender.Female;
    }
  }

  const getRule63Message = (defaultGender, message="") => {
    const g = getGender(defaultGender);
    if (defaultGender !== getGender(defaultGender)) {
      return T.infoMessageBox(`Rule 63 Mode is enabled. This character will use <b>${g?"he/him":"she/her"}</b> pronouns. ${message}`);
    }
    return '';
  }

  /***
   * Creates a Getter property that returns an isMale boolean
   */
  const define = (name, defaultValue, opposite = false, namespace = Rule63) => {
    if (name in namespace) {
      throw new Error(`Property ${namespace}.${name} is already defined!`);
    }
    Object.defineProperty(namespace, name, {
      get: () => getGender(defaultValue, opposite)
    });
  }

  /**
   * Sets a class on the body if Male/Female mode is enabled.
   */
  const setBackground = () => {
    const setting = getSetting();
    // male
    if (setting === Setting.PREFER_MALE) {
      document.body.classList.add("rule63-male");
    } else {
      document.body.classList.remove("rule63-male");
    }
    // female
    if (setting === Setting.PREFER_FEMALE) {
      document.body.classList.add("rule63-female");
    } else {
      document.body.classList.remove("rule63-female");
    }
  }

  setBackground(); // invoke on page load

  // export to the setup namespace
  Object.assign(Rule63, {
    isEnabled,
    setSetting,
    getSetting,
    Setting,
    Gender,
    define,
    getRule63Message
  });
})();
