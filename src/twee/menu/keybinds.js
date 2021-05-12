/*
 * Keyboard Controls
 */

window.setup = window.setup || {};

const controls = {};

controls.getFocusables = () => $("a[href], button, input, select, [tabindex]").filter(":visible");

controls.focusNext = () => {
  const $focusables = controls.getFocusables();
  let index = $focusables.index(document.activeElement);
  if (index != -1) {
    $focusables.eq(index + 1).focus();
  } else {
    if (story.$passageEl.find($focusables)[0]) {
      story.$passageEl.find($focusables).first().focus();
    } else {
      $focusables.first().focus();
    }
  }
}
controls.focusPrev = () => {
  const $focusables = controls.getFocusables();
  let index = $focusables.index(document.activeElement);
  if (index >= 0) {
    $focusables.eq(index - 1).focus();
  } else {
    controls.focusNext();
    controls.focusPrev();
  }
}
controls.selectFocused = () => {
  const $focusables = controls.getFocusables();
  if ($focusables.index(document.activeElement) != -1) {
    document.activeElement.click();
  } else {
    controls.focusNext();
  }
}
controls.goNext = () => {
  let p = passage.id;
  if (!$(":focus")[0]) {
    window.history.forward();
  }
  if (p == passage.id) {
    controls.selectFocused();
  }
}

$(document).keydown((e) => {
  if ($(e.target).is("input[type!='button'], [contenteditable]")) {
    return
  }
  switch (e.key.toLowerCase()) {
    case "e":
    case " ":
      controls.selectFocused();
      e.preventDefault();
      break;
    case "h":
    case "a":
      setup.undo();
      e.preventDefault();
      break;
    case "d":
    case "l":
      controls.goNext();
      e.preventDefault();
      break;
    case "w":
    case "k":
      controls.focusPrev();
      e.preventDefault();
      break;
    case "s":
    case "j":
      controls.focusNext();
      e.preventDefault();
      break;
  }
});