import { Component, OnInit, signal } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatCardModule} from '@angular/material/card';
import { RoleService } from '@core/services/role.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from '@core/services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { LoadingService } from '@core/components/loading/loading.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports:[
    HighchartsChartModule,
    MatCardModule ,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,

    LoadingIndicatorComponent
  ]
})
export default  class DashboardComponent  implements OnInit{


  chartData: any = [];
  chart: any = [];



  title: string = "";
  roleId = signal<string | null>(null);
  dataOpd = signal<number[] | []>([]);
  dataIpd = signal<number[] | []>([]);

  constructor(
    private _roleService: RoleService,
    private _dashboardService:DashboardService,
    private _snackBar: MatSnackBar,
    public _loadingService: LoadingService,
    private _authService : AuthService
  ) {}

  async  ngOnInit() {
    // ฟังก์ชัน: ข้อมูลปีย้อนหลัง
    this.getYearsBack();


    this.fetchDataOPD();
    this.fetchDataIPD();

    this.loadingTest()
  }

  async loadingTest(){
    const result = await this._loadingService.loading();
    console.log(result);
  }

  // ปีปัจจุบัน
  current_year = new Date().getFullYear();
  optionsYears: any = [];
  // กำหนดปีงบประมาณตั้งต้น
  selectedOption: string = String(this.current_year);
  selectedThaiOption: string = String(this.current_year + 543);

  Highcharts: typeof Highcharts = Highcharts;


  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: `กราฟแสดงจำนวนการขอใช้เปลออนไลน์ ประจำปีงบ : ${this.selectedThaiOption}`
    },

    xAxis: {
      categories: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    },
    yAxis: {
      title: {
        text: 'จำนวน (ครั้ง)'
      }
    },
    series: [
      {
        name: 'OPD',
        type: 'line',
        data: [],
        color:'#2196F3',
      },
      {
        name: 'IPD',
        type: 'line',
        data: [],
        color:'#4CAF50',
      }
    ]
  };


  // ฟังก์ชัน: แสดงกราพประจำปีงบประมาณ
  onOptionSelectionChange() {
    // เปลี่ยน ค.ศ เป็น พ.ศ.
    this.selectedThaiOption = String(Number(this.selectedOption) + 543);
    this.selectedOption = String(this.selectedOption);

    this.fetchDataOPD();
    this.fetchDataIPD();

    // update Chart
    this.chartOptions = {
      ...this.chartOptions,
      title: {
        text: `กราฟแสดงจำนวนการขอใช้เปลออนไลน์ ประจำปีงบ : ${this.selectedThaiOption}`
      }

    }
  }

  // ฟังก์ชัน: สำหรับแสดงรายการ 5 ปีย้อนหลัง
  getYearsBack(): void {
    // ลูป : ข้อมูลจากปีปัจจุบัน
    for (
      let i = Number(this.current_year) - 4;
      i <= Number(this.current_year);
      i++
    ) {
      this.optionsYears.push({
        value: String(i),
        label: String(i + 543),
      });
    }
    return this.optionsYears;
  }

   // ฟังก์ชัน: ดึงข้อมูลจาก api โดยแยกสิทธิในการโหลดข้อมูล
  async  fetchDataOPD() {
    const data: any = {};
    data.year = this.selectedOption;
    data.type_oi = 'opd';

    try {
      const result = await this._dashboardService.getDashboardByYearCenter(data);

        let _data = [
          parseInt(result[0]['month01']),
          parseInt(result[0]['month02']),
          parseInt(result[0]['month03']),
          parseInt(result[0]['month04']),
          parseInt(result[0]['month05']),
          parseInt(result[0]['month06']),
          parseInt(result[0]['month07']),
          parseInt(result[0]['month08']),
          parseInt(result[0]['month09']),
          parseInt(result[0]['month10']),
          parseInt(result[0]['month11']),
          parseInt(result[0]['month12']),
        ]

        this.dataOpd.set(_data);

        // this.updateChartOPD(_data);
        this.updateChart();
    } catch (error) {
      this._snackBar.open('โหลดข้อมูลติดตามผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
      console.error(error)
    }
  }

  async  fetchDataIPD() {
    const data: any = {};
    data.year = this.selectedOption;
    data.type_oi = 'ipd';

    try {
      const result = await this._dashboardService.getDashboardByYearCenter(data);

        let _data = [
          parseInt(result[0]['month01']),
          parseInt(result[0]['month02']),
          parseInt(result[0]['month03']),
          parseInt(result[0]['month04']),
          parseInt(result[0]['month05']),
          parseInt(result[0]['month06']),
          parseInt(result[0]['month07']),
          parseInt(result[0]['month08']),
          parseInt(result[0]['month09']),
          parseInt(result[0]['month10']),
          parseInt(result[0]['month11']),
          parseInt(result[0]['month12']),
        ]
        this.dataIpd.set(_data);
        // this.updateChartIPD(_data);

        this.updateChart();

    } catch (error) {
      this._snackBar.open('โหลดข้อมูลติดตามผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
      console.error(error)
    }
  }

  updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
        name: 'OPD',
        type: 'line',
        data: this.dataOpd(),
        color:'#2196F3',
        },
        {
          name: 'IPD',
          type: 'line',
          data: this.dataIpd(),
          color:'#4CAF50',
        }
      ],


    };
  }

}
