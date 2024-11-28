import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { LoadingService } from '@core/components/loading/loading.service';
import { NoDataComponent } from '@core/components/nodata/nodata.component';
import { MY_FORMATS } from '@core/custom-date-format';
import { getThaiPaginatorIntl } from '@core/interface/thai-paginator-intl';
import { AcsService } from '@core/services/acs.service';
import { AuthService } from '@core/services/auth.service';
import { RoleService } from '@core/services/role.service';
import moment from 'moment';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { interval, Subscription } from 'rxjs';


export interface PeriodicElement {
  id:number;
  name: string;
  type:string;
  type_id:number;
  equipment: string;
  in: string;
  out: string;
  out_id: string;
  date:string;
  time:string;
}




@Component({
  selector: 'app-rider-jobs',
  standalone: true,
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    MatSelectModule,
    MatPaginatorModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    CommonModule,

    NoDataComponent,
    LoadingIndicatorComponent
  ],

  providers: [
    { provide: MatPaginatorIntl, useValue: getThaiPaginatorIntl() },
  ],

})

export default class RiderJobComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = ['status_work','go_datetime','go_time', 'quick','wcode_staname','star'];
  dataSource = new MatTableDataSource<any>();

  currentDate: string ='';

  data = signal<any>([]);
  riderId = signal<string | null>(null);
  currentDateTime = signal(new Date());

  private intervalId: any;
  private subscription!: Subscription;


  constructor(
    private dialog: MatDialog,
    private _acsService: AcsService,
    private authServic: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private _roleService: RoleService,
    public _loadingService: LoadingService
  ) {}



  ngOnInit() : void{

    moment.updateLocale('th', {
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'DD/MM/YYYY เวลา HH:mm',
        LLLL: 'วันddddที่ D MMMM YYYY เวลา HH:mm',
      },
      // Function to add 543 years to the Gregorian year
      postformat: (str: any) =>
        str.replace(/(\d{4})/g, (year: any) =>
          (parseInt(year, 10) + 543).toString()
        ),
    });



    const _riderId = this.authServic.getUserId();
    if(_riderId != null){
      this.riderId.set(_riderId);
    }


    this.getRiderByDate();
    this.subscription = interval(30000).subscribe(() => {
        this.getRiderByDate();
    });





    this.intervalId = setInterval(() => {
      this.currentDateTime.set(new Date());
    }, 1000); // Update every second
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.data();

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
    clearInterval(this.intervalId);
  }

  clickedJob(row:any){
    console.log('Clicked Job', row);
    if(row.id != 'null'){
      this.router.navigate(['rider/scanner', row.id,row.wcode_sto,row.wcode_stoname]);
    }
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }


  async getRiderByDate(){
    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');
    try {
      const resultRider = await this._acsService.getAcsByRiderMonitorNew(this.riderId()!,this.currentDate);
      console.log('resultRider >>> ',resultRider)
      // this.data.set(resultRider);
      this.dataSource.data = resultRider;
    } catch (error) {
      console.error(error);
      this._snackBar.open('โหลดข้อมูลเจ้าหน้าที่เปลผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }

  }


  calculateTimeDifferenceInMinutes(date:any,startTime: any, endTime: any): number {
    // console.log(_startTime,_endTime)
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const diffInMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes
    return diffInMinutes;
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("lll"); // Customize the format as needed
  }

  formatDateThaiL(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }

}
