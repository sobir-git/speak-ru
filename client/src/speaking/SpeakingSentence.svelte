<script>
    import { createEventDispatcher } from "svelte";

    import AudioPlayer from "../AudioPlayer.svelte";
    import Sentence from "../token/Sentence.svelte";
    import Recognizer from "./Recognizer.svelte";
    import SentenceSelector from "./SentenceSelector.svelte";
    import YandexTranslateButton from "./YandexTranslateButton.svelte";

    export let sentenceIdx;
    export let passage;
    $: passageId = passage.id;
    $: pair = passage.pairs[sentenceIdx];
    $: numSentences = passage.pairs.length;
    $: console.assert(sentenceIdx >= 0 && sentenceIdx < numSentences, {
        sentenceIdx,
        numSentences,
    });

    const dispatch = new createEventDispatcher();
    let textarea,
        sentenceComponent,
        isRecording,
        text = "",
        lastPiece,
        recognizer;

    function handleRecognition(e) {
        lastPiece = e.detail;
        let lastChar = text.substr(text.length - 1);
        if (lastChar !== " ") text += " ";
        text += lastPiece;
        handleTextChange();
    }

    function handleClickNext(e) {
        gotoSentence(sentenceIdx + 1);
    }

    function handleClickPrevious(e) {
        gotoSentence(sentenceIdx - 1);
    }

    function handleTextChange() {
        // console.log("textChange", text);
        sentenceComponent.revealTokens(text);
        textarea.scrollTop = textarea.scrollHeight;
    }

    function gotoSentence(idx) {
        text = "";
        dispatch("gotoSentence", {
            sentenceIdx: idx,
        });
    }

    function handleClickRecord(e) {
        if (e.detail == 2) {
            return; // prevent double click
        }
        recognizer.toggleRecording();
    }
</script>

<Recognizer
    bind:this={recognizer}
    bind:isRecording
    on:recognition={handleRecognition}
/>

<div id="root">
    <div id="top-content">
        <h1 id="speaking-title">Speaking</h1>

        <div class="sentence-parent">
            <div class="english">{pair.en.sentence}</div>
            <Sentence
                bind:this={sentenceComponent}
                sentence={pair.ru}
                codedIndices={new Set([
                    ...Array(pair.ru.spacy_tokens.length).keys(),
                ])}
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
                <AudioPlayer
                    url={"/api/audio/" + passageId + "/" + pair.ru.audio}
                />
            {/if}
            <YandexTranslateButton
                class="translate-btn"
                text={pair.en.sentence}
                targetLang="ru"
                sourceLang="en"
            />
        </div>
    </div>
    <div id="panel">
        <textarea
            bind:this={textarea}
            bind:value={text}
            on:input={handleTextChange}
            rows="4"
        />
        <div id="panel-buttons">
            <button
                id="prev-btn"
                on:click={handleClickPrevious}
                disabled={sentenceIdx == 0}
            >
                Prev
            </button>

            {#if recognizer}
                <button
                    on:click={handleClickRecord}
                    id="record-btn"
                    class={isRecording ? "recording" : ""}
                >
                    {isRecording ? "Pause" : "Record"}
                </button>
            {/if}

            <button
                id="next-btn"
                on:click={handleClickNext}
                disabled={sentenceIdx == numSentences - 1}
            >
                Next
            </button>
        </div>
    </div>
</div>

<style>
    #root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    #top-content {
        flex: 1 1 auto;
        overflow: auto;
    }

    #panel-buttons {
        display: flex;
        height: 5rem;
    }

    #record-btn {
        flex: 1 0 auto;
        margin-left: 12px;
        margin-right: 12px;
    }

    #panel > textarea {
        width: 100%;
        font-family: monospace;
    }
    .english {
        font-size: 1.2em;
        margin-bottom: 1em;
    }
    .sentence-parent :global(.sentence-ru) {
        margin-top: 0.5em;
        margin-bottom: 1.2em;
    }
    .sentence-parent :global(.sentence-ru > .word) {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.8em;
        color: orange;
    }

    .recording {
        background-color: #b0ff7b;
    }
    .recording:active {
        background-color: #8fdb5c;
    }

    #speaking-title {
        margin-top: 8px;
    }
</style>
