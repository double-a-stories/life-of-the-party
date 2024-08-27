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
  // reference to "All She Wrote" by FireHouse.
   ALL_ACHIEVEMENTS: ["🌟", "", "All Vi Wrote (All Endings)", "Got every hidden ending. That's all, folks!", true],
   // reference to "LA Devotee" by Panic!
   ALL_STORY_ACHIEVEMENTS: ["🥇", "", "LOTP Devotee (All Preds)", "Completed every character's story route. Thanks for playing!", true],
   // "Rebel Girl" by Bikini Kill
   ANA_VORE_ENDING: ["🗑️", "Outside...", "Rebel Girl  (Ana Vore Ending)", "Made dinner for a new friend."],
   // "Heads Will Roll" ("Dance Till You're Dead") by Yeah Yeah Yeahs
   BASIL_VORE_ENDING: ["🐴", "Dance...", "Dance, Dance, Till You're...  (Basil Vore Ending)", "Became the center of attention."],
   // "Michael in the Bathroom" from the musical Be More Chill
   HAZEL_VORE_ENDING: ["🐻", "Bathroom...", "Hollis in the Bathroom (Hazel Vore Ending)", "Reunited with a familiar face."],
   // Pun on the phrase "dog and pony show"
   LACEY_VORE_ENDING: [`🎠`, "Bedroom...", "Horse and Guinea Show (Lacey Vore Ending)", "Found your friend."],
   // "Been Caught Stealing" by Jane's Addiction
   REN_VORE_ENDING: ["🦊", "Garage...", "Been Caught Stealing (Ren Vore Ending)", "Went on a joy ride. 🐇🥱😊!!!"],
   // "A Fever You Can't Sweat Out" by Panic!
   BYRON_VORE_ENDING: ["🐺", "Couch...", "A Belly You Can't Get Out (Byron Vore Ending)", "Learned your place."],
   // Pun on "wine and dine"
   NIKKI_NOX_VORE_ENDING: ["🍸", "Drink...", "Sauced & Swallowed (Nikki & Nox Ending)", "Tried something new."],
   // Shallow reference to The Stanley Parable
   CLOSET_ENDING: ["🧹", "Closet...", "My Favorite (Broom Closet Ending)", "Utilized time effectively.", true],
   // Reference to a Looney Toons cartoon
   ZEN_ENDING: ["🌌", "", "Spaced Out Bunny (Dissassociation Ending)", "Logged off.", true],
   // 
   ANA_CHOMP_GAME_OVER: ["💋", "", "Tackleglomp (Ana Game Over)", "Overstepped some boundaries.", true],
   // Reference to Deltarune. https://youtu.be/bE4wp4DtF84?t=46
   WINDOW_GAME_OVER: ["🪟", "", "splat.MP3  (Bathroom Game Over)", "Tried to escape through the window.", true],
   // Pun on "liar pants on fire"
   REN_BITE_GAME_OVER: ["😡", "", "Liar Liar, Neck's On Fire (Ren Game Over)", "Brought a rabbit to a fox fight.", true],
   // Monty Python reference.
   BYRON_SCRATCH_GAME_OVER: ["🩸", "", "Only a Flesh Wound (Byron Game Over)", "Attempted to deprive your superior of their rightful property.", true],
   // That thing cats do when they bite your hand.
   NIKKI_BITE_GAME_OVER: ["🙀", "", "Love bite (Nikki Game Over)", "Tried to rescue Faith.", true],
  };
  
  /**
  * 
  * @returns {string} A formatted table
  */
  static renderTable() {
    return `<table class="table">
      ${
        Achievements.getSorted()
        .map(key => [key, ...Achievements.ALL_ACHIEVEMENTS[key]])
        .map(([key, emoji, hint, name, desc, hidden]) => {
          let unlocked = Achievements.has(key);
          if (hidden && !unlocked) return undefined; 
          return `
          <tr class="${!unlocked ? "locked-achievement" : ""}">
            <td>${!unlocked ? "🔒" : emoji}</span></td>
            <td width="99%">
              <b>${!unlocked ? "???" : name}</b>
              ${!unlocked ? "" : "<br>"}
              ${!unlocked ? `<i>${hint}</i>` : desc}
            </td>
          </tr>
          `;
        }).join(`\n`)
      }
    </table>`;
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
  * @returns {string} The portion of achievements unlocked
  */
  static percent() {
    const unlocked = this.getUnlocked().length;
    const total = Object.entries(this.ALL_ACHIEVEMENTS).length;
    return (unlocked / total * 100).toFixed(0) + "%";
  }



  /**
  * @param {string} name The name of a valid achievement.
  * @throws If the name is not a defined achievement.
  */
  static unlock(key) {
    if (!(key in Achievements.ALL_ACHIEVEMENTS)) {
      throw new Error(`${key} is not a valid achievement.`);
    }
    if (Achievements.has(key)) {
      return "";
    }
    Lockr.sadd("achievements", key);
    const [emoji, hint, title, desc] = Achievements.ALL_ACHIEVEMENTS[key];

    setup.playAchievementSound();
    
    // side effect: show toast on next passage load.
    const $toast = $(`
    <div class="achievement-toast">
      <div class="achievement-toast__icon">
        ${twemoji.parse(emoji)}
      </div>
      <h3>${title}</h3>
      <p>${desc}</p>
      </div>
    </div>`);
    $toast.appendTo("body").hide();
    $toast.hide().slideDown("slow").delay(3000).slideUp("slow", () => $toast.remove());
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