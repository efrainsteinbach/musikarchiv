import { Injectable } from '@angular/core';
import { Track } from './app.interfaces';
import { AudioplayerService } from './audioplayer.service';

@Injectable({
  providedIn: 'root'
})
export class MediaSessionConnectorService {

  constructor(private audioplayer: AudioplayerService) {
    if ('mediaSession' in navigator) {
      console.log("connecting media session");
      navigator.mediaSession.setActionHandler('play', () => { this.audioplayer.play(); });
      navigator.mediaSession.setActionHandler('pause', () => { this.audioplayer.pause(); });
      navigator.mediaSession.setActionHandler('previoustrack', () => { this.audioplayer.previousSong(); });
      navigator.mediaSession.setActionHandler('nexttrack', () => { this.audioplayer.nextSong(); });

      this.audioplayer.isPlayingChanged.subscribe((isPlaying) => {
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
      });

      this.audioplayer.currentSongChanged.subscribe(track => { this.updateMetadata(track); });
    }
  }

  private updateMetadata(track: Track | undefined) {
    if (track && 'mediaSession' in navigator) {
      console.log('setting metadata', track);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        artwork: track.artwork ? [{ src: track.artwork, type: 'image/png' }] : [],
      });
    } else {
      navigator.mediaSession.metadata = null;
    }
  }
}
