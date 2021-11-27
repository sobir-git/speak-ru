<script>
    export let text = encodeURI(text);
    export let targetLang = "en";
    export let sourceLang = "ru";
    $: yaUrl = `https://translate.yandex.ru/?lang=${sourceLang}-${targetLang}&text=${text}`;

    function handleClick() {
        window.open(yaUrl, "popup", "width=600,height=600");
    }
</script>

<button class={$$props.class} on:click={handleClick}> ط </button>
