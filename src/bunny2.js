/** Story Constants */
story.version = "v0.3.2";

// Warm Place to Stay Message
console.log(`
========================================================

Hi there! Thanks for reading A Warm Place to Stay.

If you're snooping around in the dev console, it probably
means you're looking for some secret goodies or easter
eggs.

There's not really much hidden content to speak of yet,
but you can execute this command to enable debug commands.

storyFlags.assign({showDebug: true}); location.reload();

Those commands are mostly just for testing, but they'll
let you switch Zasha's gender, warp to any passage, and
spawn with 200 HP and all weapons.

Maybe not that last one, actually.

-AA

=========================================================
`)

/**
 * Snowbunny 0.2
 * A set of fairly specific tweaks, plugins, and helper functions for
 * Twine+Snowman-based games.
 */
window.bunny = window.bunny || {};

console.debug(`Initializing game ${bunny.storyVersion}`);

// Wraps the jQuery command to add event listeners on sm.passage.shown.
bunny.addPassageEventListener = (func) => $(window).on('sm.passage.shown', func);

/* DOM Manipulations */

// Move story-defined CSS into <head>, so that styles declared
// inside the passage body take higher priority.
$("tw-story > style").appendTo($("head"));

// Passage tags are applied to <body data-tags> for easy CSS styling.
bunny.addPassageEventListener(() => {
    $("body").attr("data-tags", passage.tags.join(" "));
    // Selector: body[data-tags~="mytag"]
});

/*
 * History Commands
 */

/**
 * Go back to the previous passage.
 * Returns true if the user is now on a different passage.
 */
bunny.undo = () => {
    let current_p = window.passage.id;
    window.history.back();
    return (current_p != window.passage.id);
}
/** Clear state, and return to start. */
bunny.restart = () => {
    // explicitly carry over the gender setting
    let g = story.state.g;
    story.state = {
        g
    };
    story.history = [];
    story.show(story.startPassage);
}
// save a Snowman checkpoint on every passage.
$(window).on('sm.passage.shown', (event, {
    passage
}) => {
    story.checkpoint(); // required for "undo" to restore previous state

});

// Add a fadein effect when loading passages.
// Can be disabled by adding the "no_fade" tag
$(window).on('sm.passage.shown', (event, {passage}) => {
    if (!passage.tags.includes("no_fade")) {
        $("tw-passage").css({
            opacity: 0
        }).animate({
            opacity: 1
        }, "slow")
    }
})
// When a new passage loads, scroll to the top and unfocus selection.
$(window).on('sm.passage.shown', (event, {
    passage
}) => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    }); // scroll to top
    $(":focus").blur(); // deselect selected item
});
/** bunny.rerender
 * Rerenders the current passage, perserving focus.
 * Snowman doesn't support watched "live" variables, so this is useful
 * if you need a link to update a variable on the current page.
 */
bunny.rerender = () => {
    const focusIndex = controls.getFocusables()
        .index(document.activeElement);
    renderToSelector("tw-passage", passage.id);
    controls.getFocusables().eq(focusIndex).focus();
}

/*
 * DEBUG: Handle Snowman Errors without Crashing
 */
story.ignoreErrors = true;
$(window).on("sm.story.error", (event, error) => {
    if (story.ignoreErrors) {
        const message =
            `${error.message}
        ---
        Error occured while viewing "${window.passage ? passage.name : "undefined"}". Check debug console for for details.

        To report this bug, please message the developer with the following:
        1) What version is your browser?
        2) Steps to reproduce?
        3) A screenshot of the debug console
        `;
        window.alert(message);
        console.error(error);
    }
})
/*
 * DEBUG: Reset startpassage, even if Twine loaded from another passage.
 */
$(window).one("sm.passage.shown", (event, {
    passage
}) => {
    let index = story.passages.findIndex(e => e && e.tags.includes("start"));
    if (index != -1) {
        story.startPassage = index;
    }
})
/*
 * Keyboard Controls
 */
