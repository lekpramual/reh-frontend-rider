import { Routes } from "@angular/router";

const ContentRoutes: Routes = [
  {
    path: '',
    loadComponent : (() => import("../settings/settings.component")),
    children:[
      {
        path:'wards',
        loadComponent : (() => import("../settings/wards/wards.component")),
      },
      {
        path:'users',
        loadComponent : (() => import("../settings/users/users.component")),
      },
    ]
  }
];

export default ContentRoutes;
