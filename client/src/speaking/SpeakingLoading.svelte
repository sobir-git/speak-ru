<script>
    import { getPassage, insertUrlParam, getUrlParam } from "../utils.js";
    import Speaking from "./Speaking.svelte";

    export let passageId;
    let passage;
    let promise = getPassage(passageId, (json) => {
        passage = json;
    });
</script>

{#await promise}
    loading passage ...
{:then passage}
    <Speaking passage={passage}/>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
