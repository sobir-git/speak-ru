<script>
    import { insertUrlParam, getUrlParam } from "../utils.js";
    import SpeakingSentence from "./SpeakingSentence.svelte";
    import BottomPanel from "./BottomPanel.svelte";

    export let passage;
    export let sentenceIdx = null;
    let speakingSentenceComponent;

    if (sentenceIdx == null) {
        sentenceIdx = parseInt(getUrlParam("snt", "1")) - 1;
    }

    function gotoSentence(idx) {
        insertUrlParam("snt", idx + 1);
        sentenceIdx = idx;
    }

    function handleGotoSentence(event) {
        let sentenceIdx = event.detail;
        gotoSentence(sentenceIdx);
    }
</script>

<svelte:head>
    <title>Speak {passage ? ": " + passage.title : ""}</title>
</svelte:head>

<div id="root">
    <div id="top-content">
        <div>{passage.folder} > {passage.title}</div>
        <SpeakingSentence
            {passage}
            {sentenceIdx}
            on:gotoSentence={handleGotoSentence}
            bind:this={speakingSentenceComponent}
        />
    </div>
    <div id="panel">
        <BottomPanel
            {sentenceIdx}
            {passage}
            on:gotoSentence={handleGotoSentence}
            on:textChange={(e) =>
                speakingSentenceComponent.checkInputTokens(e.detail)}
        />
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
</style>
