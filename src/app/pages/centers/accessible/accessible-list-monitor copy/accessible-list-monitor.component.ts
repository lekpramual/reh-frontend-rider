import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-accessible-list-monitor',
  standalone: true,
  templateUrl: './accessible-list-monitor.component.html',
  styleUrl: './accessible-list-monitor.component.scss',

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
    CommonModule
  ],
})

export default class AccessibleListMonitorComponent implements OnInit,OnDestroy{

  data: any;
  levelApp:string =  '';
  currentDate: string ='';
  private subscription!: Subscription;


  displayedColumns = ['go_datetime', 'quick','name_equip','wcode_staname','star'];
  dataSource = new MatTableDataSource<any>();

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

    const _levelApp =  this._roleService.role();
    if(_levelApp){
      this.levelApp = _levelApp == 5 ? 'opd' : 'ipd';
    }

    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');

    console.log('_levelApp >>>',this.levelApp);
    console.log('_currentDate >>>',this.currentDate);

    this.fetchData(); // Initial fetch // 60000ms = 1 minute
    this.subscription = interval(60000).subscribe(() => {

      this._snackBar.open(`กำลังโหลดข้อมูล ติดตาม-สถานะ...`, '', {
        duration:1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['success-snackbar']
      }).afterDismissed().subscribe(() => {
        // this.messageChange.emit('reset');
        this.fetchData();
      });

    });


  }

  fetchData(): void {
    this._acsService.getAcsByCenterMonitor(this.levelApp,this.currentDate,this.currentDate).subscribe({
      next:(data:any) =>{
        console.log(data);
        this.data = data.result;
        this.dataSource.data = data.result;
      },
      error:(error:any) => {
      console.error('Error fetching data', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
  }

  clickedJob(row:any){
    console.log('Clicked Job', row);
    this.openDialogConfirm();
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openDialogConfirm(): void {
    const dialogRef = this.dialog.open(
      AccessibleFormConfirmComponent,
      {
        data: {
          accessible_id: "",
          activity_name: "",
          activity_indicator: "",
          activity_amount: "",
        },
        width: "640px",
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      // result === "ok" && this.getActivityInProjectById(this.id);
    });
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }

}
