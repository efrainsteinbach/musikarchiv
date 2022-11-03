import { Component } from '@angular/core';
import { Album } from './app.interfaces';
import { HttpClient } from '@angular/common/http';
import { MediaSessionConnectorService } from './mediasession-connector.service';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient, private mediaSessionConnector: MediaSessionConnectorService) { }

  dataReady: boolean = false;
  albums: Album[] = [];
  albumDetail: Album | undefined;

  ngAfterViewInit(): void {
    this.http.get<Album[]>(environment.musicIndexLocation)
      .subscribe(data => {
        this.albums = data;
        console.log(data.map(x => x.year));
        this.albums.sort((a, b) => b.year - a.year);
        console.log(data.map(x => x.year));
        this.dataReady = true;
      });
  }

  showAlbum(album: Album) {
    this.albumDetail = album;
    window.scrollTo(0, 0);
  }

  closeAlbum() {
    this.albumDetail = undefined;
    window.scrollTo(0, 0);
  }
}


