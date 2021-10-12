// Persistent Storage API
// LICENSE: MIT-0

window.setup = window.setup || {};

// Achievement version
// Can be updated to introduce breaking changes with previous achievement formats.
const ACHIEVEMENT_KEY_VERSION = 7;

// Encode unicode to base64
function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
// Decode base64 to unicode
function atou(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

// A helper class for reading and writing JSON objects to localStorage
class PersistentStorage {
  // key: the value used in localStorage
  // should be unique to this game
  constructor(key) {
    this.key = key;
    try {
      localStorage.getItem(this.key);
    } catch (err) {
      console.error("Failed reading from localStorage. Data will not be saved.")
      this.noStorage = true;
      console.error(err);
    }
  }
  // Convert a JS object into JSON, then base64
  // Set it on localStorage.
  setData(object) {
    // Invalidate cache.
    let json = JSON.stringify(object);
    let base64 = utoa(json);
    if (!this.noStorage) {
      localStorage.setItem(this.key, base64);
      this._cached = undefined;
    } else {
      this._cached = JSON.parse(json);
    }
  };
  // Get the value from localStorage, and attempt to decode.
  getData() {
    if (this.noStorage) {
      return this._cached;
    }
    if (this._cached == undefined) {
      try {
        let base64 = localStorage.getItem(this.key);
        // Check that we got a value out.
        if (base64) {
          let json = atou(base64);
          this._cached = JSON.parse(json);
        }
      } catch (err) {
        console.error(err);
        console.error("Something went wrong parsing localStorage.")
      }
    }
    return this._cached;
  };
}

// An array containing a set of unique values
// Used for achievements, story flags, et cetera.
class PersistentStorageSet extends PersistentStorage {
  constructor(key) {
    super(key);
    if (this.getData() == undefined) {
      this.clear();
    }
  }
  add(value) {
    const arr = this.getData();
    if (!this.includes(value)) {
      this.setData([...arr, value]);
    }
  }
  remove(value) {
    const arr = this.getData();
    if (arr.includes(value)) {
      this.setData(arr.filter(v => v !== value));
    }
  }
  includes(value) {
    return this.getData().includes(value);
  }
  clear() {
    this.setData([]);
  }
}

const achievementStorage = new PersistentStorageSet(story.name + ACHIEVEMENT_KEY_VERSION + "achievements");

setup.getAchievements = () => achievementStorage.getData();
setup.addAchievement = (name, desc) => {
  if (!setup.getAchievements().some(a => a[0] == name)) {
    achievementStorage.add([name, desc]);
  }
};
setup.resetAchievements = () => achievementStorage.setData([]);
setup.localStorageWorks = achievementStorage.noStorage;

setup.resetAchievementsPrompt = function() {
  const message = `This will reset your save file, including the ${setup.getAchievements().length} achievement(s) you have acquired so far.

Are you sure you want to continue?`;
  if(window.confirm(message)) {
    setup.resetAchievements();
    setup.resetFlags();
    setup.restart();
  }
}

const flagStorage = new PersistentStorageSet(story.name + "flags");

setup.getFlags = () => flagStorage.getData();
setup.isFlagSet = (name) => flagStorage.includes(name);
setup.setFlag = (name) => flagStorage.add(name);
setup.unsetFlag = (name) => flagStorage.remove(name);
setup.resetFlags = () => flagStorage.clear([]);
