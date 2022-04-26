import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  private _lol: any

  @Input()
  set lol(value: any) {
    if (value) {
      console.log(value)
      this._lol = value
    }
  }

  get lol() {
    return this._lol
  }


  constructor() { }

  ngOnInit(): void {
  }

}
