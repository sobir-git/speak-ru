<script>
    import { onMount } from "svelte";

    import { Router, Link, Route, navigate } from "svelte-routing";
import AudioPlayer from "../AudioPlayer.svelte";
    import Sentence from "../token/Sentence.svelte";
    import Recognizer from "./Recognizer.svelte";
    var text = "",
        lastPiece,
        pairs, recognizer;
    export let passage = undefined,
        passageId,
        sentenceIdx = 0;
    
    $: pairs = passage == undefined ? undefined : passage.pairs
    $: numSentences = passage == undefined ? undefined : pairs.length;
    $: currentSentence = passage == undefined ? undefined : pairs[sentenceIdx].ru;

    function handleRecognition(e) {
        lastPiece = e.detail.lastPiece;
        text = e.detail.text;
        console.log(e.detail);
        handleTextChange()
    }

    if (!passage) {
        // fetch passage
        fetch("/api/get-passage/" + encodeURI(passageId))
            .then((response) => response.json())
            .then((data) => {
                passage = data;
            });
    }

    var sentenceComponent;

    function gotoSentence(idx) {
        sentenceIdx = idx;
        text = '';
        recognizer.reset();
    }

    function handleClickNext(e){
        gotoSentence(sentenceIdx+1);
        if (sentenceIdx == numSentences - 1){
        }
    }
    
    function handleClickPrevious(e){
        gotoSentence(sentenceIdx-1);
        if (sentenceIdx == 0){
        }
    }

    function handleTextChange() {
        console.log('textChange', text);
        sentenceComponent.revealTokens(text);
    }

</script>

<h1>Speaking</h1>
{#if passage}
<div>
    <div>{pairs[sentenceIdx].en.sentence}</div>
    <Sentence
        bind:this={sentenceComponent}
        sentence={pairs[sentenceIdx].ru}
        codedIndices={new Set([...Array(currentSentence.spacy_tokens.length).keys()])}
        />
        
    </div>
    <div>
        <Recognizer bind:this={recognizer} on:recognition={handleRecognition} /> 
        <button on:click={handleClickPrevious} disabled="{sentenceIdx == 0}">Prev</button>
        <button on:click={handleClickNext} disabled="{sentenceIdx == numSentences - 1}">Next</button>
        {sentenceIdx+1} / {numSentences}
        <AudioPlayer url={"/api/audio/"+passageId+"/"+currentSentence.audio}/>
    </div>
    <textarea bind:value={text} on:change={handleTextChange} rows:3/>
{/if}

<style>
    textarea{
        width: 100%;
    }
</style>
