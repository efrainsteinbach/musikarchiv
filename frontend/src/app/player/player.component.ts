import { ChangeContext as SliderChangedEvent } from '@angular-slider/ngx-slider';
import { Options as SliderOptions } from '@angular-slider/ngx-slider/options';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Album } from '../app.interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {

  album: Album;
  indexOfSongPlaying: number = 0;
  isPlaying: boolean = false;
  sliderPosition: number = 0;
  currentTime: string = "0:00";
  totalTime: string = "-";

  sliderDragging: boolean = false;
  sliderOptions: SliderOptions = {
    floor: 0,
    ceil: 1,
    enforceStep: false,
    step: 0.001,
    hideLimitLabels: true,
    hidePointerLabels: true, 
    keyboardSupport: false,
  };

  shuffleEnabled: boolean = false;
  shuffledTrackIndices: number[];
  repeatMode: RepeatMode = RepeatMode.DontRepeat;

  readonly RepeatMode = RepeatMode; // Expose enum to template
  audioElement!: HTMLAudioElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Album) {
    this.album = data;
    this.shuffledTrackIndices = [...Array(this.album.tracks?.length ?? 1).keys()];
  }

  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit(): void {
    this.audioElement = this.audioRef.nativeElement;

    this.audioElement.addEventListener('ended', () => {
      this.onSongEnded();
    })
    this.audioElement.addEventListener('timeupdate', (event) => {
      this.onAudioPlayedOneSecond();
    });
  }

  onAudioPlayedOneSecond() {
    const duration = this.audioElement.duration ?? 1;
    const currentTime = this.audioElement.currentTime ?? 0;

    if (this.sliderDragging === false) {
      this.sliderPosition = currentTime / duration;
      this.totalTime = this.secondsToFormattedString(duration);
      this.currentTime = this.secondsToFormattedString(currentTime);
    }
  }

  secondsToFormattedString(totalSeconds: number): string {
    if (isNaN(totalSeconds))
      return "-";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - 3600 * hours) / 60);
    const seconds = Math.floor((totalSeconds - 3600 * hours - minutes * 60));
    const secondsPadded = `${seconds}`.padStart(2, "0");
    if (hours === 0) {
      return `${minutes}:${secondsPadded}`
    } else {
      const minutesPadded = `${minutes}`.padStart(2, "0");
      return `${hours}:${minutesPadded}:${secondsPadded}`;
    }
  }

  loadNewSong(index: number, startPlayback: boolean) {
    console.log(`starting playback of song #${index + 1}`);
    const track = this.album.tracks[index];
    this.audioElement.src = track.url;
    this.audioElement.load();
    this.indexOfSongPlaying = index;

    if (startPlayback) {
      this.audioElement.play();
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
    }
  }

  onSongEnded() {
    console.log(`song #${this.indexOfSongPlaying + 1} ended`);
    if (this.repeatMode === RepeatMode.RepeatOne) {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
    }
    else {
      this.onNextClicked();
    }
  }

  onNextClicked() {
    const nextSongIndex = this.getIndexOfNextSong();
    if (nextSongIndex === 0 && this.repeatMode === RepeatMode.DontRepeat) {
      this.loadNewSong(0, false); // load first song and stop playback
    }
    else {
      this.loadNewSong(nextSongIndex, true);
    }
  }

  getIndexOfNextSong(): number {
    let nextSongIndex = this.indexOfSongPlaying + 1;
    if (this.indexOfSongPlaying >= this.album.tracks.length - 1)
      nextSongIndex = 0;

    if (this.shuffleEnabled) {
      nextSongIndex = this.shuffledTrackIndices[nextSongIndex];
    }
    console.log(`next song is #${nextSongIndex + 1}`);
    return nextSongIndex;
  }

  onPlayPauseClicked() {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      if (this.audioElement.currentTime > 0) {
        this.audioElement.play();
        this.isPlaying = true;
      }
      else {
        this.loadNewSong(this.indexOfSongPlaying, true);
      }
    }
  }

  onPreviousClicked() {
    if (this.audioElement.currentTime > 3) {
      // just rewind to beginning of current song time is after 3s
      this.audioElement.currentTime = 0;
    } else {
      const songPlaying = this.indexOfSongPlaying;
      const songToPlay = songPlaying > 0 ? songPlaying - 1 : 0;
      if (this.isPlaying)
        this.loadNewSong(songToPlay, true);
      else
        this.indexOfSongPlaying = songToPlay;
    }
  }

  onSliderDragStart() {
    this.sliderDragging = true;
  }

  onSliderDragging(event: SliderChangedEvent) {
    const targetPositionInSeconds = (this.audioElement.duration ?? 0) * event.value;
    this.currentTime = this.secondsToFormattedString(targetPositionInSeconds);
  }

  onSliderDragEnd(event: SliderChangedEvent) {
    this.sliderDragging = false;
    this.sliderPosition = event.value;

    if (isFinite(this.audioElement.duration)) {
      this.audioElement.currentTime = this.audioElement.duration * this.sliderPosition;
    }
  }

  onShuffleClicked() {
    this.shuffleEnabled = !this.shuffleEnabled;
    const trackCount = this.album.tracks.length;
    const indexLookup = [...Array(trackCount).keys()]; // [1, 2, 3.. N]
    if (this.shuffleEnabled) {
      for (let i = indexLookup.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexLookup[i], indexLookup[j]] = [indexLookup[j], indexLookup[i]];
      }    
    }
    this.shuffledTrackIndices = indexLookup;
  }

  _shuffleArray(array: number[]) {
    
  }

  onRepeatClicked() {
    switch (this.repeatMode) {
      case RepeatMode.DontRepeat:
        this.repeatMode = RepeatMode.RepeatAll;
        break;
      case RepeatMode.RepeatAll:
          this.repeatMode = RepeatMode.RepeatOne;
          break;
      default:
        this.repeatMode = RepeatMode.DontRepeat;
    }
  }
}

enum RepeatMode {
  DontRepeat = 0,
  RepeatAll,
  RepeatOne
}