
const musicsData = [
  { title: "Solar", artist: "Betical", id: 1 },
  { title: "Electric-Feel", artist: "TEEMID", id: 2 },
  { title: "Aurora", artist: "SLUMB", id: 3 },
  { title: "Lost-Colours", artist: "Fakear", id: 4 },
];

const musicPlayer = document.querySelector(".audio-player__player")
const musicTitle = document.querySelector(".audio-player__music-title")
const artistName = document.querySelector(".audio-player__artist-name")
const thumbnail = document.querySelector(".audio-player__thumbnail")
const indexTxt = document.querySelector(".audio-player__current-index")

let currentMusicId = 1

function populateUI(musicId) {
  const { title, artist } = musicsData.find(obj => obj.id === musicId)
  musicTitle.textContent = title
  artistName.textContent = artist
  thumbnail.src = `./ressources/thumbs/${title}.png`
  musicPlayer.src = `./ressources/music/${title}.mp3`
  indexTxt.textContent = `${musicId}/${musicsData.length}`
}
populateUI(currentMusicId)

const playTogglerBtn = document.querySelector(".audio-player__play-toggler")

playTogglerBtn.addEventListener("click", handlePlayPause)

function handlePlayPause() {
  if (musicPlayer.paused) play()
  else pause()
}

function play() {
  playTogglerBtn.querySelector("img").src = "./ressources/icons/pause-icon.svg"
  playTogglerBtn.setAttribute("aria-pressed", "true")
  musicPlayer.play()
}
function pause() {
  playTogglerBtn.querySelector("img").src = "./ressources/icons/play-icon.svg"
  playTogglerBtn.setAttribute("aria-pressed", "false")
  musicPlayer.pause()
}

const displayCurrentTime = document.querySelector(".js-current-time")
const durationTime = document.querySelector(".js-duration-time")


let current
let totalDuration

if (musicPlayer.readyState >= 1) {
  // Les métadonnées sont déjà chargées
  fillDurationVariables();
} else {
  musicPlayer.addEventListener("loadedmetadata", fillDurationVariables);
}

function fillDurationVariables() {
  current = musicPlayer.currentTime
  totalDuration = musicPlayer.duration

  formatValue(current, displayCurrentTime)
  formatValue(totalDuration, durationTime)
}

function formatValue(val, element) {
  const currentMin = Math.floor(val / 60)
  let currentSec = Math.floor(val % 60)

  if (currentSec < 10) {
    currentSec = `0${currentSec}`
  }

  element.textContent = `${currentMin}:${currentSec}`
}

const progressBar = document.querySelector(".audio-player__progress-bar")

musicPlayer.addEventListener("timeupdate", updateProgress)

function updateProgress(e) {
  const current = e.target.currentTime

  formatValue(current, displayCurrentTime)

  const progressValue = current / totalDuration
  progressBar.style.transform = `scaleX(${progressValue})`
}

const progressBarContainer = document.querySelector(".audio-player__progress-container")

progressBarContainer.addEventListener("click", setProgress)

function setProgress(e) {
  const progressBarDimension = progressBarContainer.getBoundingClientRect()

  const clickPositionInProgressBar = e.clientX - progressBarDimension.left

  const clickProgressRatio = clickPositionInProgressBar / progressBarDimension.width

  musicPlayer.currentTime = clickProgressRatio * totalDuration
}



const btnShuffle = document.querySelector(".audio-player__shuffle")
btnShuffle.addEventListener("click", switchShuffle)

let isShuffleActive = false
function switchShuffle() {
  isShuffleActive = !isShuffleActive
  btnShuffle.querySelector("svg").classList.toggle("js-active-shuffle")
  btnShuffle.setAttribute("aria-pressed", isShuffleActive.toString())
}


const navigationBtnsArray = [
  document.querySelector(".js-next-btn"),
  document.querySelector(".js-prev-btn"),
]

navigationBtnsArray.forEach(btn => btn.addEventListener("click", handleSongsNavigation))

function handleSongsNavigation(e) {
  if (e.currentTarget.classList.contains("js-next-btn")) {
    changeSong("next")
  } else {
    changeSong("prev")
  }
}

musicPlayer.addEventListener("ended", handleSongEnd)

function handleSongEnd() {
  changeSong("next")
}
function changeSong(direction) {

  if (isShuffleActive) {
    playAShuffledSong()
    return
  }

  if (direction === "next") {
    currentMusicId++
  } else if (direction === "prev") {
    currentMusicId--
  }

  if (currentMusicId < 1) currentMusicId = musicsData.length
  else if (currentMusicId > musicsData.length) currentMusicId = 1

  populateUI(currentMusicId)
  play()
}

function playAShuffledSong() {
  const musicsWithoutCurrentSong = musicsData.filter(el => el.id !== currentMusicId)
  const randomMusic = musicsWithoutCurrentSong[Math.floor(Math.random() * musicsWithoutCurrentSong.length)]

  currentMusicId = randomMusic.id
  populateUI(currentMusicId)
  play()
}