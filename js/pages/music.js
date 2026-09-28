/**
 * Nasheed & Relaxation Music Player Module (HTML5 Audio API).
 * Fixes dynamic track info update in the DOM when changing tracks
 * and integrates multi-language support (English / Hindi).
 */

import { toast } from '../components/toast.js';
import { escapeHtml, refreshLucideIcons } from '../utils/helpers.js';
import { t } from '../services/languageService.js';

let audioPlayer = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;
let updateInterval = null;

const playlist = [
  {
    title: "Tala'al Badru 'Alayna",
    artist: "Mishary Rashid Alafasy",
    category: "Vocal Recitation",
    duration: "7:35",
    src: "./assets/audio/tala_al_badru.mp3"
  },
  {
    title: "Surah Yaseen (Heart of Quran)",
    artist: "Mishary Rashid Alafasy",
    category: "Devotional Recitation",
    duration: "17:40",
    src: "./assets/audio/asma_ul_husna.mp3"
  },
  {
    title: "Surah Ar-Rahman (The Beneficent)",
    artist: "Mishary Rashid Alafasy",
    category: "Devotional Recitation",
    duration: "11:19",
    src: "./assets/audio/qamarun.mp3"
  },
  {
    title: "Surah Al-Fatiha (Opening Recitation)",
    artist: "Mishary Rashid Alafasy",
    category: "Devotional Recitation",
    duration: "0:52",
    src: "./assets/audio/ya_nabi.mp3",
    officialUrl: "https://www.youtube.com/watch?v=Vqfy4ScF4ac"
  },
  {
    title: "Surah Al-Ikhlas (Sincerity)",
    artist: "Mishary Rashid Alafasy",
    category: "Devotional Recitation",
    duration: "0:22",
    src: "./assets/audio/hasbi_rabbi.mp3",
    officialUrl: "https://www.youtube.com/watch?v=k1oNfE3W2t4"
  },
  {
    title: "Surah An-Nas (Protection)",
    artist: "Mishary Rashid Alafasy",
    category: "Devotional Recitation",
    duration: "0:50",
    src: "./assets/audio/last_breath.mp3",
    officialUrl: "https://www.youtube.com/watch?v=F0fMvC3dE-c"
  }
];

