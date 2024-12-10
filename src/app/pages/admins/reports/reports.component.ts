import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportEmpFormSearchComponent } from './report-emp-form-search/report-emp-form-search.component';
import { MatCardModule } from '@angular/material/card';
import { ReportWardFormSearchComponent } from './report-ward-form-search/report-ward-form-search.component';
import { EmpFormSearch } from '../../../core/interface/reports.interface';
import { RoleService } from '@core/services/role.service';
import { single } from 'rxjs';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-reports',
  standalone:true,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  imports:[
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    ReportEmpFormSearchComponent,
    ReportWardFormSearchComponent
  ]
})
export default class ReportsComponent {


  roleId = signal<string | null>(null);
  roleService = inject(RoleService);

  constructor(
    private _authService : AuthService
  ){

    let _roleId = this._authService.getUserRole();

    if(_roleId){
      this.roleId.set(_roleId == 'centeropd' ? 'opd' : 'ipd')
    }
  }



}
