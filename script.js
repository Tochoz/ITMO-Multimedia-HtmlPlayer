const image = document.getElementById("image");
const imgText = document.getElementById("img-text");
const sliderAudio = document.getElementById("slider-audio");
const prevImg = document.getElementById("prev-img");
const playPauseImg = document.getElementById("play-pause-img");
const nextImg = document.getElementById("next-img");
const timingInput = document.getElementById("timing-input");
const timingBtn = document.getElementById("timing-btn");

const audioElement = document.getElementById("audio-tag");
//const audioSource = document.getElementById('audio-source');
const prevSong = document.getElementById("prev-song");
const playPauseSong = document.getElementById("play-pause-song");
const nextSong = document.getElementById("next-song");
const nameSong = document.querySelector(".song-name");
const authorSong = document.querySelector(".song-author");

let imageIndex = 1;
let songIndex = 1;
let timerId = null;
let timing = timingInput.value * 1000;
audioElement.crossOrigin = 'anonymous';

const images_list = [
    {path: "media/img/pexels-adrien-olichon-2931251.jpg", desc: "Абстракция 1"},
    {path: "media/img/pexels-andre-william-2104499.jpg", desc: "Абстракция 2"},
    {path: "media/img/pexels-anete-lusina-6331049.jpg", desc: "Абстракция 3"},
    {path: "media/img/pexels-anni-roenkae-3109807.jpg", desc: "Абстракция 4"},
    {path: "media/img/pexels-jonathan-borba-4431922.jpg", desc: "Абстракция 5"}
];

const songs_list = [
    {path: "media/audio/atomic_heart_02. Trava u Doma (Geoffrey Day Remix).mp3", name: "Трава у дома (Geoffrey Day Remix)", author: "Земляне"},
    {path: "media/audio/dvrst-igor-sklyar-atomic-heart-komarovo-dvrst-phonk-remix-mp3.mp3", name: "Комарово (DVRST Phonk Remix)", author: "Игорь Скляр"},
    {path: "media/audio/geoffplaysguitar-alla-pugacheva-atomic-heart-arlekino-geoffrey-day-remix-mp3.mp3", name: "Арлекино (Geoffrey Day Remix)", author: "Алла Пугачёва"},
]

const IMAGES_COUNT = images_list.length;
const SONGS_COUNT = songs_list.length;


function showImage() {
    image.src = images_list[imageIndex-1].path
    imgText.innerHTML = images_list[imageIndex-1].desc
}

function showNextImage() {
    if (imageIndex === IMAGES_COUNT) {
        imageIndex = 1;
    } else {
        imageIndex++;
    }
    showImage();
}

function showPrevImage() {
    if (imageIndex === 1) {
        imageIndex = IMAGES_COUNT;
    } else {
        imageIndex--;
    }
    showImage();
}

function togglePlayPause() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        playPauseImg.firstChild.src = "static/play.svg";
    } else {
        timerId = setInterval(showNextImage, timing);
        playPauseImg.firstChild.src = "static/pause.svg";
    }
}

function setTiming() {
    timing = timingInput.value * 1000;
    if (timerId) {
        clearInterval(timerId);
        timerId = setInterval(showNextImage, timing);
    }
}

function toggleAudio() {
    if(!context)
    {
        loadEqualizer();
    }
    if (audioElement.paused) {
        audioElement.play();
        playPauseSong.firstChild.src = "static/pause.svg";
    } else {
        audioElement.pause();
        playPauseSong.firstChild.src = "static/play.svg";``
    }
}

function nextAudio(){
    if (songIndex === SONGS_COUNT){
        songIndex = 1;
    } else {
        songIndex++;
    }
    setAudio();
}

function prevAudio() {
    if (songIndex === 1){
        songIndex = SONGS_COUNT;
    } else {
        songIndex--;
    }
    setAudio();
}

function setAudio() {
    audioElement.src = songs_list[songIndex-1].path;
    audioElement.load();
    
    nameSong.innerHTML = songs_list[songIndex-1].name;
    authorSong.innerHTML = songs_list[songIndex-1].author;
}

let num, array, lines, analyser, src, height, context;
lines = document.getElementsByClassName('stroke');
num = lines.length;

function loadEqualizer()
{
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audioElement);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}
function loop() 
{
    if(!audioElement.paused)
    {
        window.requestAnimationFrame(loop);
    }

    array = new Uint8Array(num*2);
    analyser.getByteFrequencyData(array);

    for(var i = 0 ; i < num ; i++)
    {
        height = array[i+num];
        lines[i].style.height = height - 125 + '%';

        if(audioElement.paused)
        {
            lines[i].style.height = 0 + '%';
        }
    }
}

prevImg.addEventListener("click", showPrevImage);
nextImg.addEventListener("click", showNextImage);
playPauseImg.addEventListener("click", togglePlayPause);
timingBtn.addEventListener("click", setTiming);
playPauseSong.addEventListener("click", toggleAudio);
nextSong.addEventListener("click", nextAudio);
prevSong.addEventListener("click", prevAudio);

showImage();
setAudio();

