import { EventEmitter, Injectable, Output } from '@angular/core';
import { RepeatMode, Track } from './app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AudioplayerService {

  private playlist: TrackPlayer[] = [];
  private tracksPlayed: TrackPlayer[] = [];
  private fullPlaylist: TrackPlayer[] = []; // playlist + tracks played, keeping the original order to shuffle/unshuffle

  private _shuffleEnabled: boolean = false;
  public get shuffleEnabled(): boolean {
    return this._shuffleEnabled;
  }
  public set shuffleEnabled(isEnabled: boolean) {
    this._shuffleEnabled = isEnabled;

    if (this.playlist.length === 0) {
      return;
    }
    const current = this.playlist[0];
    if (isEnabled) {
      this.fullPlaylist = [...this.tracksPlayed, ...this.playlist];
      this.shufflePlaylistExceptCurrent();
    } else {
      const idx = this.fullPlaylist.findIndex(s => s === current);
      if (idx >= 0) {
        this.playlist = this.fullPlaylist.slice(idx);
        this.tracksPlayed = this.fullPlaylist.slice(0, idx);
      }
    }
  }
  
  private shufflePlaylistExceptCurrent() {
    const current = this.playlist[0];
    if (current) {
      this.playlist.shift(); // remove current song
      for (let i = this.playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
      }
      this.playlist.unshift(current); // add it back
    }
  }

  private _repeatMode: RepeatMode = RepeatMode.DontRepeat;
  public get repeatMode(): RepeatMode {
    return this._repeatMode;
  }
  public set repeatMode(repeatMode: RepeatMode) {
    this._repeatMode = repeatMode;
  }

  private _isPlaying: boolean = false;
  public get isPlaying(): boolean {
    return this._isPlaying;
  }
  private set isPlaying(b: boolean) {
    this._isPlaying = b;
    this.isPlayingChanged.next(b);
  }

  public get currentSong(): Track | undefined {
    return this.playlist[0]?.track;
  }

  public get currentSongDuration(): number | undefined {
    return this.playlist[0]?.duration;
  }

  @Output()
  isPlayingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  currentSongChanged: EventEmitter<Track | undefined> = new EventEmitter<Track | undefined>();

  @Output()
  currentTime = new EventEmitter<number>();

  @Output()
  playbackStopped = new EventEmitter<void>();

  addTrackToPlaylist(track: Track) {
    const newSong = new TrackPlayer(track, () => this.onSongEnded(), (e) => this.onOneSecondPlayed(e));
    this.fullPlaylist.push(newSong);
    this.playlist.push(newSong);
    if (this.shuffleEnabled) {
      this.shufflePlaylistExceptCurrent();
    }
    this.currentSongChanged.next(this.playlist[0]?.track);
  }

  addTracksToPlaylist(tracks: Track[]) {
    tracks.forEach(track => {
      const newSong = new TrackPlayer(track, () => this.onSongEnded(), (e) => this.onOneSecondPlayed(e));
      this.fullPlaylist.push(newSong);
      this.playlist.push(newSong);
    });
    if (this.shuffleEnabled) {
      this.shufflePlaylistExceptCurrent();
    }
    this.currentSongChanged.next(this.playlist[0]?.track);
  }

  skipToSongInQueue(songsToSkip: number) {
    for (let i = 0; i < songsToSkip; i++) {
      const skippedSong = this.playlist[0];
      if (!skippedSong)
        break;
      skippedSong.stopAndRewind();
      this.playlist.shift();
      this.tracksPlayed.push(skippedSong);
      this.currentSongChanged.next(this.playlist[0]?.track);
    }
  }

  play() {
    console.log("play requested");
    const current = this.playlist[0];
    if (current) {
      current.play();
      this.isPlaying = true;
    }
  }

  pause() {
    console.log("pause requested");
    const current = this.playlist[0];
    if (current) {
      current.pause();
      this.isPlaying = false;
    }
  }

  nextSong() {
    console.log("next song requested");

    const current = this.playlist[0];
    if (current) {
      current.stopAndRewind();

      this.tracksPlayed.push(current);
      this.playlist.shift();

      const next = this.playlist[0];
      if (next) {
        if (this.isPlaying) {
          next.play();
        }
      } else {
        this.playlistEnded();
      }
    }

    this.currentSongChanged.next(this.playlist[0]?.track);
  }

  private onSongEnded() {
    console.log("song ended");
    const current = this.playlist[0];

    if (this.repeatMode === RepeatMode.RepeatOne) {
      current.rewind();
      current.play();
    } else {
      this.tracksPlayed.push(current);
      this.playlist.shift();
    }

    if (this.isPlaying) {
      if (this.playlist[0]) {
        console.log("next song starting..");
        this.playlist[0].play(); // continue with next song
      } else {
        this.playlistEnded();
      }
    }

    this.currentSongChanged.next(this.playlist[0]?.track);
  }

  private playlistEnded() {
    console.log("playlist ended");
    this.playlist = [...this.tracksPlayed]; // swap collections and start over at first song
    this.tracksPlayed = [];
    if (this.repeatMode === RepeatMode.RepeatAll && this.playlist[0] && this.isPlaying) {
      this.playlist[0].play(); // restart at first song in this case
    } else {
      this.isPlaying = false; // indicate that we're not playing anymore
    }
  }

  previousSong() {
    console.log("previous song/rewind requested");
    const current = this.playlist[0];
    if (current?.currentTime > 3) {
      current.rewind();
    } else {
      if (this.tracksPlayed.length) {
        current.stopAndRewind();
        const previous = this.tracksPlayed.pop();
        if (previous) {
          this.playlist.unshift(previous);
          if (this.isPlaying) {
            previous.play();
          }
        }
      } else {
        current.rewind();
      }
    }

    this.currentSongChanged.next(this.playlist[0]?.track);
  }

  private onOneSecondPlayed(currentTime: number) {
    this.currentTime.next(currentTime);
  }

  seek(seconds: number) {
    const current = this.playlist[0];
    if (current) {
      if (isFinite(current.duration)) {
        current.skipToSecond(seconds);
      }
    }
  }

  stopAndClear() {
    this.playlist.forEach(x => x.stopAndRewind());
    this.tracksPlayed.forEach(x => x.stopAndRewind());
    this.playlist = [];
    this.tracksPlayed = [];
    this.fullPlaylist = [];
    this.isPlaying = false;
  }
}

class TrackPlayer {
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;

  constructor(public track: Track, onSongEnded: () => void, onOnSecondsElapsed: (seconds: number) => void) {
    this.audio = new Audio();
    this.audio.src = track.url;
    this.audio.load();

    this.audio.addEventListener('ended', () => { this.isPlaying = false; onSongEnded(); });
    this.audio.addEventListener('timeupdate', () => onOnSecondsElapsed(this.audio.currentTime));
  }

  public get currentTime(): number {
    return this.audio.currentTime;

  }
  public get duration(): number {
    return this.audio.duration;
  }

  play() {
    if (!this.isPlaying && this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.isPlaying || !this.audio.paused) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  stopAndRewind() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  rewind() {
    this.audio.currentTime = 0;
  }

  skipToSecond(seconds: number) {
    if (seconds > this.audio.duration) {
      seconds = this.audio.duration;
    }
    if (seconds < 0) {
      seconds = 0;
    }
    this.audio.currentTime = seconds;
  }
}