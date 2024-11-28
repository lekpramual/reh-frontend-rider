import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportEmpFormSearchComponent } from './report-emp-form-search/report-emp-form-search.component';
import { MatCardModule } from '@angular/material/card';
import { ReportWardFormSearchComponent } from './report-ward-form-search/report-ward-form-search.component';
import { EmpFormSearch } from '../../../core/interface/reports.interface';
import { RoleService } from '@core/services/role.service';
import { single } from 'rxjs';


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

  wardName = signal('');
  roleType = signal('');
  roleService = inject(RoleService);

  constructor(){
    this.wardName.set('หน่วยงาน');
    this.roleType.set(this.roleService.role() == 5 ? 'opd' : 'ipd');
  }



}
