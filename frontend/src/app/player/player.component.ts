import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Album, Track } from '../app.interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {

  album: Album;

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
  }

  playSong(index: number) {
    const track = this.album.tracks[index];
    this.audioElement.src = track.url;
    this.audioElement.load();
    this.audioElement.play();
  }
}
