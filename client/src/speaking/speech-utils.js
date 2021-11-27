let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const CONFIDENCE_THRESHOLD = 0.5;

export function createSpeechRecognition(restartOnFail = false, interimResults = true) {

    let r = new SpeechRecognition();
    r.interimResults = interimResults;
    r.onInterimResult = null;

    r._stop = r.stop;
    r._start = r.start;

    r.reset = function () {
        r.lastTranscript = '';
        r.stopRequested = false;
        r.errored = false;
    }

    r.restart = function () {
        r.reset();
        r._start();
    }

    r.stop = function () {
        r.stopRequested = true;
        r._stop();
    }

    r.start = function () {
        r.reset();
        r._start();
    }

    r.addEventListener('end', function () {
        if (!r.stopRequested || r.errored) {
            // why ending without stop request...?
            r.restart();
        }
    })

    r.addEventListener('error', function () {
        r.errored = true;
    })

    r.addEventListener('result',
        function (event) {
            console.log('onresult')
            let result = event.results[event.resultIndex]
            let transcript = result[0].transcript;
            let confidence = result[0].confidence;

            if (confidence == 0 || confidence > CONFIDENCE_THRESHOLD) {

                if (r.onInterimResult && r.lastTranscript != transcript) {
                    r.onInterimResult({ transcript: transcript });
                }
                r.lastTranscript = transcript;
            }
        }
    )
    return r;
}
