const body = document.querySelector("body");
const like = document.getElementById("like");
const heartBtutton = like.querySelector("i");
const likeNumber = like.querySelector("span");
const musicLists = document.querySelectorAll("li[name='music-list']");
const mainPlayButton = document.getElementById("main-play-button");
const subPlayButton = document.getElementById("sub-play-button");

const mainPlayTitle = document.getElementById("main-play-title");
const mainPlayArtist = document.getElementById("main-play-artist");
const subPlayTitle = document.getElementById("sub-play-title");
const subPlayArtist = document.getElementById("sub-play-artist");
const mainPlayAlbum = document.querySelector("#playing>img");

// youtube API
let player;
let tag = document.createElement("script");
let firstScriptTag = document.getElementsByTagName("script")[0];
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady(id) {
  player = new YT.Player("player", {
    width: "256",
    height: "128",
    videoId: id || "ZThVobEtp_o", // 이 페이지는 celebrity가 default
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

const addLike = () => {
  if (heartBtutton.className === "fas fa-heart") {
    heartBtutton.className = "far fa-heart";
    likeNumber.innerText = "999 998";
  } else {
    heartBtutton.className = "fas fa-heart";
    likeNumber.innerText = "999 999";
  }
};

const handlePlay = (event) => {
  let li;
  // remove pre playing shadow and playing icon
  const playingMark = document.getElementById("playing-mark");
  playingMark.remove();

  musicLists.forEach((el) => {
    el.classList.remove("now-playing");
  });

  // add now playing shadow
  event.path.some((el) => {
    if (el.getAttribute("name") === "music-list") {
      el.classList.add("now-playing");
      li = el;
      return true;
    }
  });

  // add img now playng icon
  const musicAlbum = li.querySelector(".music-list__album");
  const div = document.createElement("div");
  const icon = document.createElement("i");
  icon.className = "fas fa-align-left fa-lg";
  div.id = "playing-mark";
  div.className = "playing-mark";
  div.appendChild(icon);
  musicAlbum.appendChild(div);

  // change iframe
  const { id } = li.dataset;
  const iframe = document.querySelector("iframe");
  iframe.remove();
  const playerDiv = document.createElement("div");
  playerDiv.id = "player";
  body.appendChild(playerDiv);

  onYouTubeIframeAPIReady(id);
  mainPlayButton.className = "fas fa-pause-circle fa-3x";
  changePlayName(li);
  changePlayAlbum(li);
  handlePlayPause();
};

function changePlayName(li) {
  const newArtist = li.querySelector(".music-list__payload span:first-child");
  const newTitle = li.querySelector(".music-list__payload span:last-child");
  mainPlayTitle.innerText = newTitle.innerHTML;
  mainPlayArtist.innerText = newArtist.innerHTML;
  subPlayTitle.innerText = newTitle.innerHTML;
  subPlayArtist.innerText = newArtist.innerHTML;
}
function changePlayAlbum(li) {
  const newIamge = li.querySelector(".music-list__album > img");
  const src = newIamge.getAttribute("src");
  mainPlayAlbum.setAttribute("src", src);
}

function handlePlayPause() {
  const status = player.getPlayerState();
  if (status === 1) {
    player.pauseVideo();
    mainPlayButton.className = "fas fa-play-circle fa-3x";
    subPlayButton.className = "fas fa-play fa-lg";
  } else if (status === -1 || status === 2) {
    player.playVideo();
    mainPlayButton.className = "fas fa-pause-circle fa-3x";
    subPlayButton.className = "fas fa-pause fa-lg";
  }
}

heartBtutton.addEventListener("click", addLike);
mainPlayButton.addEventListener("click", handlePlayPause);
subPlayButton.addEventListener("click", handlePlayPause);

musicLists.forEach((musicList) => {
  musicList.addEventListener("click", handlePlay);
});
