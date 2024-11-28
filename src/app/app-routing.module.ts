import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';
import UnauthorizedComponent from '@pages/unauthorized/unauthorized.component';
import { CenterLayoutComponent } from '@layouts/center-layout/center-layout.component';
import { WardLayoutComponent } from '@layouts/ward-layout/ward-layout.component';
import { RoleGuard } from '@core/guards/role.guard';
import { RiderLayoutComponent } from '@layouts/rider-layout/rider-layout.component';


const routes: Routes = [

  /*********************
   *********************
   * CENTER ROUTERS
   ********************/

   {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: { role: ['admin']},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent : (() => import("../app/pages/centers/dashboard/dashboard.component")),
      },
      {
        path: 'accessible',
        loadComponent : (() => import("../app/pages/centers/accessible/accessible.component")),
      },
      {
        path: 'reports',
        loadComponent : (() => import("../app/pages/centers/reports/reports.component")),
      },
      {
        path: 'wards',
        loadComponent : (() => import("../app/pages/centers/settings/wards/wards.component")),
      },
      {
        path: 'users',
        loadComponent : (() => import("../app/pages/centers/settings/users/users.component")),
      }
    ],
   },
  /*********************
   *********************
   * CENTER ROUTERS
   ********************/

   {
    path: "center",
    component: CenterLayoutComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: { role: ['centeropd','centeripd']},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      // CENTER
      {
        path: 'dashboard',
        loadComponent : (() => import("../app/pages/centers/dashboard/dashboard.component")),
      },
      {
        path: 'accessible',
        loadComponent : (() => import("../app/pages/centers/accessible/accessible.component")),
      },
      {
        path: 'reports',
        loadComponent : (() => import("../app/pages/centers/reports/reports.component")),
      },
      {
        path: 'wards',
        loadComponent : (() => import("../app/pages/centers/settings/wards/wards.component")),
      },
      {
        path: 'users',
        loadComponent : (() => import("../app/pages/centers/settings/users/users.component")),
      }
    ],
   },

  /*********************
   *********************
   * WARD ROUTERS
   ********************/
   {
    path: "ward",
    component: WardLayoutComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: { role: ['ward'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent : (() => import("../app/pages/wards/dashboard/dashboard.component")),
      },
      {
        path: 'accessible',
        loadComponent : (() => import("../app/pages/wards/accessible/accessible.component")),
      },
      {
        path: 'reports',
        loadComponent : (() => import("../app/pages/wards/reports/reports.component")),
      },

    ],
  },


  /*********************
   *********************
   * WARD ROUTERS
   ********************/
   {
    path: "rider",
    component: RiderLayoutComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: { role: ['rideropd','rideripd'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent : (() => import("../app/pages/riders/dashboard/dashboard.component")),
      },
      {
        path: 'jobs',
        loadComponent : (() => import("./pages/riders/jobs/jobs.component")),
      },
      {
        path: 'scanner/:id/:ward/:wardname',
        loadComponent : (() => import("./pages/riders/scanners/scanner.component")),
      }

    ],
  },

  /*********************
   *********************
   * GUARD ROUTERS
   ********************/
   {
    path: "auth",
    component: AuthLayoutComponent,
    children: [

      { path: "login", component: LoginComponent },
    ],
  },


  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: "**", redirectTo: "auth/login" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
