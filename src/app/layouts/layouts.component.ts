import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from '../app.animations';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css'],
  animations: [slideInAnimation]
})
export class LayoutsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.error('Layouts Component!')
  }

}
