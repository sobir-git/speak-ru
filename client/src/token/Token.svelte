<script>
    import { onDestroy, onMount, tick } from "svelte";
    import { get_entries } from "./Slava.js";
    import "./slava.css";
    import "./light-border.css";
    import tippy from "sveltejs-tippy";

    export let token, coded=true;

    var showDefinitionFlag = false;

    const getGrammarContent = (token) => {
        let s = token.morph;
        s = s.replaceAll("|", ", ");
        s = token.pos + ", " + s;
        return s;
    };

    $: grammarHTML = "<span class='tooltip'>" + getGrammarContent(token); + "</span>";

    var props = {
        allowHTML: true,
        placement: "top",
        trigger: 'mouseenter',
        theme: "light-border",
        interactive: false,
        sticky: "popper",
    };

    let span;
    onDestroy(() => {
        span._tippy.destroy();
    });

    function createElementFromHTML(htmlString) {
        var div = document.createElement("div");
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    onMount(
        async () => {
            tippy(span, {
                onHidden(tippyInstance) {
                    if (showDefinitionFlag) {
                        showDefinitionFlag = false;
                        tippyInstance.setProps(props);
                        tippyInstance.setContent(grammarHTML);
                    }
                },
            })
            let instance = span._tippy;
            instance.setProps({
                content: grammarHTML,
                ...props,
            })
        }
    )

    onMount(() => {
        span.addEventListener("dblclick", (e) => {
            document.body.style.cursor='progress';
            get_entries(token, (items) => {
                var odom = createElementFromHTML(
                    '<div class="slava-popover" style="max-height: 75vh; overflow: auto" />'
                );
                items.forEach(function (el) {
                    odom.append(el[0]);
                    odom.append(document.createElement("hr"));
                });
                odom.append(createElementFromHTML(grammarHTML))
                let tippyInstance = span._tippy;
                tippyInstance.setContent(odom);
                tippyInstance.setProps({interactive: true, trigger: 'click'});
                tippyInstance.show();
                showDefinitionFlag = true;
                document.body.style.cursor='auto';
            });
        });
    });
</script>


<span bind:this={span} class="word" on:click={e=>coded=false}>
    {coded ? "*".repeat(token.text.length) : token.text}
</span>

<style>
    .word:hover {
        color: skyblue;
    }
    .word {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.5em;
    }
</style>
