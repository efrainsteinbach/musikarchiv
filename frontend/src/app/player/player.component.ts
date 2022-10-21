import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Album } from '../app.interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  album: Album;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: Album) { 
    this.album = data;
  }

  ngOnInit(): void {
  }

}
