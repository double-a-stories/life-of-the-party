/**
 * This scriptlet prepends a title heading to each passage on load.
 * The title is based by the most recent passage link the player clicked.
 * e.g. The link [[Foo|Bar]] goes to the passage Bar, but acts as if the passage was titled Foo.
 * If nothing breaks, this means internal passage names should never be exposed to the player.
 */
{
    $(window).on("sm.passage.shown", (e, { passage }) => {
        // @ts-ignore
        const s = story.state;
        const currentPassageTitle = s.passageName ?? passage.name;
        s.passageName = null; // invalidate value, to avoid repeats

        // Passages with the [no_heading] tag don't display a heading.
        const noHeading = passage.tags.includes("no_heading");
        if (!noHeading) {
            $("tw-passage").prepend(`<h2 id='recent-command'>${currentPassageTitle}</h2>`);
        }
        // Upon clicking any link, set a state variable
        // (this handler to assigned each page load so it takes precedence)
        // We need the passageName to be in the state history so it needs to change before the new passage is shown.
        $("a[data-passage]").on("click", function () {
            s.passageName = getPassageHeading(this);
        });
    })
    /**
     * Determines the next title of a passage,
     * @param {HTMLElement} link
    */
    const getPassageHeading = (link) => {
        if (!link) {
            return null;
        }
        const targetPassageName = link.dataset.passage;
        // <a data-nocommand> forces using the linked passage's title.
        const datasetHideCommand = !!link.dataset.nocommand;
        // The [no_command] tag for a passage to always use its set title.
        const passageHideCommand = story.passage(targetPassageName).tags.includes("no_command");
        if (passageHideCommand || datasetHideCommand) {
            return null;
        }
        // Use <a data-command="..."> to set custom titles
        const customCommand = link.dataset.command;
        return customCommand ?? link.innerHTML;
    }
}