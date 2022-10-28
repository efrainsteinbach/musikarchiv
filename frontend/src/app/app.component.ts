import { Component } from '@angular/core';
import { Album } from './app.interfaces';
import { HttpClient } from '@angular/common/http';
import { MediaSessionConnectorService } from './mediasession-connector.service';

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
    this.http.get<Album[]>("http://localhost:3000/index.json")
      .subscribe(data => {
        this.albums = data;
        this.dataReady = true;
      });
  }

  showAlbum(album: Album) {
    this.albumDetail = album;
  }

  closeAlbum() {
    this.albumDetail = undefined;
  }
}


