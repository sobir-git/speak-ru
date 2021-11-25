<script>
    import { Router, Link, Route, link, navigate } from "svelte-routing";
    import PassageReader from "./PassageReader.svelte";
    let passages = [{ title: "No passages loaded", id: "123" }];

    fetch("/api/passage-list")
        .then((response) => response.json())
        .then((data) => (passages = data));
</script>


<Router>
    {#each passages as p}
    <div>
        <a use:link class="main" href={"/read/"+p.id}>
            {p.folder} <b>{p.title}</b>
        </a>
        <a use:link class="speak" href={"/speak/"+p.id}>
            speak
        </a>
    </div>
    {/each}
</Router>

<style>
    .main {
        /* display: block; */
    }
    .speak {
        float: right;
        /* display: block; */
    }
    a:hover {
        /* text-decoration: none; */
    }
    
</style>