export function render() {
  const track = playlist[currentTrackIndex];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎵 ${t('music.title')}</h1>
          <p class="page-subtitle">${t('music.subtitle')}</p>
        </div>
      </div>

      <!-- Player Card -->
      <div class="card music-player-card">
        <div class="music-artwork ${isPlaying ? 'animate-pulse' : ''}" id="music-artwork-box">
          <i data-lucide="music" style="width: 56px; height: 56px;"></i>
        </div>

        <div style="margin-top: var(--space-xs); text-align: center;">
          <h2 style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-text);" id="track-title">
            ${escapeHtml(track.title)}
          </h2>
          <p style="font-size: var(--font-size-base); color: var(--color-primary); font-weight: 700; margin-top: 2px;" id="track-artist">
            ${escapeHtml(track.artist)}
          </p>
          <span class="badge badge-info" style="margin-top: 6px;" id="track-category">
            ${t('music.category')}: ${escapeHtml(track.category)}
          </span>
        </div>

        <!-- Seek / Progress Bar -->
        <div style="width: 100%; margin-top: var(--space-md);">
          <div class="progress-bar-container">
            <span id="current-time-display" style="font-size: var(--font-size-xs); font-weight: 600; min-width: 36px;">0:00</span>
            <input type="range" id="seek-bar" class="progress-bar" min="0" max="100" value="0">
            <span id="duration-display" style="font-size: var(--font-size-xs); font-weight: 600; min-width: 36px;">${track.duration}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="music-controls">
          <button id="prev-track-btn" class="btn btn-secondary" style="border-radius: 50%; width: 50px; height: 50px; padding: 0;" aria-label="Previous Track">
            <i data-lucide="skip-back"></i>
          </button>

          <button id="play-pause-btn" class="btn btn-primary btn-lg" style="border-radius: 50%; width: 64px; height: 64px; padding: 0;" aria-label="Play/Pause">
            <i data-lucide="${isPlaying ? 'pause' : 'play'}" id="play-icon"></i>
          </button>

          <button id="next-track-btn" class="btn btn-secondary" style="border-radius: 50%; width: 50px; height: 50px; padding: 0;" aria-label="Next Track">
            <i data-lucide="skip-forward"></i>
          </button>
        </div>

        <!-- Volume Control -->
        <div style="display: flex; align-items: center; gap: var(--space-xs); margin-top: var(--space-sm); width: 200px;">
          <i data-lucide="volume-2" style="width: 18px; height: 18px; color: var(--color-text-secondary);"></i>
          <input type="range" id="volume-bar" class="progress-bar" min="0" max="1" step="0.05" value="${audioPlayer.volume !== undefined ? audioPlayer.volume : 0.8}">
        </div>

        <div id="official-link-container" style="margin-top: var(--space-sm);">
          ${track.officialUrl ? `
            <a href="${track.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              <i data-lucide="external-link"></i> ${t('music.official_channel')}
            </a>
          ` : ''}
        </div>
      </div>

      <!-- Playlist Selection -->
      <div class="card">
        <div class="card-header">
          <h3 style="font-size: var(--font-size-xl); font-weight: 800;">${t('music.playlist_title')}</h3>
          <a href="./CREDITS.md" target="_blank" class="btn btn-secondary btn-sm">${t('music.credits_btn')}</a>
        </div>
        
        <div id="playlist-container" style="display: flex; flex-direction: column; gap: var(--space-xs);">
          ${playlist.map((item, idx) => `
            <div class="card playlist-item" id="playlist-item-${idx}" style="padding: var(--space-md); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background-color 0.2s; background-color: ${idx === currentTrackIndex ? 'var(--color-primary-light)' : 'var(--color-surface)'};" onclick="window.selectTrack(${idx})">
              <div style="display: flex; align-items: center; gap: var(--space-sm);">
                <i data-lucide="${idx === currentTrackIndex && isPlaying ? 'volume-2' : 'music'}" class="playlist-icon-${idx}"></i>
                <div>
                  <div style="font-weight: 700;">${escapeHtml(item.title)}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${escapeHtml(item.artist)} · ${escapeHtml(item.category)}</div>
                </div>
              </div>
              <span style="font-size: var(--font-size-xs); font-weight: 600;">${item.duration}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const playBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');
  const seekBar = document.getElementById('seek-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeDisplay = document.getElementById('current-time-display');

  function updatePlayButtonIcon() {
    if (!playBtn) return;
    playBtn.innerHTML = `<i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>`;
    const artBox = document.getElementById('music-artwork-box');
    if (artBox) {
      if (isPlaying) {
        artBox.classList.add('animate-pulse');
      } else {
        artBox.classList.remove('animate-pulse');
      }
    }
    refreshLucideIcons();
  }

  /**
   * CRITICAL BUG FIX:
   * Explicitly updates top player title, artist, category, duration,
   * official link, and playlist item highlighting whenever track changes!
   */
  function updatePlayerDisplay(track, idx) {
    const titleEl = document.getElementById('track-title');
    const artistEl = document.getElementById('track-artist');
    const categoryEl = document.getElementById('track-category');
    const durationEl = document.getElementById('duration-display');
    const officialContainer = document.getElementById('official-link-container');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (categoryEl) categoryEl.textContent = `${t('music.category')}: ${track.category}`;
    if (durationEl) durationEl.textContent = track.duration;

    if (officialContainer) {
      if (track.officialUrl) {
        officialContainer.innerHTML = `
          <a href="${track.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <i data-lucide="external-link"></i> ${t('music.official_channel')}
          </a>
        `;
      } else {
        officialContainer.innerHTML = '';
      }
    }

    // Update active highlight in playlist
    playlist.forEach((_, i) => {
      const row = document.getElementById(`playlist-item-${i}`);
      if (row) {
        if (i === idx) {
          row.style.backgroundColor = 'var(--color-primary-light)';
        } else {
          row.style.backgroundColor = 'var(--color-surface)';
        }
      }
    });

    refreshLucideIcons();
  }

  audioPlayer.onplay = () => {
    isPlaying = true;
    updatePlayButtonIcon();
    startProgressTimer();
  };

  audioPlayer.onpause = () => {
    isPlaying = false;
    updatePlayButtonIcon();
    stopProgressTimer();
  };

  audioPlayer.onended = () => {
    // Auto-advance to next track
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    window.selectTrack(currentTrackIndex);
  };

  window.selectTrack = (idx) => {
    currentTrackIndex = idx;
    const track = playlist[currentTrackIndex];
    updatePlayerDisplay(track, currentTrackIndex);
    loadTrack(currentTrackIndex);
    playTrack();
  };

  function loadTrack(idx) {
    const track = playlist[idx];
    if (track.src) {
      audioPlayer.src = track.src;
    }
  }

  function playTrack() {
    const track = playlist[currentTrackIndex];
    if (!audioPlayer.src || !audioPlayer.src.includes(track.src.replace('./', ''))) {
      loadTrack(currentTrackIndex);
    }

    audioPlayer.play().then(() => {
      isPlaying = true;
      updatePlayButtonIcon();
      toast.show(t('music.now_playing_toast', { title: track.title }), 'info');
      startProgressTimer();
    }).catch(err => {
      console.error('Audio playback error:', err);
      toast.show(t('music.playback_error'), 'warning');
    });
  }

  function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButtonIcon();
    stopProgressTimer();
  }

  function startProgressTimer() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
      if (audioPlayer.duration && seekBar && currentTimeDisplay) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekBar.value = isNaN(pct) ? 0 : pct;
        const mins = Math.floor(audioPlayer.currentTime / 60);
        const secs = Math.floor(audioPlayer.currentTime % 60);
        currentTimeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 500);
  }

  function stopProgressTimer() {
    if (updateInterval) clearInterval(updateInterval);
  }

  if (playBtn) {
    playBtn.onclick = () => {
      if (isPlaying) {
        pauseTrack();
      } else {
        if (!audioPlayer.src) loadTrack(currentTrackIndex);
        playTrack();
      }
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      window.selectTrack(currentTrackIndex);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      window.selectTrack(currentTrackIndex);
    };
  }

  if (seekBar) {
    seekBar.oninput = () => {
      if (audioPlayer.duration) {
        audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
      }
    };
  }

  if (volumeBar) {
    volumeBar.oninput = () => {
      audioPlayer.volume = parseFloat(volumeBar.value);
    };
  }

  // Ensure current track UI is synced on mount
  updatePlayerDisplay(playlist[currentTrackIndex], currentTrackIndex);

  return () => {
    stopProgressTimer();
  };
}
