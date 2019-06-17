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
    'use strict';

    let audio = document.getElementById('audio');
    let player = document.getElementById('player');

    // Taken from https://codepen.io/nfj525/pen/rVBaab
    // Setup visualizer
    (function () {
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();

        let canvas = document.getElementById("visualizer");
        let ctx = canvas.getContext("2d");


        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        let bufferLength = analyser.frequencyBinCount;

        let dataArray = new Uint8Array(bufferLength);
        let outputWidth = canvas.width;
        let outputHeight = canvas.height;

        let barWidth = (outputWidth / bufferLength) * 2.5;
        // Frequencies ranges from 0 to 255
        var barHeightRatio = outputHeight / 255;


        function renderFrame() {
            requestAnimationFrame(renderFrame);

            let x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, outputWidth, outputHeight);

            dataArray.forEach(frequencyData => {
                let barHeight = frequencyData * barHeightRatio;

                ctx.fillStyle = '#4B483F';
                ctx.fillRect(x, outputHeight - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            });
        }
        renderFrame();
    })();

    // Setup playpause
    (function () {
        let playPause = document.getElementById('play-pause-button');
        let isPlaying = false;

        audio.addEventListener('playing', function () {
            isPlaying = true;
            addClass(playPause, 'playing');
        });

        audio.addEventListener('pause', function () {
            isPlaying = false;
            removeClass(playPause, 'playing');
        });

        playPause.addEventListener('click', function () {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });
    })();

    // Setup volume
    (function() {
        let volRange = document.getElementById('vol-range');
        audio.volume = 0.1;
        
        noUiSlider.create(volRange, {
            start: 0.1,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 1
            }
        });

        volRange.noUiSlider.on('update', function (values, handle) {
            let volume = values[handle];
            if (audio.volume != volume) {
                audio.volume = volume;               
            }
        });

        /*
        audio.addEventListener('volumechange', function() {
            if (audio.volume != volRange) {
                volRange.noUiSlider.set([audio.volume]);
            }
        });*/
    })();

    // Setup mute
    (function() {
        let muteButton = document.getElementById('mute-button');

        muteButton.addEventListener('click', function () {
            audio.muted = !audio.muted;
        });

        audio.addEventListener('volumechange', function() {
            if (audio.muted || audio.volume === 0) {
                addClass(muteButton, 'muted');
            } else {
                removeClass(muteButton, 'muted');
            }
        });
    })();

    // Setup progress bar
    (function () {
        let progress = document.getElementById('progress');

        // Taken from https://codepen.io/mdf/pen/ZWbvBv
        let timer;
        let percent = 0;

        audio.addEventListener("playing", function (_event) {
            advance();
        });

        audio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
        });

        let advance = function () {
            percent = Math.min((audio.currentTime / audio.duration) * 100, 100).toFixed(2);
            progress.style.width = percent + '%'
            startTimer();
        }

        let startTimer = function () {
            if (percent < 100) {
                // 10000 possibles values between 0.00% and 100.00%, 
                // we want to be updated no more than once every (duration / 10000) seconds
                // or duration / 10 milliseconds
                timer = setTimeout(advance, audio.duration / 10);
                console.log(audio.duration / 10);

            }
        }

        
    })();

});
