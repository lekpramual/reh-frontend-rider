import { Routes } from "@angular/router";

const ContentRoutes: Routes = [
  {
    path: '',
    loadComponent : (() => import("../content/content.component")),
    children:[
      {
        path:'videos',
        loadComponent : (() => import("../content/videos/videos.component")),
      },
      {
        path:'playlists',
        loadComponent : (() => import("../content/playlists/playlists.component")),
      },
      {
        path:'posts',
        loadComponent : (() => import("../content/posts/posts.component")),
      },
    ]
  }
];

export default ContentRoutes;
