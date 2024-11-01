import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
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
import { AcsGetJobList, AcsList } from '@core/interface/acs.interface';


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


  dataGetJobNew = signal<AcsGetJobList[] | undefined>([]);
  dataMonitorNew = signal<AcsList[] | []>([]);

  levelApp = signal('');
  wardName = signal('');
  currentDateTime = signal(new Date());

  private intervalId: any;

  // currentDate: string ='';
  currentDate = signal<string | ''>('');
  private subscriptionGetJob!: Subscription;
  private subscriptionMonitor!: Subscription;

  // from defualt
  formSearch = signal({
    start: new Date(),
    end:new Date(),
    searchOption:'od_rem',
    searchText:'',
    searchWard:'',
    searchPerson:'',
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
      // this.levelApp = _levelApp == 5 ? 'opd' : 'ipd';
      this.levelApp.set(_levelApp == 5 ? 'opd' : 'ipd')
    }

    const _wardName = this._roleService.wardName();
    if(_wardName){
      this.wardName.set(_wardName)
    }

    this.currentDate.set(moment().add('years',-543).format('YYYY-MM-DD'));


    this.fetchDataGetJobNew(); // Initial fetch // 60000ms = 1 minute
    this.fetchDataMonitorNew(); // Initial fetch // 60000ms = 1 minute
    this.subscriptionGetJob = interval(30000).subscribe(() => {
        this.fetchDataGetJobNew();
        this.fetchDataMonitorNew();
    });
    this.intervalId = setInterval(() => {

      this.currentDateTime.set(new Date());
    }, 1000); // Update every second
  }

  async fetchDataGetJobNew() {
    try {
      const results = await this._acsService.getAcsByCenterGetJobNew(this.levelApp(),this.currentDate())
      this.dataGetJobNew.set(results);

    } catch (error) {
      this._snackBar.open('โหลดข้อมูรับงานผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }
  }



  async fetchDataMonitorNew() {
    const _start  = moment(this.formSearch().start).add('years',-543).format('YYYY-MM-DD')
    const _end  = moment(this.formSearch().end).add('years',-543).format('YYYY-MM-DD')
    const _option =  this.formSearch().searchOption;
    const _text =  this.formSearch().searchText;
    const _persion =  this.formSearch().searchPerson;
    const _ward =  this.formSearch().searchWard;

    try {
      const results = await this._acsService.getAcsByCenterMonitorNew(this.levelApp(),_start,_end, _option,_text,_persion,_ward)
      this.dataMonitorNew.set(results);

    } catch (error) {
      this._snackBar.open('โหลดข้อมูลติดตามผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
      console.error(error);
    }
  }

  messageChange($event:any){
    if($event == 'reload'){
      this.fetchDataGetJobNew();
      this.fetchDataMonitorNew();
    }else if($event){
      this.formSearch.update((result) => ({
        ...result,
        start: new Date(),
        end:new Date(),
        searchOption:'od_rem',
        searchText:'',
        searchWard:'',
        searchPerson:'',
      }))
    }
  }

  formChangeSearch($event:any){
    const start = $event.start;
    const end=  $event.end;
    const searchOption= $event.searchOption;
    const searchText= $event.searchText;
    const searchWard= $event.searchWard;
    const searchPerson= $event.searchPerson;

    this.formSearch.update((result) => ({
      ...result,
        start: start,
        end:  end,
        searchOption: searchOption,
        searchText: searchText,
        searchWard: searchWard,
        searchPerson: searchPerson,
    }));

    this.fetchDataMonitorNew();
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

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("lll"); // Customize the format as needed
  }

}
