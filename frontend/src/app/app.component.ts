import { Component } from '@angular/core';
import { Album } from './app.interfaces';
import { PlayerComponent } from './player/player.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog) { }

  showAlbum(album: Album) {
    const dialogRef = this.dialog.open(PlayerComponent, { data: album });
  }

  albums: Album[] = [
    {
      title: "Elias",
      artist: "Akademischer Chor, Anna Jelmorini",
      year: 2014,
      art: "./../assets/cover.png",
      tracks: [
        {
          title: "Einleitung \"So wahr der Herr...\" - Ouvertüre",
          artist: "Akademischer Chor Zürich, Anna Jelmorini",
          url: "./../assets/01 - Einleitung - Ouverture.ogg"
        },
        {
          title: "Chor und Reizitativ - Hilf Herr",
          artist: "Akademischer Chor Zürich, Anna Jelmorini",
          url: "./../assets/02 - 1. Chor und Rezitativ (_Hilf, Herr! - _Die Tiefe ist versieget!_).ogg"
        },
        {
          title: "Chor und Reizitativ - Herr, höre unser Gebet",
          artist: "Akademischer Chor Zürich, Anna Jelmorini",
          url: "./../assets/03 - 2. Duett mit Chor (_Herr, hore unser Gebet!_).ogg"
        },
      ]
    },
    {
      title: "Elias II - The Comeback",
      artist: "Akademischer Chor, Anna Jelmorini",
      year: 2015,
      art: "./../assets/cover2.png",
      tracks: [
        {
          title: "Einleitung \"So wahr der Herr...\" - Ouvertüre",
          artist: "Akademischer Chor Zürich, Anna Jelmorini",
          url: "./../assets/01 - Einleitung - Ouverture.ogg"
        },
        {
          title: "Chor und Reizitativ - Hilf Herr",
          artist: "Akademischer Chor Zürich, Anna Jelmorini",
          url: "./../assets/02 - 1. Chor und Rezitativ (_Hilf, Herr! - _Die Tiefe ist versieget!_).ogg"
        }
      ]
    }
  ];

  
  ngAfterViewInit(): void {
    this.showAlbum(this.albums[0]);
  }
}


