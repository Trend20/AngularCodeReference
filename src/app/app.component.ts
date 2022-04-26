import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent, NavigationStart, NavigationEnd, Event as NavigationEvent, ActivatedRoute} from '@angular/router';
import { environment } from './../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { slideInAnimation } from './app.animations';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {

  currentRoute!: string;
  constructor(private translate: TranslateService, private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute){
    translate.setDefaultLang('en'); // yeah, we gonna whoah them
    // router.events.subscribe((routerEvent: RouterEvent) => {

    // })
    this.router.events
    .subscribe(
    (event: NavigationEvent) => {
      if(event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if(this.currentRoute.includes('autologin')){
          let {broker} = this.router.parseUrl(this.currentRoute).queryParams;
          console.log(broker);
          if(typeof broker == undefined || broker == '' ||  broker == null){
            window.location.href = "https://partnersdev.mezybroker.com.au/";
          }
           else{
            this.authService.autoLogin(broker);
           }

        }

      }
    });
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  title = 'Deb Client';

}
