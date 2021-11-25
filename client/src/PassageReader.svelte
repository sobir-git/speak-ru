<script>
    import { Router, Link, Route, navigate } from "svelte-routing";

    import Sentence from "./token/Sentence.svelte";
    

    export let passage=null, passageId;

    if (!passage) {
        // fetch passage
        fetch("/api/get-passage/" + encodeURI(passageId))
            .then((response) => response.json())
            .then((data) => (passage = data));
    }

</script>

{#if passage }
    <h1> {passage.title} </h1>
    {#each passage.pairs as pair}
        <div>
            <Sentence sentence={pair["ru"]}/>
        </div>
        <div>{pair["en"]["sentence"]}</div>
    {/each}
{:else}
    loading ...
{/if}

