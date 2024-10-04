import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { AccessibleFormCancelComponent } from '../accessible-form-cancel/accessible-form-cancel.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import moment from 'moment';
import 'moment/locale/th';
import { AcsService } from '@core/services/acs.service';
import { RoleService } from '@core/services/role.service';
import { firstValueFrom } from 'rxjs';

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


// const ELEMENT_DATA: PeriodicElement[] = [
//   {name: 'น.ส.เกษร เหนือโท',type_id:1, type:'ปกติ [0-60]',equipment:'เปลนอน', in: 'ศัลยกรรม 3', out:'ส่งผู้ป่วยกลับบ้าน',date:'15/08/2567',time:'11:20'},
//   {name: 'Mr.JOSEPH WILLIAM WILLIAM JR',type_id:2, type:'ด่วน [0-30]',equipment:'เปลนอน+ออกซิเจน', in: 'ศัลยกรรม 3', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 7',date:'15/08/2567',time:'11:21'},
//   {name: 'น.ส.ธัญญานุช ด้วงโพนแร้ง',type_id:3, type:'ด่วนมาก [0-20]',equipment:'รถนั่ง', in: 'รังสีร่วมรักษา', out:'หอผู้ป่วยพิเศษมะเร็งชั้น 8',date:'15/08/2567',time:'11:16'},
//   {name: 'นางสมร โภคามาตย์',type_id:4, type:'ด่วนพิเศษ [0-10]',equipment:'เปลนอน', in: 'เบญจสิริ 2', out:'เบญจสิริ 2',date:'15/08/2567',time:'11:15'},
// ];


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
    MatPaginatorModule,
    CommonModule
  ],

})

export default class AccessibleListGetJobComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  wardId:any =  ""
  data:any;
  // @Output() messageChange = new EventEmitter<string>();

  displayedColumns = [ 'go_date','go_time', 'quick', 'od_rem', 'equip', 'wcode_staname','status_work','star'];
  // dataSource = new MatTableDataSource<TPatient>();
  dataSource = new MatTableDataSource<any>();

  constructor(
    private dialog: MatDialog,
    private _acsService : AcsService,
    private _roleService: RoleService
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

  ngOnInit() : void{
    const _wardId =  this._roleService.ward();
    if(_wardId){

      this.getAcsByWards(_wardId);
      this.wardId = _wardId;
    }

  }

  //โหลดข้อมูลรายการยา
  async getAcsByWards(wardId:number) {
    try {
      const response: any = await firstValueFrom(this._acsService.getAcsByWard(wardId));
      // console.log(response.result);
      // this.data = response.result;
      this.dataSource.data = response.result;

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  }

  clickedJob(row:any){
    console.log('Clicked Job', row);

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
      result === "ok" && this.getAcsByWards(this.wardId);
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
      // result === "ok" && this.getActivityInProjectById(this.id);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }



}
