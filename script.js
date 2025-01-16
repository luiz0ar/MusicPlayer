let player;
let isPlaying = false;
let videoId = '';

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]+))|youtu\.be\/([a-zA-Z0-9_-]+))/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '200',
        videoId: videoId,
        playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
        events: {
            onStateChange: onPlayerStateChange,
            onReady: onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    getVideoDetails(videoId);
}

function getVideoDetails(videoId) {
    const apiKey = 'AIzaSyAOd0yVDrngOCXxOE9Kq92IbXKnSeTLoS0';
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoTitle = data.items[0].snippet.title;
                const channelTitle = data.items[0].snippet.channelTitle;
                document.getElementById('track-name').textContent = videoTitle;
                document.getElementById('track-artist').textContent = channelTitle;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os detalhes do vídeo:', error);
        });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('playPause').textContent = '⏸️';
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        document.getElementById('playPause').textContent = '⏯️';
    }
}

document.getElementById('playPause').addEventListener('click', function() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById('load-video').addEventListener('click', function() {
    const url = document.getElementById('youtube-url').value;
    const videoIdFromUrl = extractVideoId(url);

    if (videoIdFromUrl) {
        videoId = videoIdFromUrl;
        if (player) {
            player.loadVideoById(videoId);
        } else {
            onYouTubeIframeAPIReady();
        }
        document.getElementById('youtube-url').value = '';
    } else {
        alert('Por favor, insira um link válido do YouTube!');
    }
});
