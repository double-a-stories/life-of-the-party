/**
* @file A plugin for "Life of the Party". Manages story flags which are preserved between sessions.
* @author double-a-stories
* @license MIT-0
*/

/**
* setup - Global object.
*/
// @ts-ignore
window.setup = window.setup || {};

// @ts-ignore
const Lockr = window.Lockr;
if (Lockr == undefined) {
  // make sure Lockr is loaded.
  throw new Error("achievements.js: Lockr.js was not loaded in time!");
}

/** Savegame format version
* Can be updated to introduce breaking changes with previous achievement storage formats. */
const ACHIEVEMENT_KEY_VERSION = 8;

// Lockr key is the name of the story, plus the savegame version.
Lockr.prefix = `${story.name} ${ACHIEVEMENT_KEY_VERSION} `.replace(
  /\s/g,
  "_"
);

const Achievements = window.Achievements = class Achievements {
  /**
  * These achievements are used in Life of the Party
  * Lotp Achievements are stored like [emoji, location, title, description]
  */
  static ALL_ACHIEVEMENTS = {
    ANA_VORE_ENDING: ["🗑️", "Outside Route", "No Laughing Matter", "Ana Ending"],
    BASIL_VORE_ENDING: ["🐴", "Party Route", "Party Animals", "Basil Ending"],
    HAZEL_VORE_ENDING: ["🐻", "Bathroom Route", "A Grizzly End", "Hazel Ending", "..."],
    LACEY_VORE_ENDING: [`🎠`, "Bedroom Route", "Two for One Meal", "Lacey Ending", "Search...?"],
    REN_VORE_ENDING: ["🦊", "Garage Route", "🐇🥱😊!!!", "Ren Ending"],
    BYRON_VORE_ENDING: ["🐺", "Wolf Route", "Anyway, Here's...", "Byron Ending"],
    NIKKI_NOX_VORE_ENDING: ["🍸", "Sauce Route", "Sauced & Swallowed", "Nikki & Nox Ending"],
    CLOSET_ENDING: ["🧹", "Closet Route", "Worth it?", "Broom Closet Ending"],
    ZEN_ENDING: ["🌌", "Bench Route", "Space Out", "Zen Ending"],
  };

  /**
  * 
  * @returns {string} A formatted table
  */
  static renderTable() {
    return passage.render(`<table class="table">
      <% for (const key of Achievements.getSorted()) {
        const [emoji, route, name, desc] = Achievements.ALL_ACHIEVEMENTS[key];
        let unlocked = Achievements.has(key); %>
        <tr class="<% if (!unlocked) %>locked-achievement<%;%>">
        <td><%= unlocked ? emoji: "🔒" %></span></td>
        <td><%= unlocked ? \`<b>\${route}</b>\` : route %></td>
        <td><%= unlocked ? \`"\${name}" <i>(\${desc})</i>\` : \`<i>(Locked achievement)</i>\` %></td>
        </tr>
        <% } %>
        </table>`);
  }

  /**
  * @returns {string[]} The list of achievements which are currently unlocked.
  */
  static getUnlocked() {
    return Lockr.smembers("achievements");
  }

  /**
  * @returns {string[]} The list of all achievements, with unlocked ones first.
  */
  static getSorted() {
    return [
      ...Object.keys(this.ALL_ACHIEVEMENTS).filter((k) =>
        Achievements.has(k)
      ),
      ...Object.keys(this.ALL_ACHIEVEMENTS).filter(
        (k) => !Achievements.has(k)
      ),
    ];
  };


  /**
  * @returns {[number, number]} The number of active achievements, and the total.
  */
  static count() {
    return [
      this.getUnlocked().length,
      Object.keys(this.ALL_ACHIEVEMENTS).length,
    ];
  }

  /**
  * @param {string} name The name of a valid achievement.
  * @throws If the name is not a defined achievement.
  */
  static unlock(name) {
    if (name in this.ALL_ACHIEVEMENTS) {
      Lockr.sadd("achievements", name);
    } else {
      throw new Error(`${name} is not a valid achievement.`);
    }
  }

  /**
  * @param {string} name The name of an achievement
  * @returns {boolean} Whether the given achievement has been acquired.
  */
  static has(name) {
    return Lockr.sismember("achievements", name);
  }

  static unlockAll() {
    Object.keys(this.ALL_ACHIEVEMENTS).forEach(this.unlock);
    story.show(passage.id);
  };

  static reset() {
    Lockr.set("achievements", []);
  }

  static promptReset() {
    const message = `This will reset your save file, including the ${Achievements.getUnlocked().length
      } achievement(s) you have acquired so far.\n\nAre you sure you want to continue?`;
    if (window.confirm(message)) {
      Lockr.flush();
      setup.restart();
    }
  }
}

/*
* Story StoryFlags API. These are represented as a hashset on an object.
*/
const StoryFlags = window.StoryFlags = class StoryFlags {
  /** Get all flags which are set.
  * @returns {object} Returns an object { [flagName]: count, ... }
  */
  static getAll() {
    Lockr.get("flags", {});
  }

  /**
  * @param {string} name The flag to check
  * @returns {boolean} Wether a flag is set to a non-zero value
  */
  static isSet(name) {
    return !!Lockr.get("flags", {})[name];
  }

  /** Gets the count of a flag
  * @param {string} name The name of the flag to check
  * @returns {number} The number of times the flag was set
  */
  static get(name) {
    let flags = Lockr.get("flags", {});
    return +flags[name] | 0;
  }

  /**
  * @param {string} name The flag to set
  * @param {number} count The number to set it to (integer >= 0)
  */
  static set(name, count = 1) {
    let flags = Lockr.get("flags", {});
    flags[name] = Math.max(0, +count | 0); // increment
    Lockr.set("flags", flags);
  }

  /**
  * Adds a flag with the given name to the set of flags.
  * @param {string} name The flag to increment
  * @param {number} amt An integer number to add/subtract
  */
  static increment(name, amt = 1) {
    let count = this.get(name);
    count = Math.max(0, (count + +amt) | 0); // increment
    this.set(name, count);
  }

  /**
  * Unsets a flag
  * @param {string} name The flag to unset
  */
  static unset(name) {
    let flags = Lockr.get("flags", {});
    flags[name] = undefined;
    Lockr.set("flags", flags);
  }

  static reset() {
    Lockr.set("flags", {});
  }
}

