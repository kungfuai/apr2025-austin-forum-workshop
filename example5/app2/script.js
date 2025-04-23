document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    const playButton = document.getElementById('playButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const progress = document.getElementById('progress');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const songList = document.getElementById('songList');
    const songTitle = document.getElementById('songTitle');
    const artist = document.getElementById('artist');
    const albumArt = document.getElementById('albumArt');

    // Sample playlist
    const playlist = [
        {
            title: 'Sample Song 1',
            artist: 'Artist 1',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            cover: 'https://picsum.photos/300/300?random=1'
        },
        {
            title: 'Sample Song 2',
            artist: 'Artist 2',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            cover: 'https://picsum.photos/300/300?random=2'
        },
        {
            title: 'Sample Song 3',
            artist: 'Artist 3',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            cover: 'https://picsum.photos/300/300?random=3'
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.src;
        songTitle.textContent = song.title;
        artist.textContent = song.artist;
        albumArt.src = song.cover;
        
        // Update active song in playlist
        document.querySelectorAll('.song-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function playSong() {
        isPlaying = true;
        playButton.textContent = '⏸';
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playButton.textContent = '▶';
        audio.pause();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function setVolume() {
        audio.volume = volumeSlider.value / 100;
    }

    function renderPlaylist() {
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            if (index === currentSongIndex) li.classList.add('active');
            
            li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            
            songList.appendChild(li);
        });
    }

    // Event listeners
    playButton.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);

    // Initialize
    loadSong(currentSongIndex);
    renderPlaylist();
}); 