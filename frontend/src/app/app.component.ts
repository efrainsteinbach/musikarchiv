import { AfterViewInit, Component } from '@angular/core';
import { Album } from './app.interfaces';
import { HttpClient } from '@angular/common/http';
import { MediaSessionConnectorService } from './mediasession-connector.service';
import { environment } from './../environments/environment';
import { Title } from '@angular/platform-browser';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements AfterViewInit {

  pageTitle = "";
  dataReady: boolean = false;
  albums: Album[] = [];
  albumDetail: Album | undefined;
  loggedIn = !(environment.authEnabled);

  constructor(
    private http: HttpClient,
    private _: MediaSessionConnectorService, // This is only injected to create a the singleton instance
    private authService: AuthService,
    private titleService: Title) {

    this.pageTitle = environment.pageTitle;
    this.titleService.setTitle(environment.pageTitle);

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

    if (authService.authToken) {
      this.loggedIn = true;
    }
  }

  ngAfterViewInit() {
    if (this.loggedIn) {
      this.onLoginComplete();
    }
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

  onLoginComplete() {
    this.loggedIn = true;
    this.http.get<Album[]>(environment.musicIndexLocation, { headers: { Authorization: "Basic " + this.authService.authToken } })
      .subscribe(data => {
        this.albums = data;
        this.albums.sort((a, b) => b.year - a.year);
        this.dataReady = true;
      });
  }
}
