import { Routes } from "@angular/router";

const ContentRoutes: Routes = [
  {
    path: '',
    loadComponent : (() => import("../staff/staff-list-getjob/staff-list-getjob.component")),
  }
];

export default ContentRoutes;
