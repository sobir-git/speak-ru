<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    var isRecording = false,
        support = true,
        content = "",
        recognition;

    try {
        let SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'ru';

    } catch (e) {
        console.error(e);
        support = false;
    }

    /** Voice API Logic Start**/
    recognition.onresult = function (event) {
        let current = event.resultIndex;
        let transcript = event.results[current][0].transcript;
        content += transcript;
        dispatch("recognition", { lastPiece: transcript, text: content });
    };

    recognition.onstart = function () {
        isRecording = true;
    };
    recognition.onspeechend = function () {
        isRecording = false;
    };
    recognition.onerror = function (event) {
        console.log("Speech Recognition Error", event);
        // if (event.error == "no-speech") {
        // }
    };

    function handleRecordClick(e) {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }

    export function reset() {
        content = '';
    }
</script>

{#if support}
    <button on:click={handleRecordClick}>
        {isRecording ? "Pause" : "Record"}
    </button>
{:else}
    SpeechRecognition not supported!
{/if}
