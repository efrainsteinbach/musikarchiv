import { ChangeContext as SliderChangedEvent } from '@angular-slider/ngx-slider';
import { Options as SliderOptions } from '@angular-slider/ngx-slider/options';
import { AfterViewInit, Component } from '@angular/core';
import { RepeatMode, Track } from '../app.interfaces';
import { AudioplayerService } from '../audioplayer.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {

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
  repeatMode: RepeatMode = RepeatMode.DontRepeat;

  currentTrack: Track | undefined;

  readonly RepeatMode = RepeatMode; // Expose enum to template

  constructor(private audioService: AudioplayerService) {
  }

  ngAfterViewInit(): void {
    this.audioService.currentTime.subscribe((seconds) => { this.onAudioPlayedOneSecond(seconds) });
    this.audioService.currentSongChanged.subscribe((track) => {
      this.currentTrack = track;
    });
    this.audioService.isPlayingChanged.subscribe((newValue) => { 
      this.isPlaying = newValue;
     });
  }

  onAudioPlayedOneSecond(seconds: number) {
    const duration = this.audioService.currentSongDuration ?? 1;

    this.currentTime = this.secondsToFormattedString(seconds);

    if (this.sliderDragging === false) {
      this.sliderPosition = seconds / duration;
      this.totalTime = this.secondsToFormattedString(duration);
      this.currentTime = this.secondsToFormattedString(seconds);
    }
  }

  private secondsToFormattedString(totalSeconds: number): string {
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

  onNextClicked() {
    this.audioService.nextSong();
  }

  onPlayPauseClicked() {
    if (this.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }

  onPreviousClicked() {
    this.audioService.previousSong();
  }

  onSliderDragStart() {
    this.sliderDragging = true;
  }

  onSliderDragging(event: SliderChangedEvent) {
    const targetPositionInSeconds = (this.audioService.currentSongDuration ?? 0) * event.value;
    this.currentTime = this.secondsToFormattedString(targetPositionInSeconds);
  }

  onSliderDragEnd(event: SliderChangedEvent) {
    this.sliderDragging = false;
    this.sliderPosition = event.value;

    this.audioService.seek((this.audioService.currentSongDuration ?? 0) * this.sliderPosition);
  }

  onShuffleClicked() {
    this.shuffleEnabled = !this.shuffleEnabled;
    this.audioService.shuffleEnabled = this.shuffleEnabled;
  }

  onRepeatClicked() {
    switch (this.repeatMode) {
      case RepeatMode.DontRepeat:
        this.repeatMode = RepeatMode.RepeatAll;
        this.audioService.repeatMode = RepeatMode.RepeatAll;
        break;
      case RepeatMode.RepeatAll:
        this.repeatMode = RepeatMode.RepeatOne;
        this.audioService.repeatMode = RepeatMode.RepeatOne;
        break;
      default:
        this.repeatMode = RepeatMode.DontRepeat;
        this.audioService.repeatMode = RepeatMode.DontRepeat;
    }
  }
}