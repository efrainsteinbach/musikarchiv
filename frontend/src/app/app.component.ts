import { Component } from '@angular/core';
import { Album } from './app.interfaces';
import { HttpClient } from '@angular/common/http';
import { MediaSessionConnectorService } from './mediasession-connector.service';
import { environment } from './../environments/environment';
import { state } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private http: HttpClient,
    private mediaSessionConnector: MediaSessionConnectorService) {

    window.onpopstate = (event) => {
      if (this.albumDetail) {
        this.clearAlbumDetail();
      } else {
        if (window.history.state && window.history.state.page) {
          const previouslyOpenedPage = window.history.state.page;
          const targetAlbum = this.albums.find(a => a.title === previouslyOpenedPage);
          if (targetAlbum) {
            this.showAlbum(targetAlbum);
          }
        }
      };
    }
  }

  dataReady: boolean = false;
  albums: Album[] = [];
  albumDetail: Album | undefined;

  ngAfterViewInit(): void {
    this.http.get<Album[]>(environment.musicIndexLocation)
      .subscribe(data => {
        this.albums = data;
        this.albums.sort((a, b) => b.year - a.year);
        this.dataReady = true;
      });
  }

  showAlbum(album: Album) {
    this.albumDetail = album;
    window.scrollTo(0, 0);
    if (window.history.state) {
      window.history.replaceState({ page: album.title }, album.title);
    } else {
      window.history.pushState({ page: album.title }, album.title);
    }
  }

  closeAlbum() {
    this.clearAlbumDetail();
    history.back();
  }

  private clearAlbumDetail() {
    this.albumDetail = undefined;
    window.scrollTo(0, 0);
  }
}


