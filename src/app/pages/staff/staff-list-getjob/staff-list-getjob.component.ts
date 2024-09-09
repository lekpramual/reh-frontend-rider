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
import { Router } from '@angular/router';


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


const ELEMENT_DATA: PeriodicElement[] = [
  {id:1,name: 'น.ส.เกษร เหนือโท',type_id:1, type:'ปกติ [0-60]',equipment:'เปลนอน', in: 'ศัลยกรรม 3', out:'อายุรกรรม 4',out_id:'01',date:'15/08/2567',time:'11:20'},
  {id:2,name: 'Mr.JOSEPH WILLIAM WILLIAM JR',type_id:2, type:'ด่วน [0-30]',equipment:'เปลนอน+ออกซิเจน', in: 'ศัลยกรรม 3', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 7',out_id:'56',date:'15/08/2567',time:'11:21'},
  {id:3,name: 'น.ส.ธัญญานุช ด้วงโพนแร้ง',type_id:3, type:'ด่วนมาก [0-20]',equipment:'รถนั่ง', in: 'รังสีร่วมรักษา', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 8',out_id:'57',date:'15/08/2567',time:'11:16'},
  {id:4,name: 'นางสมร โภคามาตย์',type_id:4, type:'ด่วนพิเศษ [0-10]',equipment:'เปลนอน', in: 'เบญจสิริ 2', out:'เบญจสิริ 2',out_id:'32',date:'15/08/2567',time:'11:15'},
];


@Component({
  selector: 'app-staff-list-getjob',
  standalone: true,
  templateUrl: './staff-list-getjob.component.html',
  styleUrl: './staff-list-getjob.component.scss',
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

export default class StaffListGetJobComponent{

  displayedColumns = ['date', 'type', 'name', 'equipment', 'in','actions'];
  dataSource = ELEMENT_DATA;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  clickedJob(row:any){
    console.log('Clicked Job', row);
    if(row.id != 'null'){
      this.router.navigate(['scanner', row.id,row.out_id,row.out]);
    }
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

}