window.controls = window.controls || {}; {
    controls.getFocusables = () => $("a[href], button, input, select, [tabindex]").filter(":visible");

    controls.focusNext = () => {
        const $focusables = controls.getFocusables();
        let index = $focusables.index(document.activeElement);
        if (index != -1) {
            $focusables.eq(index + 1).focus();
        } else {
            if ($("tw-passage").find($focusables)[0]) {
                $("tw-passage").find($focusables).first().focus();
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
}
$(document).keydown(function (e) {
    if ($(e.target).is("input[type!='button'], [contenteditable]") &&
        !e.key.startsWith("Arrow")) {
        return;
    }
    switch (e.key.toLowerCase()) {
        case "enter":
        case "e":
        case " ":
            controls.selectFocused();
            e.preventDefault();
            break;
        case "h":
        case "a":
        case "arrowleft":
            bunny.undo();
            e.preventDefault();
            break;
        case "d":
        case "l":
        case "arrowright":
            controls.goNext();
            e.preventDefault();
            break;
        case "w":
        case "k":
        case "arrowup":
            controls.focusPrev();
            e.preventDefault();
            break;
        case "s":
        case "j":
        case "arrowdown":
            controls.focusNext();
            e.preventDefault();
            break;
    }
});

/**
 * A simple helper class, for storing arbitrary serialized objects and arrays in LocalStorage
 * Data is JSON encoded, and stored as base64 on the localStorage object.
 * Utilizes caching to minimize the number of encoding and decoding operations.
 * Full decode/encode is only performed when initializing, and when setting.
 */
window.BunnyStorage = class {
    constructor(id, defaultData = {}) {
        this.storageKey = id;
        // if no data exists, set the default
        if (this.get() == undefined) {
            this.set(defaultData);
        }
    }
    get() {
        if (!this._cached) {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                this._cached = JSON.parse(atob(raw));
            } else {
                this._cached = undefined;
            }
            return this._cached;
        }
        return this._cached;
    }
    set(data) {
        const json_encoded = JSON.stringify(data);
        this._cached = JSON.parse(json_encoded);
        const b64_encoded = btoa(json_encoded);
        localStorage.setItem(this.storageKey, b64_encoded);
    }
    add(...items) {
        if (Array.isArray(this.get())) {
            this.set([...this.get(), ...items])
        } else {
            throw Error("BunnyStorage.prototype.add can only be used if the stored object is an Array ");
        }
    }
    assign(obj) {
        if (!Array.isArray(this.get())) {
            this.set({
                ...this.get(),
                ...obj
            })
        }
    }
    clear() {
        localStorage.removeItem(this.storageKey);
        this._cached = undefined;
    }
}

window.storyFlags = new BunnyStorage("WP_flags", {});

console.debug("Initialized storyFlags")

// Sync history with storyflags
$(window).one("sm.story.started", () => {
    if (!Array.isArray(storyFlags.get().seenPassages)) {
        storyFlags.assign({
            seenPassages: []
        });
    }
    $(window).on("sm.passage.shown", (event, {passage}) => {
        let seen = storyFlags.get().seenPassages || [];
        if (!seen.includes(passage.id)) {
            storyFlags.assign({
                seenPassages: [...seen, passage.id]
            })
            if (passage.tags.includes("checkpoint")) {
                console.debug(`Visited checkpoint "${passage.name}" for the first time.`)
            }
        }
    });
});
// If Twine "test", enable the debug menu
if ($("tw-storydata").attr("options").includes("debug")) {
  storyFlags.assign({showDebug: true})
}

/*
 * Page Header
 * Render the passage with the "header" tag.
 * This should be more customizable, probably.
 */
bunny.$headerEl = $("<header></header>").attr("id", "header");
$(window).one('sm.story.started', function (event, {story}) {
    const headerPassage = story.passages.find(p => p && p.tags.includes("header")).id;
    renderToSelector(bunny.$headerEl, headerPassage);
    bunny.$headerEl.insertBefore(story.$passageEl);
});

/**
 * Previous Command
 * Use the text of the previously clicked link as the title for
 * the next passage. Inspired by MSPA.
 * Example: [[Foo|Bar]] goes to page "Foo"
 */
$("tw-passage").on("click", "a", ({
    currentTarget
}) => {
    const $this = $(currentTarget);
    // Data attributes:
    // Add data-nocommand to use the linked passage's title
    // Use data-command="..." to set custom titles
    const data = $this.data();
    if (data["command"] !== "" && data["nocommand"] !== "") {
        story.state.previousCommand = data["command"] || $this.html();
    }
    console.debug(`Clicked on "${story.state.previousCommand}"`)
});

$(window).on('sm.passage.shown', (e, {
    passage
}) => {
    const passageTitle = story.state.previousCommand || passage.name;
    $("#recent-command").html(passageTitle)
    story.state.previousCommand = "";
})