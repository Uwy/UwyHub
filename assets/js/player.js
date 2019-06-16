function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}


ready(function () {
    let audio = document.getElementById('audio');
    let player = document.getElementById('player');

    // Taken from https://codepen.io/nfj525/pen/rVBaab
    // Setup visualizer
    function visualizer() {
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();

        let canvas = document.getElementById("visualizer");
        let ctx = canvas.getContext("2d");


        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        let bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        let dataArray = new Uint8Array(bufferLength);
        let outputWidth = canvas.width;
        let outputHeight = canvas.height;

        let barWidth = (outputWidth / bufferLength) * 2.5;
        var barHeightRatio = outputHeight / 255;
        

        function renderFrame() {

            requestAnimationFrame(renderFrame);

            let x = 0;

            analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, outputWidth, outputHeight);

            for (let i = 0; i < bufferLength; i++) {
                let barHeight = dataArray[i] * barHeightRatio;
                console.log()

                ctx.fillStyle = '#4B483F';
                ctx.fillRect(x, outputHeight - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
        renderFrame();

    };

    // Setup buttons
    (function () {
        let playPause = document.getElementById('play-pause-button');
        let muteButton = document.getElementById('mute-button');
        let volRange = document.getElementById('vol-range');

        let isPlaying = false;

        audio.onplaying = function () {
            isPlaying = true;
            addClass(playPause, 'playing');
            visualizer();
        }

        audio.onpause = function () {
            isPlaying = false;
            removeClass(playPause, 'playing');
        }

        volRange.onchange = function () {
            audio.volume = volRange.value;
            audio.muted = audio.volume === 0;
        }

        playPause.onclick = function () {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        muteButton.onclick = function () {
            audio.muted = !audio.muted;
            if (audio.muted) {
                addClass(muteButton, 'muted');
            } else {
                removeClass(muteButton, 'muted');
            }
        }
    })();
});
