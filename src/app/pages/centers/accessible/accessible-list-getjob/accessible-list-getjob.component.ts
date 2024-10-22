import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
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
import { AccessibleFormCreateComponent } from '../accessible-form-create/accessible-form-create.component';
import { AccessibleFormAssignmentComponent } from '../accessible-form-assignment/accessible-form-assignment.component';
import { AccessibleFormCancelComponent } from '../accessible-form-cancel/accessible-form-cancel.component';
import { AcsService } from '@core/services/acs.service';
import { interval, Subscription } from 'rxjs';
import moment from 'moment';
import { RoleService } from '@core/services/role.service';


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


@Component({
  selector: 'app-accessible-list-getjob',
  standalone: true,
  templateUrl: './accessible-list-getjob.component.html',
  styleUrl: './accessible-list-getjob.component.scss',
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

export default class AccessibleListGetJobComponent implements OnInit, OnDestroy{

  displayedColumns = ['go_datetime', 'quick','name_equip','wcode_staname','star'];
  dataSource = new MatTableDataSource<any>();

  data: any;
  levelApp:string =  '';
  currentDate: string ='';
  private subscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private _acsService: AcsService,
    private _roleService: RoleService
  ) {}

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

    this.fetchData(); // Initial fetch // 60000ms = 1 minute
    this.subscription = interval(60000).subscribe(() => {
      this.fetchData();
    });


  }

  fetchData(): void {
    // this._acsService.getAcsByCenterGetJobs(this.levelApp,this.currentDate).subscribe(response => {
    //   console.log('>>>>response',response)
    //   // this.data = response;
    //   this.dataSource.data = response.result;
    // }, error => {
    //   console.error('Error fetching data', error);
    // });

    this._acsService.getAcsByCenterGetJobs(this.levelApp,this.currentDate).subscribe({
      next:(data:any) =>{
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



  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(
      AccessibleFormCreateComponent,
      {
        data: {
          accessible_id: "",
          activity_name: "",
          activity_indicator: "",
          activity_amount: "",
        },
        width: "720px",
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      result === "ok" && this.fetchData();
    });
  }

  openDialogAssignment(Id:number): void {
    const dialogRef = this.dialog.open(
      AccessibleFormAssignmentComponent,
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
      // result === "ok" && this.getActivityInProjectById(this.id);
    });
  }

  openDialogCancel(Id:number): void {
    const dialogRef = this.dialog.open(
      AccessibleFormCancelComponent,
      {
        data: {
          Id: Id
        },
        width: "640px",
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      result === "ok" && this.fetchData();
    });
  }

   //ฟังก์ชั่น: ปีภาษาไทย
   formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }
}
