import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import AccessibleListGetJobComponent from './accessible-list-getjob/accessible-list-getjob.component';
import { AcsService } from '@core/services/acs.service';
import { firstValueFrom, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RoleService } from '@core/services/role.service';
import { AuthService } from '@core/services/auth.service';


export interface PeriodicElement {
  name: string;
  type:string;
  type_id:number;
  equipment: string;
  in: string;
  out: string;
  date:string;
  time:string;
}

export  interface MoniElement{
  status:string;
  status_id:number;
  officer:string;
  name: string;
  type:string;
  type_id:number;
  equipment: string;
  in: string;
  out: string;
  date:string;
  time:string;
  date_end:string;
  time_end:string;
}


@Component({
  selector: 'app-accessible',
  standalone: true,

  templateUrl: './accessible.component.html',
  styleUrl: './accessible.component.scss',

  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    AccessibleListGetJobComponent
  ],
})

export default class AccessibleComponent implements OnInit{
  displayedColumns = ['star','date', 'type', 'name', 'equipment', 'in'];
  displayedColumnsMoni = ['star','status', 'type','date','date_end','officer', 'name', 'equipment', 'in'];


  departId = signal<string | null>(null);
  data:any;
  // ข้อมูลตาราง
  dataSourceWard = new MatTableDataSource<any>();
  // แสดงโหลดข้อมูล
  isLoading: boolean = false;

  constructor(private _acsService : AcsService,private _roleService: RoleService,private authService: AuthService){

  }

  ngOnInit() : void{

  }


  clickedJob(row:any){
    console.log('Clicked Job', row);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }



}
