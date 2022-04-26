import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { slideInAnimation } from 'src/app/app.animations';

@Component({
  selector: 'app-tracking-ui',
  templateUrl: './tracking-ui.component.html',
  styleUrls: ['./tracking-ui.component.css'],
  animations: [slideInAnimation]
})
export class TrackingUiComponent implements OnInit {
  
  constructor() {
 
  }
  
  ngOnInit(): void {
    
  }


}
