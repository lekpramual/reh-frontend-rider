import { Component,ViewChild, ElementRef,OnInit, signal, computed, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

import { MatSidenav } from '@angular/material/sidenav';
import { Subscription, single } from 'rxjs';
import { ConfigService } from './shared/services/config.service';
import {environment} from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('toggleButton') toggleButton!: ElementRef<HTMLButtonElement>;

  subscription!: Subscription;


  // Variable Data Default
  titleApp:string = '';
  loading:boolean = false;
  isMenuOpened = signal(true);
  isBackDrop = signal(false);
  isSidenavOpen = true;
  isSmallScreen: boolean = false;

  events: string[] = [];
  opened!: boolean;

  currentRoute!: string;

  collapsed = signal(false);
  sidenavWidth = computed(() => (this.isMenuOpened() ? "250px" : "65px"));

  constructor(private router: Router, private activatedRoute: ActivatedRoute,private breakpointObserver: BreakpointObserver,private configService: ConfigService) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall,
      ])
      .subscribe((result) => {
        this.isMenuOpened.set(!result.matches);
        this.isBackDrop.set(result.matches ? true : false);

      });

    this.router.events.subscribe(event => {
      // Logic to check the current route
      if (event instanceof NavigationStart) {
        this.loading = true;
      }else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.currentRoute = this.router.url;
        this.resetDrawer();

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });

    this.titleApp = environment.APP_TITLE;
  }

  isActiveLink(link: string): boolean {
    return this.currentRoute === link;
  }



  resetDrawer() {
    if (this.sidenav) {
      this.sidenav.close();
      const activeElement = this.toggleButton.nativeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
    }
  }


  onDrawerOpened() {
    // Add your custom logic here
    this.isMenuOpened.set(true);
  }

  onDrawerClosed() {

    // Add your custom logic here
    this.isMenuOpened.set(false);

  }

}
