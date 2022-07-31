const smokeTest = () => {
    // Attempt to render every page
    window.story.passages.slice(1).forEach(p => p.render());
}

window.Tests = { smokeTest };
