<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import Home from "./Home.svelte";
    import PassageList from "./PassageList.svelte";
    import PassageReader from "./PassageReader.svelte";
    import SpeakingLoading from "./speaking/SpeakingLoading.svelte";
    export let url = "";
</script>

<Router {url}>
    <div class="root">
        <nav>
            <Link to="/">Home</Link>
            <Link to="/passage-list">Passages</Link>
        </nav>
        <div class="content">
            <Route path="/"><Home /></Route>
            <Route path="/passage-list"><PassageList /></Route>
            <Route path="/read/:id" let:params>
                <PassageReader passageId={params.id} />
            </Route>
            <Route path="/speak/:id" let:params>
                <SpeakingLoading passageId={params.id} />
            </Route>
        </div>
    </div>
</Router>

<style>
    .root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .content {
        flex: 1 1 auto;
        overflow: auto;
        margin-left: 8px;
        margin-right: 8px;
    }
    nav {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
        background-color: #333;
        flex: none;
    }
    nav > :global(a) {
        display: inline-block;
        color: white;
        text-align: center;
        padding: 8px 8px;
        text-decoration: none;
    }
</style>
