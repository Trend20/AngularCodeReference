import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login-loader',
  templateUrl: './login-loader.component.html',
  styleUrls: ['./login-loader.component.css'],
})
export class LoginLoaderComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
  }
}
