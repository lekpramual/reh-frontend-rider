import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/modules/material/material.module';

import { RouterModule } from '@angular/router';
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { ContentComponent } from './pages/content/content.component';
// import { AnalyticsComponent } from './pages/analytics/analytics.component';
// import { CommentsComponent } from './pages/comments/comments.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
// import { VideosComponent } from './pages/content/videos/videos.component';
// import { PlaylistsComponent } from './pages/content/playlists/playlists.component';
// import { PostsComponent } from './pages/content/posts/posts.component';
import { CustomSidenavSMComponent } from './components/custom-sidenav-sm/custom-sidenav-sm.component';
import { MenuItemSMComponent } from './components/menu-item-sm/menu-item-sm.component';
import { ConfigService } from './shared/services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { getThaiPaginatorIntl } from './core/interface/thai-paginator-intl';
import { ThemeModule } from './layouts/theme.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from "@angular/material-moment-adapter";
// import { DatePickerFormatDirective } from './core/date-picker-format.directive';
import { MY_FORMATS } from './core/custom-date-format';

import {provideMomentDateAdapter} from '@angular/material-moment-adapter';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig().toPromise();
}


@NgModule({
  declarations: [
    AppComponent
    // CustomSidenavComponent,
    // CustomSidenavSMComponent,
    // MenuItemComponent,
    // MenuItemSMComponent,
    // DashboardComponent,
    // ContentComponent,
    // AnalyticsComponent,
    // CommentsComponent,

    // VideosComponent,
    // PlaylistsComponent,
    // PostsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    RouterModule,
    ThemeModule

  ],
  exports:[
    CommonModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    // ตั้งค่า: วันที่ภาษาไทย
    // { provide: MAT_DATE_LOCALE, useValue: "th-TH" },
     // angular config root path กำหนด พาร์ทเริ่มต้น
    { provide: APP_BASE_HREF, useValue: "/app-rider/" },
    // ปลั๊กอิน: กำหนดภาษาตาราง
    { provide: MatPaginatorIntl, useValue: getThaiPaginatorIntl() },
    // setting mat snack bar and duration
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    // Form field appearance variants
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
