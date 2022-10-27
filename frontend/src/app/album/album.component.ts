import { Component, Input } from '@angular/core';
import { Album, Track } from '../app.interfaces';
import { AudioplayerService } from '../audioplayer.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent {

  @Input()
  album: Album | undefined;
  indexOfSongPlaying: number | undefined;

  constructor(private audioplayer: AudioplayerService) {
    this.highlightSongPlayingIfAny(this.audioplayer.currentSong);
    this.audioplayer.currentSongChanged.subscribe(track => this.highlightSongPlayingIfAny(track));
  }

  private highlightSongPlayingIfAny(track: Track | undefined) {
    if (track) {
      this.indexOfSongPlaying = this.album?.tracks.findIndex((t) => t.url === track.url);
    }
    else
      this.indexOfSongPlaying = undefined;
  }

  public playSong(indexInAlbum: number) {
    this.loadAlbumToPlayer();
    this.audioplayer.skipToSongInQueue(indexInAlbum);
    this.audioplayer.play();
  }

  loadAlbumToPlayer() {
    this.audioplayer.stopAndClear();
    if (this.album) {
      this.album!.tracks.forEach(track => this.audioplayer.addTrackToPlaylist(track));
    }
  }
}
