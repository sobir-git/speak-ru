<script>
    import { insertUrlParam, getUrlParam } from "../utils.js";
    import SpeakingSentence from "./SpeakingSentence.svelte";

    export let passage,
        sentenceIdx = null;

    if (sentenceIdx == null) {
        sentenceIdx = parseInt(getUrlParam("snt", "1")) - 1;
    }

    function gotoSentence(idx) {
        insertUrlParam("snt", idx + 1);
        sentenceIdx = idx;
    }

    function handleGotoSentence(event) {
        let sentenceIdx = event.detail.sentenceIdx;
        gotoSentence(sentenceIdx);
    }
</script>

<svelte:head>
    <title>Speak {passage ? ": " + passage.title : ""}</title>
</svelte:head>

<div id="root">
    <div>{passage.folder} > {passage.title}</div>
    <div id="main">
        <SpeakingSentence
            {passage}
            {sentenceIdx}
            on:gotoSentence={handleGotoSentence}
        />
    </div>
</div>

<style>
    #root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    #main {
        flex: 1 1 auto;
        overflow: auto;
    }
</style>
