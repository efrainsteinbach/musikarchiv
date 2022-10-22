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
}
