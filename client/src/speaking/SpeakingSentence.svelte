<script>
    import { createEventDispatcher } from "svelte";
    import { settings } from "../settings";
    import { computeCodedIndices } from "./token";

    import AudioPlayer from "../AudioPlayer.svelte";
    import Sentence from "../token/Sentence.svelte";
    import SentenceSelector from "./SentenceSelector.svelte";
    import YandexTranslateButton from "./YandexTranslateButton.svelte";

    export let sentenceIdx;
    export let passage;
    export function checkInputTokens(text) {
        sentenceComponent.revealTokens(text);
    }
    const dispatch = createEventDispatcher();
    let sentenceComponent;
    $: passageId = passage.id;
    $: pair = passage.pairs[sentenceIdx];
    $: numSentences = passage.pairs.length;
    $: console.assert(sentenceIdx >= 0 && sentenceIdx < numSentences, {
        sentenceIdx,
        numSentences,
    });

    function gotoSentence(idx) {
        dispatch("gotoSentence", idx);
    }
</script>

<h1 id="speaking-title">Speaking</h1>

<div class="sentence-parent">
    <div class="english">{pair.en.sentence}</div>
    <Sentence
        bind:this={sentenceComponent}
        sentence={pair.ru}
        codedIndices={computeCodedIndices(pair.ru.spacy_tokens, settings)}
        class="sentence-ru"
    />
</div>
<div id="small-buttons">
    {sentenceIdx + 1} / {numSentences}
    <SentenceSelector
        {passage}
        {sentenceIdx}
        on:selectSentence={(e) => gotoSentence(e.detail.sentenceIdx)}
    />
    {#if pair.ru.audio}
        <AudioPlayer url={"/api/audio/" + passageId + "/" + pair.ru.audio} />
    {/if}
    <YandexTranslateButton
        class="translate-btn"
        text={pair.en.sentence}
        targetLang="ru"
        sourceLang="en"
    />
</div>

<style>
    .english {
        font-size: 1.2em;
        margin-bottom: 1em;
    }
    .sentence-parent :global(.sentence-ru) {
        margin-top: 0.5em;
        margin-bottom: 1.2em;
    }
    .sentence-parent :global(.sentence-ru) {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.8em;
        color: orange;
    }

    #speaking-title {
        margin-top: 8px;
    }
</style>
