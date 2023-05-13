const image = document.getElementById("image");
const imgText = document.getElementById("img-text");
const prevImg = document.getElementById("prev-img");
const playPauseImg = document.getElementById("play-pause-img");
const nextImg = document.getElementById("next-img");
const timingInput = document.getElementById("timing-input");
const timingBtn = document.getElementById("timing-btn");

const audioElement = document.getElementById("audio-tag");
const prevSong = document.getElementById("prev-song");
const playPauseSong = document.getElementById("play-pause-song");
const nextSong = document.getElementById("next-song");
const nameSong = document.querySelector(".song-name");
const authorSong = document.querySelector(".song-author");
const seek_slider = document.querySelector(".seek-slider");

let imageIndex = 1;
let songIndex = 1;
let timerId = null;
let timing = timingInput.value * 1000;
let updateTimer;

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
        context.resume()
        audioElement.play();
        playPauseSong.firstChild.src = "static/pause.svg";
        loop();
    } else {
        audioElement.pause();
        playPauseSong.firstChild.src = "static/play.svg";
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
    clearInterval(updateTimer)
    if (!audioElement.paused) {
        audioElement.pause();
        playPauseSong.firstChild.src = "static/play.svg";``
    }
    audioElement.src = songs_list[songIndex-1].path;
    nameSong.innerHTML = songs_list[songIndex-1].name;
    authorSong.innerHTML = songs_list[songIndex-1].author;
    updateTimer = setInterval(sliderUpdate, 1000);
    audioElement.load();

}

let num, array, lines, analyser, src, width, context;
lines1 = document.getElementsByClassName('line1');
lines2 = document.getElementsByClassName('line2');
num = lines1.length;

function loadEqualizer()
{
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audioElement);
    src.connect(analyser);
    analyser.connect(context.destination);
    console.log("loop")
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
        width = array[i+num];
        lines1[i].style.width = (width - 135)*0.9 + '%';
        lines2[i].style.width = (width - 135)*0.9 + '%';

        if(audioElement.paused)
        {
            lines1[i].style.width = 0 + '%';
            lines2[i].style.width = 0 + '%';
        }
    }
}

function setVolume(val) {
    audioElement.volume = val / 100;
}

function seekTo(val){
    audioElement.currentTime = audioElement.duration * (val / 100);
}

function sliderUpdate(){
    let seekPosition = 0;
    if(!isNaN(audioElement.duration)){
        seekPosition = audioElement.currentTime * (100 / audioElement.duration);
        seek_slider.value = seekPosition;
    }
}


prevImg.addEventListener("click", showPrevImage);
nextImg.addEventListener("click", showNextImage);
playPauseImg.addEventListener("click", togglePlayPause);
timingBtn.addEventListener("click", setTiming);
playPauseSong.addEventListener("click", toggleAudio);
nextSong.addEventListener("click", nextAudio);
prevSong.addEventListener("click", prevAudio);
audioElement.addEventListener('ended', () => {
    nextAudio();
    toggleAudio();
    });

showImage();
loadEqualizer()
setAudio();

