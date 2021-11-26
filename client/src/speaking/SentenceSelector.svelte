<script>
    import { createEventDispatcher } from "svelte";

    export let passage;
    export let sentenceIdx;

    let sentences = passage.pairs.map((el) => el.en.sentence);
    let dispatch = createEventDispatcher();
    function handleValueChange(e) {
        sentenceIdx = parseInt(e.target.value);
        dispatch("selectSentence", { sentenceIdx: sentenceIdx });
    }
</script>

<label for="sentences">Goto:</label>
<select on:change={handleValueChange} name="sentences" value={sentenceIdx}>
    {#each sentences as sentence, i}
        <option value={i}>{sentence}</option>
    {/each}
</select>

<style>
    select {
        max-width: 2em;
    }
    label,
    select {
        display: inline;
    }
</style>
