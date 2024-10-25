import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import AccessibleListMonitorComponent from './accessible-list-monitor/accessible-list-monitor.component';
import AccessibleListGetJobComponent from './accessible-list-getjob/accessible-list-getjob.component';
import { AcsService } from '@core/services/acs.service';
import { RoleService } from '@core/services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { interval, Subscription } from 'rxjs';


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

    AccessibleListGetJobComponent,
    AccessibleListMonitorComponent
  ],
})

export default class AccessibleComponent implements OnInit,OnDestroy{

  dataGetJob:any = [];
  dataMonitor:any = [];

  levelApp:string =  '';
  currentDate: string ='';
  private subscriptionGetJob!: Subscription;
  private subscriptionMonitor!: Subscription;

  constructor(
    private _acsService: AcsService,
    private _roleService: RoleService,
    private _snackBar: MatSnackBar
  ){}
  ngOnInit(): void {

    moment.updateLocale('th', {
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY เวลา HH:mm',
        LLLL: 'วันddddที่ D MMMM YYYY เวลา HH:mm',
      },
      // Function to add 543 years to the Gregorian year
      postformat: (str: any) =>
        str.replace(/(\d{4})/g, (year: any) =>
          (parseInt(year, 10) + 543).toString()
        ),
    });

    const _levelApp =  this._roleService.role();
    if(_levelApp){
      this.levelApp = _levelApp == 5 ? 'opd' : 'ipd';
    }

    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');

    console.log('_levelApp >>>',this.levelApp);
    console.log('_currentDate >>>',this.currentDate);

    this.fetchDataGetJob(); // Initial fetch // 60000ms = 1 minute
    this.fetchDataMonitor(); // Initial fetch // 60000ms = 1 minute
    this.subscriptionGetJob = interval(60000).subscribe(() => {
      this._snackBar.open(`กำลังโหลดข้อมูล ...`, '', {
        duration:1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['success-snackbar']
      }).afterDismissed().subscribe(() => {
        // this.messageChange.emit('reset');
        this.fetchDataGetJob();
        this.fetchDataMonitor();
      });
    });

    // this.subscriptionMonitor = interval(60000).subscribe(() => {
    //   this._snackBar.open(`กำลังโหลดข้อมูล ติดตาม-สถานะ ...`, '', {
    //     duration:1500,
    //     horizontalPosition: 'right',
    //     verticalPosition: 'bottom',
    //     panelClass:['success-snackbar']
    //   }).afterDismissed().subscribe(() => {
    //     // this.messageChange.emit('reset');
    //     this.fetchDataMonitor();
    //   });
    // });
  }

  fetchDataGetJob(): void {
    this._acsService.getAcsByCenterGetJobs(this.levelApp,this.currentDate).subscribe({
      next:(data:any) =>{
        console.log('get job>>>',data.result)
        this.dataGetJob = data.result;
      },
      error:(error:any) => {
      console.error('Error fetching data', error);
      }
    });
  }

  fetchDataMonitor(): void {
    this._acsService.getAcsByCenterMonitor(this.levelApp,this.currentDate,this.currentDate).subscribe({
      next:(data:any) =>{
        console.log(data);
        this.dataMonitor = data.result;
      },
      error:(error:any) => {
      console.error('Error fetching data', error);
      }
    });
  }

  messageChange($event:any){
    console.log('>>> event change get job',$event);
    if($event == 'reload'){
      this.fetchDataGetJob();
      this.fetchDataMonitor();
    }
  }


  ngOnDestroy(): void {
    if (this.subscriptionGetJob) {
      this.subscriptionGetJob.unsubscribe(); // Clean up subscription
    }

    if (this.subscriptionMonitor) {
      this.subscriptionMonitor.unsubscribe(); // Clean up subscription
    }
  }


  clickedJob(row:any){
    console.log('Clicked Job', row);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

}
