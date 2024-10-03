import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import AccessibleListGetJobComponent from './accessible-list-getjob/accessible-list-getjob.component';
import { AcsService } from '@core/services/acs.service';
import { firstValueFrom, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
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



const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'น.ส.เกษร เหนือโท',type_id:1, type:'ปกติ [0-60]',equipment:'เปลนอน', in: 'ศัลยกรรม 3', out:'ส่งผู้ป่วยกลับบ้าน',date:'15/08/2567',time:'11:20'},
  {name: 'Mr.JOSEPH WILLIAM WILLIAM JR',type_id:2, type:'ด่วน [0-30]',equipment:'เปลนอน+ออกซิเจน', in: 'ศัลยกรรม 3', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 7',date:'15/08/2567',time:'11:21'},
  {name: 'น.ส.ธัญญานุช ด้วงโพนแร้ง',type_id:3, type:'ด่วนมาก [0-20]',equipment:'รถนั่ง', in: 'รังสีร่วมรักษา', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 8',date:'15/08/2567',time:'11:16'},
  {name: 'นางสมร โภคามาตย์',type_id:4, type:'ด่วนพิเศษ [0-10]',equipment:'เปลนอน', in: 'เบญจสิริ 2', out:'เบญจสิริ 2',date:'15/08/2567',time:'11:15'},
];

const ELEMENT_MONI_DATA: MoniElement[] = [
  {status_id:1,status:'จ่ายงาน',officer:'นายไสว สอนโกษา', name: 'น.ส.เกษร เหนือโท',type_id:1, type:'ปกติ [0-60]',equipment:'เปลนอน', in: 'ศัลยกรรม 3', out:'ส่งผู้ป่วยกลับบ้าน',date:'15/08/2567',time:'11:20',date_end:'15/08/2567',time_end:''},
  {status_id:1,status:'จ่ายงาน',officer:'นายบุญเรือง พินิจงาม',name: 'Mr.JOSEPH WILLIAM WILLIAM JR',type_id:2, type:'ด่วน [0-30]',equipment:'เปลนอน+ออกซิเจน', in: 'ศัลยกรรม 3', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 7',date:'15/08/2567',time:'11:21',date_end:'15/08/2567',time_end:''},
  {status_id:2,status:'ปิดงาน',officer:'นายชุมพล ผดุงกิจ',name: 'น.ส.ธัญญานุช ด้วงโพนแร้ง',type_id:3, type:'ด่วนมาก [0-20]',equipment:'รถนั่ง', in: 'รังสีร่วมรักษา', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 8',date:'15/08/2567',time:'11:16',date_end:'15/08/2567',time_end:'11:30'},
  {status_id:2,status:'ปิดงาน',officer:'นายบุญเรือง พินิจงาม',name: 'นางสมร โภคามาตย์',type_id:4, type:'ด่วนพิเศษ [0-10]',equipment:'เปลนอน', in: 'เบญจสิริ 2', out:'เบญจสิริ 2',date:'15/08/2567',time:'11:15',date_end:'15/08/2567',time_end:'11:35'},
];

@Component({
  selector: 'app-accessible',
  standalone: true,

  templateUrl: './accessible.component.html',
  styleUrl: './accessible.component.scss',

  imports: [
    CommonModule,
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
    AccessibleListGetJobComponent
  ],
})

export default class AccessibleComponent implements OnInit{
  displayedColumns = ['star','date', 'type', 'name', 'equipment', 'in'];
  displayedColumnsMoni = ['star','status', 'type','date','date_end','officer', 'name', 'equipment', 'in'];
  dataSource = ELEMENT_DATA;
  // dataSourceMoni = ELEMENT_MONI_DATA;

  ward =  ""
  data:any;
  // ข้อมูลตาราง
  dataSourceWard = new MatTableDataSource<any>();
  // แสดงโหลดข้อมูล
  isLoading: boolean = false;

  constructor(private _acsService : AcsService,private _roleService: RoleService){
    this.initProfile(this._roleService.profile());
  }

  ngOnInit() : void{
    const wardId =  this._roleService.ward();
    if(wardId){
      this.getAcsByWards(wardId);
    }

  }


  async initProfile(data: any) {
    // console.log(data);
    this.ward = await data.departId;
  }

  clickedJob(row:any){
    console.log('Clicked Job', row);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  //โหลดข้อมูลรายการยา
  async getAcsByWards(wardId:number) {
    try {
      this.isLoading = true;
      const response: any = await firstValueFrom(this._acsService.getAcsByWard(wardId));
      // console.log(response.result);
      this.data = response.result;
      //this.dataSource.data = response.results;

    } catch (error) {
      this.isLoading = false;
      console.error("Error fetching data:", error);
    } finally {
      this.isLoading = false;
    }
  }

}
