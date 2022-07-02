/**
 * @author double-a-stories
 * @license MIT-0
 */

// @ts-ignore
const Rule63 = window.Rule63 = {};
(() => {
  "use strict";


  ///////////////////////////////////
  // Code for handling R63 state   //
  ///////////////////////////////////

  /**
   * @returns {Setting} The current Rule63 mode setting
   */
  const getSetting = () => setup.getFlag("rule63Mode") ?? Setting.DISABLED;
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
   *
   * @param {Setting} val
   */
  const setSetting = (val) => {
    if (Object.values(Setting).includes(val)) {
      setup.setFlag("rule63Mode", val);
    } else {
      throw new Error(`invalid param at setModes('${val}')`);
    }
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

  const defineRule63GetterProp = (name, defaultValue, opposite = false) => {
    const namespace = window;
    if (name in window) {
      throw new Error(`Property ${namespace}.${name} is already defined!`);
    }
    Object.defineProperty(namespace, name, {
      get: () => getGender(defaultValue, opposite)
    });
  }

  // export to the setup namespace
  Object.assign(Rule63, {
    isEnabled,
    setSetting,
    getSetting,
    Setting,
    Gender,
    define: defineRule63GetterProp,
    getRule63Message
  });
})();
