<script>
    import { Router, Link, Route, link, navigate } from "svelte-routing";
    let passages;

    async function getPassages() {
        const res = await fetch(`/api/passage-list`);
        const json = await res.json();

        if (res.ok) {
            passages = json;
            return json;
        } else {
            throw new Error(json);
        }
    }

    let promise = getPassages();
</script>

<svelte:head>
    <title>Passages</title>
</svelte:head>

{#await promise}
    <p>...waiting</p>
{:then passages}
    {#each passages as p}
        <div>
            <a use:link class="main" href={"/read/" + p.id}>
                {p.folder} <b>{p.title}</b>
            </a>
            <a use:link class="speak" href={"/speak/" + p.id}> speak </a>
        </div>
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
