<script>
    import Recognizer from "./Recognizer.svelte";
    import { createEventDispatcher, onDestroy } from "svelte";

    export let sentenceIdx;
    export let passage;
    $: numSentences = passage.pairs.length;

    const dispatch = createEventDispatcher();

    let textarea,
        isRecording,
        text = "",
        lastPiece,
        recognizer;

        
    function handleTextChange() {
        // console.log("textChange", text);
        dispatch("textChange", text);
        textarea.scrollTop = textarea.scrollHeight;

        // check if codeword 'next' is said
        const words = text.trim().split(' ')
        const lastWord = words[words.length-1];
        if (lastWord.toLowerCase() == 'next' && sentenceIdx < numSentences-1){
            gotoSentence(sentenceIdx + 1);
        }
    }

    function handleRecognition(e) {
        lastPiece = e.detail.trim();
        text = text.trim() + ' ' + lastPiece;
        handleTextChange();
    }

    function handleClickRecord(e) {
        if (e.detail == 2) {
            return; // prevent double click
        }
        recognizer.toggleRecording();
    }
    
    function gotoSentence(idx) {
        text = "";
        dispatch("gotoSentence", idx)
    }
    
    function handleClickNext(e) {
        gotoSentence(sentenceIdx + 1);
    }

    function handleClickPrevious(e) {
        gotoSentence(sentenceIdx - 1);
    }

</script>

<Recognizer
    bind:this={recognizer}
    bind:isRecording
    on:recognition={handleRecognition}
/>

<textarea
    bind:this={textarea}
    bind:value={text}
    rows="4"
    on:input={handleTextChange}
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

<style>
    #panel-buttons {
        display: flex;
        height: 5rem;
    }

    #record-btn {
        flex: 1 0 auto;
        margin-left: 12px;
        margin-right: 12px;
    }

    textarea {
        width: 100%;
        font-family: monospace;
    }
    .recording {
        background-color: #b0ff7b;
    }
    .recording:active {
        background-color: #8fdb5c;
    }
</style>
