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

const generateProof = () => {
    let output = "";
    output += `# ${story.name}\n`;
    for (const p of story.passages) {
        if (p == undefined) {
            continue;
        }
        output += `## ${p.name}\n`;
        output += `${p.render()}\n\n`;
    }
    return output;
}

window.Tests = { smokeTest, generateProof };
