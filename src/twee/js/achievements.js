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
    ANA_VORE_ENDING: ["🗑️", "Outside...", "Rebel Girl", "Made a new friend. (Ana vore ending)"],
    BASIL_VORE_ENDING: ["🐴", "Dance...", "Party Animal", "Got everyone's attention. (Basil vore ending)"],
    HAZEL_VORE_ENDING: ["🐻", "Bathroom...", "A Grizzly's End", "Reunited with an old face. (Hazel vore ending)"],
    LACEY_VORE_ENDING: [`🎠`, "Bedroom...", "Two for One Meal", "Found your friend. (Lacey vore ending)"],
    REN_VORE_ENDING: ["🦊", "Garage...", "🐇🥱😊!!!", "Went on a joy ride. (Ren vore ending)"],
    BYRON_VORE_ENDING: ["🐺", "Couch...", "A Belly You Can't Get Out", "Learned your place. (Byron vore ending)"],
    NIKKI_NOX_VORE_ENDING: ["🍸", "Drink...", "Sauced & Swallowed", "Tried something new. (Nikki & Nox ending)"],
    CLOSET_ENDING: ["🧹", "Closet...", "My Favorite", "Utilized time effectively. (Broom closet ending)", true],
    ZEN_ENDING: ["🌌", "", "Space Out", "Hollis broke free. (Dissassociation ending)", true],
    ANA_CHOMP_GAME_OVER: ["💋", "", "Tackleglomp", "Overstepped some boundaries. (Ana game over)", true],
    WINDOW_GAME_OVER: ["🪟", "", "splat.MP3", "Tried to escape through the window. (Bathroom game over)", true],
    REN_BITE_GAME_OVER: ["😡", "", "Liar Liar, Neck's On Fire", "Brought a rabbit to a fox fight. (Ren game over)", true],
    BYRON_SCRATCH_GAME_OVER: ["🩸", "", "Only a flesh wound", "Attempted to deprive your superior of their rightful property. (Byron game over)", true],
    NIKKI_BITE_GAME_OVER: ["🙀", "", "Love bite", "Tried to rescue Faith. (Nikki game over)", true],
    ALL_STORY_ACHIEVEMENTS: ["🥇", "", "Dedicated", "Completed every story route. Thanks for playing!", true],
    ALL_ACHIEVEMENTS: ["🌟", "", "Completionist", "Got every hidden ending. That's all, folks!", true],
  };

  /**
  * 
  * @returns {string} A formatted table
  */
  static renderTable() {
    return passage.render(`<table class="table">
    <% for (const key of Achievements.getSorted()) {
      const [emoji, hint, name, desc, hidden] = Achievements.ALL_ACHIEVEMENTS[key];
      let unlocked = Achievements.has(key);
      if (hidden && !unlocked) continue; 
      %>
        <tr class="<% if (!unlocked) %>locked-achievement<%;%>">
          <td><%= unlocked ? emoji: "🔒" %></span></td>
          <td width="99%"><b><%= unlocked ? name : "???" %><%= hidden ? " (secret)" : "" %></b><%= unlocked ? "<br>" : "" %>
          <%= unlocked ? desc : "<i>" + hint + "</i>" %></td>
        </tr>
    <% } %>
    </table>`)
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
    const unlocked = this.getUnlocked().length;
    const total = Object.entries(this.ALL_ACHIEVEMENTS).filter(([key, [emoji, hint, title, desc, hidden]]) => !hidden || this.has(key)).length;
    return [unlocked, total];
  }

  /**
  * @param {string} name The name of a valid achievement.
  * @throws If the name is not a defined achievement.
  */
  static unlock(key) {
    if (!(key in Achievements.ALL_ACHIEVEMENTS)) {
      throw new Error(`${key} is not a valid achievement.`);
    }
    // if (Achievements.has(name)) {
    //   return "";
    // }
    Lockr.sadd("achievements", key);
    const [emoji, hint, title, desc] = Achievements.ALL_ACHIEVEMENTS[key];
    return `
    <div class="content-warning">
      <b>Achievement unlocked:</b> ${emoji} ${title}
    </div>`;
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
    return Lockr.get("flags", {});
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

$(window).on("sm.passage.shown", () => {
  if (!Achievements.has("ALL_STORY_ACHIEVEMENTS")) {
    if (Object.entries(Achievements.ALL_ACHIEVEMENTS)
      .filter(([key, [emoji, hint, title, desc, hidden]]) => !hidden)
      .map(([key, val]) => key)
      .every(Achievements.has)) {
      $(Achievements.unlock("ALL_STORY_ACHIEVEMENTS")).prependTo("tw-passage");
    }
  }
  if (!Achievements.has("ALL_ACHIEVEMENTS")) {
    if (Object.entries(Achievements.ALL_ACHIEVEMENTS)
      .filter(([key, val]) => key != "ALL_ACHIEVEMENTS")
      .map(([key, val]) => key)
      .every(Achievements.has)) {
      Achievements.unlock("ALL_ACHIEVEMENTS");
    }
  }
});