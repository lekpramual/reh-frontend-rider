import { Component,ViewChild, ElementRef,OnInit, signal, computed, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, RouterModule } from '@angular/router';

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

import { MatSidenav } from '@angular/material/sidenav';
import { Subscription, single } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { CustomSidenavComponent } from '../../components/custom-sidenav/custom-sidenav.component';

import { CustomSidenavSMComponent } from '../../components/custom-sidenav-sm/custom-sidenav-sm.component';
import { MenuItemComponent } from '../../components/menu-item/menu-item.component';
import { MenuItemSMComponent } from '../../components/menu-item-sm/menu-item-sm.component';

import { environment } from "@env/environment";
import { RoleService } from "@core/services/role.service";

@Component({
  selector: "app-center-layout",
  templateUrl: "./center-layout.component.html",
  styleUrls: ["./center-layout.component.scss"],
})
export class CenterLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('toggleButton') toggleButton!: ElementRef<HTMLButtonElement>;

  defaultAccount = {
    userId: "1234",
    userName: "ประมวล",
    levelApp: "5",
    departId: "433",
    departName: "หน่วยงาน",
  };

  subscription!: Subscription;


  titleApp = '';
  showFiller = false;

  loading = false;

  isMenuOpened = signal(true);
  isBackDrop = signal(false);
  isSidenavOpen = true;

  isSmallScreen: boolean = false;

  events: string[] = [];
  opened!: boolean;

  currentRoute!: string;

  collapsed = signal(false);
  sidenavWidth = computed(() => (this.isMenuOpened() ? "250px" : "65px"));
  // sidenavWidth = computed(() => (this.isBackDrop() ? !this.isMenuOpened()  ? "250px" :"250px" : this.isMenuOpened() ? "65px" : "250px"));

  constructor(private router: Router, private activatedRoute: ActivatedRoute,private breakpointObserver: BreakpointObserver,private configService: ConfigService,private role: RoleService,) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        Breakpoints.XSmall,
      ])
      .subscribe((result) => {
        // result.matches && !this.collapsed() ?   this.sidenavWidth = "65px" : this.sidenavWidth = '23px';

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

    this.titleApp = this.configService.getTitleApp();
    this.initProfile(this.defaultAccount);
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

  logout() {
    // Clear the authentication token and other sensitive data from session storage
    localStorage.clear();
    // Optionally, redirect the user to the login page
    this.router.navigate(['/login']);
  }

  initProfile(data: any) {
    this.defaultAccount.userName = data.userName;
    this.defaultAccount.departName = data.departName;

    const levelApp = parseInt(data.levelApp);
    if(levelApp === 6){
      this.defaultAccount.levelApp = "ผู้ดูแลระบบ";
    }else if(levelApp === 5){
      this.defaultAccount.levelApp = "ศูนย์ OPD";
    }else if(levelApp === 4){
      this.defaultAccount.levelApp = "ศูนย์ IPD";
    }else if(levelApp === 3){
      this.defaultAccount.levelApp = "เจ้าหน้าที่ OPD";
    }else if(levelApp === 2){
      this.defaultAccount.levelApp = "เจ้าหน้าที่ IPD";
    }else{
      this.defaultAccount.levelApp = "วอร์ด";
    }

  }

}
