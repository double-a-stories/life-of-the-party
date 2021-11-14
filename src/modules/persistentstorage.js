/**
 * persistentstorage.js (MIT-0)
 * Defines several classes for storing complex objects in window.localStorage.
 */


/**
 * An API for reading and writing arbitrary key-value objects which will persist between browsing sessions.
 */
window.PersistentStorage = class {
  /**
   * @param {string} key The key on localStorage to store data at.
   */
  constructor(key) {
    this.key = key;
    try {
      localStorage.getItem(this.key);
    } catch (err) {
      console.error(
        "Failed reading from localStorage. Data will not be saved persistently."
      );
      this.noStorage = true;
    }
  }
  /**
   * @param {object} object A new data object which will replace the stored data object.
   */
  setData(obj) {
    let json = JSON.stringify(obj);
    if (!this.noStorage) {
      localStorage.setItem(this.key, json);
    }
    // Invalidate cache.
    this._cached = JSON.parse(json);
  }
  /**
   * @returns {object} The stored data object
   */
  getData() {
    // If we have a cached object, or localStorage is broken...
    if (this._cached != undefined || this.noStorage) {
      return this._cached;
    }
    try {
      let json = localStorage.getItem(this.key);
      // Check that we got a value out.
      if (json) {
        let parsedObj = JSON.parse(json);
        this._cached = parsedObj;
        return parsedObj;
      }
    } catch (err) {
      console.error(err);
      console.error("Something went wrong parsing localStorage.");
      localStorage.setItem(this.key, undefined);
      return undefined;
    }
  }

  /**
   * Encodes a string of Unicode characters into Base64
   * @param {string} str Input string, e.g. "Héllø wørl∂!"
   * @returns {string} The input string, encoded. e.g. "SMOpbGzDuCB3w7hybOKIgiE="
   */
  static utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * Decodes a string of Base64 characters, and decodes escaped Unicode
   * @param {string} b64 Input string, e.g. "SMOpbGzDuCB3w7hybOKIgiE="
   * @returns {string} The input string, decoded, e.g. "Héllø wørl∂!"
   */
  static atou(b64) {
    return decodeURIComponent(escape(window.atob(b64)));
  }
}

/**
 * A persistent array of objects.
 */
window.PersistentStorageList = class extends PersistentStorage {
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
      this.setData(arr.filter((v) => v !== value));
    }
  }
  includes(value) {
    return this.getData().includes(value);
  }
  clear() {
    this.setData([]);
  }
}


/**
 * Represents a map of named flags which are either true or false.
 * Persists between sessions.
 */
window.PersistentFlags = class {
  constructor(key) {
    /** @type {PersistentStorage} */
    this._pStorage /** {} */ = new PersistentStorage(key);
    if (this._pStorage.getData() === undefined) {
      this._pStorage.setData({});
    }
  }
  /**
   * @returns {string[]} The list of flag names which have been set
   */
  getFlags() {
    if (typeof this._pStorage.getData() !== "object") {
      this.resetFlags();
    }
    return Object.keys(this._pStorage.getData());
  }
  /**
   * @param {string} name The flag to check
   * @returns {boolean} Whether or not the given flag is set.
   */
  isFlagSet(name) {
    return this._pStorage.getData().hasOwnProperty(name);
  }
  /**
   * @param {string} name The flag to set. If already set, noop.
   */
  setFlag(name) {
    if (!this.isFlagSet(name)) {
      let newObj = { ...this._pStorage.getData() };
      newObj[name] = 1;
      this._pStorage.setData(newObj);
    }
  }
  /**
   * @param {string} name The flag to unset. If already unset, noop.
   */
  unsetFlag(name) {
    if (this.isFlagSet(name)) {
      let newObj = this._pStorage.getData();
      delete newObj[name];
      this._pStorage.setData(newObj);
    }
  }
  /**
   * Unsets all set flags.
   */
  resetFlags() {
    this._pStorage.setData({});
  }
}
