import { Component } from '@angular/core';
import { Album } from './app.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AlbumComponent } from './album/album.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog, private http: HttpClient) { }

  showAlbum(album: Album) {
    const dialogRef = this.dialog.open(AlbumComponent, { data: album });
  }

  dataReady: boolean = false;
  albums: Album[] = [];

  ngAfterViewInit(): void {
    this.http.get<Album[]>("http://localhost:3000/index.json")
      .subscribe(data => {
        this.albums = data;
        this.dataReady = true;
      });
  }
}


