/**
 * @file Keyboard navigation module for Snowman stories
 * @author Double-A <https://github.com/double-a-stories>
 * @license MIT-0
 */
window.keybinds = {};

/** Global toggle. If false, keypresses will not be intercepted. */
keybinds.enabled = true;

/**
 * Markdown description for the keybinds.
 * Insert in your story using <%= keybinds.KEYBINDS_DOCS %>
 */
keybinds.KEYBINDS_DOCS = `
#### Navigation
* <kbd>W</kbd> / <kbd>K</kbd> — *Select previous.*
* <kbd>S</kbd> / <kbd>J</kbd> — *Select next.*
* <kbd>E</kbd> / <kbd>␣</kbd> — *Use selected link.*

#### Time travel
* <kbd>A</kbd> / <kbd>H</kbd> — *Undo last command.*
* <kbd>D</kbd> / <kbd>L</kbd> — *Redo last command.*
`;

const KEYBIND_THROTTLE = 100; /* ms */

const handleKeybind = (ev) => {
  if (!keybinds.enabled) {
    return; // keybinds disabled
  }
  const KEYBINDS = {
    // <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values>
    // WASD BINDINGS
    w: focusPrev,
    s: focusNext,
    a: undo,
    d: redo,
    e: selectFocused,
    // VIM-STYLE BINDINGS
    j: focusNext,
    k: focusPrev,
    h: undo,
    l: redo,
    " ": selectFocused,
  };
  // If we're focused on a text field, ignore keypresses.
  if (!$(ev.target).is("input[type!='button'], [contenteditable]")) {
    const key = ev.key;
    if (key in KEYBINDS) {
      KEYBINDS[key](); // call the function
      ev.preventDefault(); //
    }
  }
}

// Detect keybinds
document.addEventListener("keydown", _.throttle(handleKeybind, KEYBIND_THROTTLE));

/** Attempts to move focus to the next element on the page. If no element is focused, focus the first element inside the passage tag. */
const focusNext = () => {
  const focusables = getFocusables();
  let index = focusables.indexOf(getFocused());
  if (index > -1) {
    focusables[index + 1]?.focus();
  } else {
    getFirstFocusable()?.focus();
  }
};
/** Attempts to move focus to the previous element on the page. If no element is focused, focus the element before the first element inside the passage tag. */
const focusPrev = () => {
  const focusables = getFocusables();
  // Try to get the currently focused element. Else get the first one.
  let index = focusables.indexOf(getFocused() || getFirstFocusable());
  const target = focusables[index - 1] || focusables[index];
  target?.focus();
};

/** Activates (by clicking) the currently focused element. If not focused, triggers focusNext. */
const selectFocused = () => {
  let el = getFocused();
  if (el) {
    el.click();
  } else {
    focusNext();
  }
};
/** Rewinds the story, as if by pressing the browser back button. */
const undo = () => {
  setup.undo();
};
/** Replays the last command, as if by presing the browser foward button. If none, triggers selectFocused */


const redo = () => {
  selectFocused(); // focused element? select it!
  setup.redo(); // attempt to go forward in history.
  // the focus function should only complete if the forward command failed.
};

/**
 * @returns {Element[]} An array of all elements on the page which could be focused.
 */
const getFocusables = (parent) => {
  parent = parent || document;
  const isVisible = (el) => el.offsetParent !== null;
  const nodeList = parent.querySelectorAll(
    // a list of elements which are focusable
    "a[href], button, input, select, [tabindex]"
  );
  return Array.from(nodeList).filter(isVisible);
};

/** @returns {Element|null} The current element which is focused */
const getFocused = () => {
  const focused = document.activeElement;
  return focused !== document.body ? focused : null;
};

/** @returns {Element} The first focus target on the page, starting inside the tw-passage element. */
const getFirstFocusable = () => {
  return (
    getFocusables(document.querySelector("tw-passage"))[0] || getFocusables()[0]
  );
};

keybinds = {
  ...keybinds,
  selectFocused,
  getFocused,
  focusNext,
  focusPrev,
  undo,
  redo,
};
