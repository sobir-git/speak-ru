

function computeCodedIndices(tokens, settings) {
    const codedIndices = new Set([
        ...Array(tokens.length).keys(),
    ])
    const ruWordRegex = settings.ruWordRegex
    const revealTags = settings.grammarWhitelist.revealTags
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (!token.text.match(ruWordRegex)) {
            codedIndices.delete(i);
        } else if (revealTags.includes(token.pos)) {
            codedIndices.delete(i);
        }
    }
    return codedIndices;
}


export { computeCodedIndices }