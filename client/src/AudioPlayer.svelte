<script>
    export var url;
    let audio;
    var playing;

    $: url, updateAudio();

    function updateAudio() {
        if (audio) {
            if (playing) {
                togglePlay();
            }
            audio.onended = undefined;
        }

        audio = new Audio(url);
        playing = false;

        audio.onended = () => {
            playing = false;
        };
    }

    function togglePlay() {
        if (!playing) {
            audio.play();
            playing = true;
        } else {
            audio.pause();
            audio.currentTime = 0;
            playing = false;
        }
    }
</script>

<button on:click={togglePlay}>
    {#if playing}
        ⏸️
    {:else}
        ▶️
    {/if}
</button>
