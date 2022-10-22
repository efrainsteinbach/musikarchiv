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
  indexOfSongPlaying: number = -1;

  audioElement!: HTMLAudioElement;
  audioSourceElement!: HTMLAudioElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Album) {
    this.album = data;
  }

  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('source') sourceRef!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit(): void {
    this.audioElement = this.audioRef.nativeElement;
    this.audioSourceElement = this.audioRef.nativeElement;

    this.audioElement.addEventListener('ended', () => {
      this.onSongEnded();
    })
  }

  playSong(index: number) {
    console.log(`starting playback of song #${index+1}`);
    const track = this.album.tracks[index];
    this.audioElement.src = track.url;
    this.audioElement.load();
    this.audioElement.play();
    this.indexOfSongPlaying = index;
  }

  onSongEnded() {
    console.log(`song #${this.indexOfSongPlaying} ended`);
    if (this.indexOfSongPlaying < this.album.tracks.length - 1 && this.indexOfSongPlaying >= 0) {
      this.playSong(this.indexOfSongPlaying + 1);
    }
  }
}
