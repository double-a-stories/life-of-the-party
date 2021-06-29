// Persistent Storage API
// LICENSE: MIT-0

window.setup = window.setup || {};

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
  }
  // Convert a JS object into JSON, then base64
  // Set it on localStorage.
  setData(object) {
    // Invalidate cache.
    this._cached = undefined;
    let json = JSON.stringify(object);
    let base64 = utoa(json);
    localStorage.setItem(this.key, base64);
  };
  // Get the value from localStorage, and attempt to decode.
  getData() {
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
        console.error("Something went wrong parsing the .")
        this._cached = undefined;
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

const achievementStorage = new PersistentStorageSet(story.name + "achievements");

setup.getAchievements = () => achievementStorage.getData();
setup.addAchievement = (name) => achievementStorage.add(name);
setup.resetAchievements = () => achievementStorage.setData([]);

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
