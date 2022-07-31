const smokeTest = () => {
    // Attempt to render every page
    for (const p of story.passages.slice(1)) {
        story.errorMessage = undefined;
        p.render();
        if (story.errorMessage !== undefined) {
            console.error(`Error occured rendering passage: ${p.name}`);
            return false;
        }
    }
    return true;
};

window.Tests = { smokeTest };
