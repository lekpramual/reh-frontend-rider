import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';


const routes: Routes = [

  /*********************
   *********************
   * ADMIN ROUTERS
   ********************/
   {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent : (() => import("../app/pages/dashboard/dashboard.component")),
      },
      {
        path: 'scanner/:id/:ward/:wardname',
        loadComponent : (() => import("../app/pages/staff/staff-qrcode-scanner/staff-qrcode-scanner.component")),
      },
      {
        path: 'content',
        loadChildren: () => import('../app/pages/content/content.routes'),
      },
      {
        path: 'settings',
        loadChildren: () => import('../app/pages/settings/settings.routes'),
      },
      {
        path: 'staff',
        loadChildren: () => import('../app/pages/staff/staff.routes'),
      },

      {
        path: 'reports',
        loadComponent : (() => import("../app/pages/reports/reports.component")),
      },
      {
        path: 'comments',
        loadComponent : (() => import("../app/pages/comments/comments.component")),
      },
      {
        path: 'accessible',
        loadComponent : (() => import("../app/pages/accessible/accessible.component")),
      },
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
  { path: "**", redirectTo: "auth/login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
