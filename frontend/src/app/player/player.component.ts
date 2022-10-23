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

  audioElement!: HTMLAudioElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Album) {
    this.album = data;
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

  playSong(index: number) {
    console.log(`starting playback of song #${index + 1}`);
    const track = this.album.tracks[index];
    this.audioElement.src = track.url;
    this.audioElement.load();
    this.audioElement.play();
    this.indexOfSongPlaying = index;
    this.isPlaying = true;
  }

  onSongEnded() {
    console.log(`song #${this.indexOfSongPlaying} ended`);
    if (this.indexOfSongPlaying < this.album.tracks.length - 1 && this.indexOfSongPlaying >= 0) {
      this.playSong(this.indexOfSongPlaying + 1);
    } else {
      this.isPlaying = false;
    }
  }

  onPlayPauseClicked() {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.playSong(this.indexOfSongPlaying);
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
        this.playSong(songToPlay);
      else
        this.indexOfSongPlaying = songToPlay;
    }
  }

  onNextClicked() {
    const songPlaying = this.indexOfSongPlaying;
    const songToPlay = songPlaying === this.album.tracks.length - 1 ? songPlaying : songPlaying + 1;
    if (this.isPlaying)
      this.playSong(songToPlay);
    else
      this.indexOfSongPlaying = songToPlay;
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

    this.audioElement.currentTime = this.audioElement.duration * this.sliderPosition;
  }
}
