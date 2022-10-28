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
        if (navigator?.mediaSession) {
          navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
      });

      this.audioplayer.currentSongChanged.subscribe(track => { this.updateMetadata(track); });
    }
  }

  private updateMetadata(track: Track | undefined) {
    if (track) {
      console.log('setting metadata', track);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        // album: track?.album ?? 'unknown-album',
        // artwork: [
        //   { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
        //   { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
        //   { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
        //   { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
        //   { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
        //   { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
        // ]
      });
    } else {
      navigator.mediaSession.metadata = null;
    }
  }
}
