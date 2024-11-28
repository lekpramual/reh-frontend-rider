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
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: "app-ward-layout",
  templateUrl: "./ward-layout.component.html",
  styleUrls: ["./ward-layout.component.scss"],
})

export class WardLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('toggleButton') toggleButton!: ElementRef<HTMLButtonElement>;

  subscription!: Subscription;


  titleApp = '';
  showFiller = false;

  loading = false;

  isMenuActive = signal("dashboard");
  isMenuOpened = signal(true);
  isBackDrop = signal(false);

  isUserProfile = signal({
      id: "",
      code: "",
      fullname: "",
      tel: "",
      depart_id: "",
      depart_name: "",
      status: "",
      level_id: "",
      role: "",
      username: ""
  });

  isSidenavOpen = true;

  isSmallScreen: boolean = false;

  events: string[] = [];
  opened!: boolean;

  currentRoute!: string;

  collapsed = signal(false);

  userId = signal<string | null>(null);

  // sidenavWidth = computed(() => (this.isMenuOpened() ? "250px" : "65px"));
  sidenavWidth = computed(() => (this.isBackDrop() ? !this.isMenuOpened()  ? "250px" :"250px" : this.isMenuOpened() ? "65px" : "250px"));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private configService: ConfigService,
    private role: RoleService,
    private authService: AuthService,
    private userService : UserService
  ) {}

  ngOnInit() {


    this.userId.set(this.authService.getUserId());
    // this.breakpointObserver
    //   .observe([
    //     Breakpoints.Large,
    //     Breakpoints.Medium,
    //   ])
    //   .subscribe((result) => {
    //     this.isMenuOpened.set(!result.matches);
    //     this.isBackDrop.set(result.matches ? true : false);

    //   });

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


    this.fetchDataProfile();
  }

  async fetchDataProfile(){
    this.userService.getUserById(this.userId()!).subscribe({
      next:(response:any)=>{
        const profile:any = response.result;

        if(profile.length == 1){
          const [results] = profile;
         this.isUserProfile.update((result) => ({
              ...result,
              id: results.id,
              code: results.code,
              fullname: results.fullname,
              tel: results.tel,
              depart_id: results.depart_id,
              depart_name: results.depart_name,
              status: results.status,
              level_id: results.level_id,
              role:results.role,
              username: results.username
           }))
        }
      },
      error:(err)=> {
        console.error('load profile user error :',err)
      },
    })
  }


  onActivate(component: any) {
    if ('sharedData' in component) {
      component.sharedData = this.isUserProfile();
    }
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
   this.authService.logout();
    // Optionally, redirect the user to the login page
    this.router.navigate(['/login']);
  }


}
