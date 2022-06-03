function loadVideo(id) {
  $('#youtube-audio').html('');
  $('#youtube-audio').attr('data-video', id);
  onYouTubeIframeAPIReady();
}
var youtube;
var ytaudio = document.getElementById('youtube-audio');
var icon = document.getElementById('play-button');
function setState(isPlaying) {
  if (isPlaying) {
    $('#play-icon').html('pause_circle');
  } else {
    $('#play-icon').html('play_circle_filled');
  }
}
icon.onclick = function () {
  youtube.getPlayerState() === YT.PlayerState.PLAYING ||
  youtube.getPlayerState() === YT.PlayerState.BUFFERING
    ? (youtube.pauseVideo(), setState(!1))
    : (youtube.playVideo(), setState(!0));
};
$('#skip-icon').click(() => {
  youtube.loadVideoById(getNextVideo());
});
$('#replay-icon').click(() => {
  youtube.seekTo(0);
});
function getNextVideo() {
  return '6HVa4Y-Ymlw';
}
function onYouTubeIframeAPIReady() {
  youtube = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: ytaudio.dataset.video,
    playerVars: {
      autoplay: ytaudio.dataset.autoplay,
      loop: ytaudio.dataset.loop,
    },

    events: {
      onReady: function (e) {
        youtube.setPlaybackQuality('small');
        setState(youtube.getPlayerState() !== YT.PlayerState.CUED);
      },
      onStateChange: function (e) {
        if (e.data == 0) {
          youtube.loadVideoById(getNextVideo());
        }
      },
    },
  });
  startVideo();
}
async function startVideo() {
  await sleep(1000);
  $('#youtube-audio').click();
}
