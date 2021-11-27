<script>
    import { Router, Link, Route, navigate } from "svelte-routing";

    import Sentence from "./token/Sentence.svelte";

    export let passage = null,
        passageId;

    if (!passage) {
        // fetch passage
        fetch("/api/get-passage/" + encodeURI(passageId))
            .then((response) => response.json())
            .then((data) => (passage = data));
    }
</script>

<svelte:head>
    <title>Read {passage ? ": " + passage.title : ""}</title>
</svelte:head>

{#if passage}
    <h1>{passage.title}</h1>
    <Link to="/speak/{passageId}">Speak</Link>
    {#each passage.pairs as pair}
        <div class="sentence-ru-parent">
            <Sentence sentence={pair["ru"]} class="sentence-ru" />
        </div>
        <div>{pair["en"]["sentence"]}</div>
    {/each}
{:else}
    loading passage...
{/if}

<style>
    .sentence-ru-parent :global(.sentence-ru) {
        margin-top: 1em;
        margin-bottom: 0.3em;
    }
    .sentence-ru-parent :global(.sentence-ru > .word) {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.5em;
    }
</style>
