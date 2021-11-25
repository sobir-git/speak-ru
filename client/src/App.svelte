<script>
    import { Router, Link, Route, navigate } from "svelte-routing";

    import PassageList from "./PassageList.svelte";
    import PassageReader from "./PassageReader.svelte";
    import Speaking from "./speaking/Speaking.svelte";

    export let url = "";

</script>


<Router url="{url}">
    <nav>
        <Link to="/">Home</Link>
        <Link to="/passage-list">Passages</Link>
    </nav>
    <div>
        <Route path="/"><h1> This is Home </h1></Route>
        <Route path="/passage-list"><PassageList/></Route>
        <Route path="/read/:id" let:params>
            <PassageReader passageId={params.id} />
        </Route>
        <Route path="/speak/:id" let:params>
            <Speaking passageId={params.id} />
        </Route>
    </div>
</Router>
