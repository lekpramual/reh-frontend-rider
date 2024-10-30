import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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
  wardName = signal('');
  currentDateTime = signal(new Date());

  private intervalId: any;

  currentDate: string ='';
  private subscriptionGetJob!: Subscription;
  private subscriptionMonitor!: Subscription;

  // from defualt
  formSearch = signal({
    start: new Date(),
    end:new Date(),
    searchOption:'od_rem',
    searchText:''
  })

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

    const _wardName = this._roleService.wardName();
    if(_wardName){
      this.wardName.set(_wardName)
    }

    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');

    this.fetchDataGetJob(); // Initial fetch // 60000ms = 1 minute
    this.fetchDataMonitor(); // Initial fetch // 60000ms = 1 minute
    this.subscriptionGetJob = interval(30000).subscribe(() => {
      this._snackBar.open(`กำลังโหลดข้อมูล ...`, '', {
        duration:1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['blue-snackbar']
      }).afterDismissed().subscribe(() => {
        // this.messageChange.emit('reset');
        this.fetchDataGetJob();
        this.fetchDataMonitor();
      });
    });
    this.intervalId = setInterval(() => {

      this.currentDateTime.set(new Date());
    }, 1000); // Update every second
  }

  fetchDataGetJob(): void {
    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');


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
    const _start  = moment(this.formSearch().start).add('years',-543).format('YYYY-MM-DD')
    const _end  = moment(this.formSearch().end).add('years',-543).format('YYYY-MM-DD')
    const _option =  this.formSearch().searchOption;
    const _text =  this.formSearch().searchText;


    console.log('start >>>>: ', _start);
    console.log('end >>>>: ', _end);

    this._acsService.getAcsByCenterMonitor(this.levelApp,_start,_end, _option,_text).subscribe({
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
    }else if($event){
      console.log('>>> reload',$event);
      this.formSearch.update((result) => ({
        ...result,
        start: new Date(),
        end:new Date(),
        searchOption:'od_rem',
        searchText:''
      }))
    }
  }

  formChangeSearch($event:any){
    console.log('>>> event change Search',$event);

    this.formSearch.update((result) => ({
      ...result,
        start: $event.start,
        end: $event.end,
        searchOption:$event.searchOption,
        searchText:$event.searchText
    }));

    this.fetchDataMonitor();

    // if(_option == 'name' && _value != ''){
    //   this.fetchDataSearchName(_value);
    // }else if(_option == 'date'  && _value != ''){
    //   this.fetchDataSearchDate(_value)
    // }else if(_option == 'cid'  && _value != ''){
    //   this.fetchDataSearchCid(_value)
    // }
  }




  ngOnDestroy(): void {
    if (this.subscriptionGetJob) {
      this.subscriptionGetJob.unsubscribe(); // Clean up subscription
    }

    if (this.subscriptionMonitor) {
      this.subscriptionMonitor.unsubscribe(); // Clean up subscription
    }

    clearInterval(this.intervalId);
  }


  clickedJob(row:any){
    console.log('Clicked Job', row);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("lll"); // Customize the format as needed
  }

}
