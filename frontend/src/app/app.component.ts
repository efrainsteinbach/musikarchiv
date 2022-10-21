import { Component } from '@angular/core';
import { Album } from './app.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'musikarchiv';

  showAlbum(album: Album) {
    // TODO: Bring up new view
    alert("This has " + album.tracks.length + " tracks.");
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
      year: 2013,
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
        }
      ]
    }
  ]
}


