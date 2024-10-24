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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessibleFormConfirmComponent } from '../accessible-form-confirm/accessible-form-confirm.component';
import { AcsService } from '@core/services/acs.service';
import { RoleService } from '@core/services/role.service';
import moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  displayedColumns = ['date', 'type', 'name', 'equipment', 'in','star'];
  displayedColumnsMoni = ['status', 'type','date','date_end','officer', 'name', 'equipment', 'in','star'];
  dataSource = ELEMENT_DATA;
  dataSourceMoni = ELEMENT_MONI_DATA;

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
    // this._acsService.getAcsByCenterGetJobs(this.levelApp,this.currentDate).subscribe(response => {
    //   console.log('>>>>response',response)
    //   // this.data = response;
    //   this.dataSource.data = response.result;
    // }, error => {
    //   console.error('Error fetching data', error);
    // });

    this._acsService.getAcsByCenterMonitor(this.levelApp,this.currentDate,this.currentDate).subscribe({
      next:(data:any) =>{
        console.log(data);
        this.data = data.result;
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

}
