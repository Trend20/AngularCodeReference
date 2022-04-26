import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { tracKingSharedService } from '../../trackingSharedService.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  username: string | undefined;
  createEventSubscription: Subscription | undefined;
  constructor(private sharedService: tracKingSharedService, private authService: AuthService) {
    this.createEventSubscription = this.sharedService.getClickEvent().subscribe((data) => {
      if (data === "openSideNav") {
        this.openSidebarFromTopNavClick();
      }
    })

  }

  ngOnInit(): void {
    this.username = this.authService.getCurrentUser()?.username;
  }

  ClickMe() {
    this.sharedService.sendClickEvent('createNew');
  }
  Logout(data: string) {
    this.sharedService.sendLogoutEvent(data)
  }
  openSidebarFromTopNavClick() {
    let wraper = document.getElementById('wraper') as HTMLElement;
    let sidebar = document.getElementById('sidebar') as HTMLElement;
    let section = document.getElementById('section') as HTMLElement;

    if (window.innerWidth < 990) {
      wraper.style.width = "50%";
      wraper.style.position = "absolute";
      section.style.width = "100%";
      section.style.position = "fixed";
      sidebar.style.display = "block";
    }
    else {
      wraper.style.width = "20%";
      wraper.style.position = "fixed";
      section.style.width = "80%";
      sidebar.style.display = "block";
    }
  }
  toggleSidebar() {
    let wraper = document.getElementById('wraper') as HTMLElement;
    let sidebar = document.getElementById('sidebar') as HTMLElement;
    let section = document.getElementById('section') as HTMLElement;
    sidebar.style.display = "none";

    wraper.style.width = "0%";
    section.style.width = "100%";
    this.sharedService.sendClickEvent('openBars');
  }

}
