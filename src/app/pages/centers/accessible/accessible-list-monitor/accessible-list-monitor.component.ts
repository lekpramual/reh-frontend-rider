import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessibleFormConfirmComponent } from '../accessible-form-confirm/accessible-form-confirm.component';
import { AcsService } from '@core/services/acs.service';
import { RoleService } from '@core/services/role.service';
import moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatCommonModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '@core/custom-date-format';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getThaiPaginatorIntl } from '@core/interface/thai-paginator-intl';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-accessible-list-monitor',
  standalone: true,
  templateUrl: './accessible-list-monitor.component.html',
  styleUrl: './accessible-list-monitor.component.scss',

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
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatPaginatorModule,
    CommonModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getThaiPaginatorIntl() },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'th' }, // Set the locale to Thai
  ],
})


export default class AccessibleListMonitorComponent implements OnInit{

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = ['status_work','go_datetime','go_time', 'quick','wcode_staname','star'];
  dataSource = new MatTableDataSource<any>();

  formSearch!: FormGroup;

  searchType = signal({
    searchOption:'od_rem',
    searchValue:'',
  });

  searchOptions = [
    {value: 'od_rem', label: 'ชื่อ-สกุล'},
    {value: 'wcode_staname', label  : 'วอร์ด'}
  ];

  @Input() set dataMonitor(data:any){
    console.log('data get monitor >>>',data);
    this.dataSource.data = data;
  }

  @Input() set formSearchMonitor(data:any){
    console.log('formSearch>>>',data);
    // this.dataSource.data = data;
    this.initForm(data);
  }


  @Output() messageChange = new EventEmitter<string>();
  @Output() formChangeSearch = new EventEmitter<[]>();

  _Id = signal(0);
  data: any;
  levelApp:string =  '';
  currentDate: string ='';
  private subscription!: Subscription;



  constructor(
    private dialog: MatDialog,
    private _acsService: AcsService,
    private _roleService: RoleService,
    private _snackBar: MatSnackBar
  ) {

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
  }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  initForm(data:any){
    // const _option = this.searchType().searchOption;
    this.formSearch = new FormGroup({
      start: new FormControl(data.start),
      end: new FormControl(data.end),
      searchOption: new FormControl(data.searchOption,[Validators.required]),
      searchText: new FormControl(data.searchText),
    });
  }



  clickedJob(row:any){
    console.log('Clicked Job', row);
    // this.openDialogConfirm();
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openDialogConfirm(Id:number): void {
    const dialogRef = this.dialog.open(
      AccessibleFormConfirmComponent,
      {
        data: {
          Id: Id
        },
        width: "640px",
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      result === "ok" && this.messageChange.emit('reload');
    });
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }

  calculateTimeDifferenceInMinutes(date:any,startTime: any, endTime: any): number {
    // console.log(_startTime,_endTime)
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const diffInMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes
    return diffInMinutes;
  }

  async onSubmit() {
    if (this.formSearch.valid) {
      this.formChangeSearch.emit(this.formSearch.value);
    }
  }


  onSelectionChange(event: MatSelectChange) {
    const _selectValue = event.value;
    console.log('Selected value:', _selectValue);
  }


  onClear() {
    this.messageChange.emit('reset');
  }



}
