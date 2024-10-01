import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessibleFormCreateComponent } from '../accessible-form-create/accessible-form-create.component';
import { AccessibleFormAssignmentComponent } from '../accessible-form-assignment/accessible-form-assignment.component';
import { AccessibleFormCancelComponent } from '../accessible-form-cancel/accessible-form-cancel.component';


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


const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'น.ส.เกษร เหนือโท',type_id:1, type:'ปกติ [0-60]',equipment:'เปลนอน', in: 'ศัลยกรรม 3', out:'ส่งผู้ป่วยกลับบ้าน',date:'15/08/2567',time:'11:20'},
  {name: 'Mr.JOSEPH WILLIAM WILLIAM JR',type_id:2, type:'ด่วน [0-30]',equipment:'เปลนอน+ออกซิเจน', in: 'ศัลยกรรม 3', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 7',date:'15/08/2567',time:'11:21'},
  {name: 'น.ส.ธัญญานุช ด้วงโพนแร้ง',type_id:3, type:'ด่วนมาก [0-20]',equipment:'รถนั่ง', in: 'รังสีร่วมรักษา', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 8',date:'15/08/2567',time:'11:16'},
  {name: 'นางสมร โภคามาตย์',type_id:4, type:'ด่วนพิเศษ [0-10]',equipment:'เปลนอน', in: 'เบญจสิริ 2', out:'เบญจสิริ 2',date:'15/08/2567',time:'11:15'},
];


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

export default class AccessibleListGetJobComponent{

  displayedColumns = ['date', 'type', 'name', 'equipment', 'in','star'];
  dataSource = ELEMENT_DATA;

  constructor(
    private dialog: MatDialog,

  ) {}

  clickedJob(row:any){
    console.log('Clicked Job', row);
    this.openDialogAssignment();
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
      // result === "ok" && this.getActivityInProjectById(this.id);
    });
  }
  openDialogAssignment(): void {
    const dialogRef = this.dialog.open(
      AccessibleFormAssignmentComponent,
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
  openDialogCancel(): void {
    const dialogRef = this.dialog.open(
      AccessibleFormCancelComponent,
      {
        data: {
          accessible_id: "",
          activity_name: "",
          activity_indicator: "",
          activity_amount: "",
        },
        width: "640px",
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      // result === "ok" && this.getActivityInProjectById(this.id);
    });
  }



}
