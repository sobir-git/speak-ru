<script>
    import { insertUrlParam, getUrlParam } from "../utils.js";
    import SpeakingSentence from "./SpeakingSentence.svelte";

    export let passage, sentenceIdx=null;

    if (sentenceIdx == null){
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

<h1>Speaking</h1>

<svelte:head>
    <title>Speak {passage ? ": " + passage.title : ""}</title>
</svelte:head>

<SpeakingSentence
    {passage}
    {sentenceIdx}
    on:gotoSentence={handleGotoSentence}
/>
