import { Component, HostListener, Input } from '@angular/core';
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
  displayColumns: string[] = ["no", "name"];
  screenWidth: number = window?.innerWidth;

  constructor(private audioplayer: AudioplayerService) {
    this.highlightSongPlayingIfAny(this.audioplayer.currentSong);
    this.audioplayer.currentSongChanged.subscribe(track => this.highlightSongPlayingIfAny(track));
    this.onWindowResize(); // initialise display columns
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600) {
      this.displayColumns = ["name"];
    } else {
      this.displayColumns = ["no", "name"]
    }
  }

  private highlightSongPlayingIfAny(track: Track | undefined) {
    if (track) {
      this.indexOfSongPlaying = this.album?.tracks.findIndex((t) => t.url === track.url);
    }
    else
      this.indexOfSongPlaying = undefined;
  }

  public playSong(indexInAlbum: number) {
    const shuffleWasEnabled = this.audioplayer.shuffleEnabled; 
    this.audioplayer.shuffleEnabled = false; // Disable shuffling for playlist loading, as we will want to skip ahead to a specific song.

    this.loadAlbumToPlayer();
    this.audioplayer.skipToSongInQueue(indexInAlbum);

    this.audioplayer.shuffleEnabled = shuffleWasEnabled;
    this.audioplayer.play();
  }

  loadAlbumToPlayer() {
    this.audioplayer.stopAndClear();
    this.audioplayer.addTracksToPlaylist(this.album?.tracks ?? []);
  }
}
