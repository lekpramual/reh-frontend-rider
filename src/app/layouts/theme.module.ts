import { NgModule } from "@angular/core";

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

import { CustomSidenavComponent } from "../components/custom-sidenav/custom-sidenav.component";
import { CustomSidenavSMComponent } from "../components/custom-sidenav-sm/custom-sidenav-sm.component";
import { MenuItemComponent } from "../components/menu-item/menu-item.component";
import { MenuItemSMComponent } from "../components/menu-item-sm/menu-item-sm.component";
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatDrawerContainer, MatDrawerContent, MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { MaterialModule } from "../shared/modules/material/material.module";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AuthLayoutComponent,
    CustomSidenavComponent,
    CustomSidenavSMComponent,
    MenuItemComponent,
    MenuItemSMComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    RouterModule,
  ],
})
export class ThemeModule {}
