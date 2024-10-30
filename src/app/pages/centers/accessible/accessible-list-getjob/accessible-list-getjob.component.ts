import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';


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

  displayedColumns = ['go_datetime', 'quick','wcode_staname','star'];
  dataSource = new MatTableDataSource<any>();

  @Input() set dataGetJob(data:any){
    console.log('data get job >>>',data);
    this.dataSource.data = data;
  }


  @Output() messageChange = new EventEmitter<string>();

  data: any;
  levelApp:string =  '';
  currentDate: string ='';
  private subscription!: Subscription;



  constructor(
    private dialog: MatDialog,
    private _acsService: AcsService,
    private _roleService: RoleService,
    private _snackBar: MatSnackBar
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
      result === "ok" && this.messageChange.emit('reload');
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
      result === "ok" && this.messageChange.emit('reload');
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
      result === "ok" && this.messageChange.emit('reload');
    });
  }

   //ฟังก์ชั่น: ปีภาษาไทย
   formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }
}
