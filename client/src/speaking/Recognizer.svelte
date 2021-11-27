<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { createSpeechRecognition } from "./speech-utils";
    const dispatch = createEventDispatcher();

    let isRecording = false,
        support = true,
        recognition,
        interimResultsEnabled = true,
        lastTranscript = "";

    try {
        recognition = createSpeechRecognition(interimResultsEnabled, true);
        recognition.continuous = true;
        recognition.lang = "ru";
    } catch (e) {
        console.error(e);
        support = false;
    }

    function extractNewPiece(transcript, prevTranscript) {
        // split in words
        transcript = transcript.split(" ");
        prevTranscript = prevTranscript.split(" ");
        let i = 0;
        while (i < Math.min(transcript.length, prevTranscript.length)) {
            let w0 = transcript[i].toLowerCase();
            let w1 = prevTranscript[i].toLowerCase();
            if (w0 != w1) {
                break;
            }
            i += 1;
        }
        return transcript.slice(i).join(" ");
    }

    /** Voice API Logic Start**/
    recognition.onInterimResult = function (r) {
        let newPiece;
        if (interimResultsEnabled) {
            newPiece = extractNewPiece(r.transcript, lastTranscript);
        } else {
            newPiece = r.transcript;
        }
        lastTranscript = r.transcript;
        dispatch("recognition", newPiece);
    };

    recognition.addEventListener("start", function () {
        isRecording = true;
    });
    recognition.addEventListener("end", function () {
        isRecording = false;
    });
    recognition.addEventListener("error", function (event) {
        console.log("Speech Recognition Error", event);
    });

    function handleRecordClick(e) {
        if (e.detail == 2) {
            return; // prevent double click
        }
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }

    onDestroy(() => {
        if (isRecording) {
            recognition.stop();
        }
    });
</script>

{#if support}
    <button on:click={handleRecordClick}>
        {isRecording ? "Pause" : "Record"}
    </button>
{:else}
    SpeechRecognition not supported!
{/if}
