import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Album } from '../app.interfaces';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent {

  album: Album;
  indexOfSongPlaying: number = 0;

  isPlaying: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Album) {
    this.album = data;
  }

  public playSong(indexInAlbum: number) {
    console.log("todo.");
  }
}
