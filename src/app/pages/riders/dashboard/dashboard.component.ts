import { Component, Input, input, OnInit, signal } from '@angular/core';
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
import { LoadingService } from '@core/components/loading/loading.service';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '@shared/modules/material/material.module';
import { AuthService } from '@core/services/auth.service';
import { interval, Subscription } from 'rxjs';

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
    LoadingIndicatorComponent,
    MaterialModule
  ]
})
export default  class DashboardComponent  implements OnInit{


  chartData: any = [];
  chart: any = [];
  loading: boolean = true;

  title: string = "";
  depart: string = "";
  // departId: string = "";
  departId = signal<number | null>(null);
  userId = signal<number | null>(null);
  isActive: boolean = false;

  private subscription!: Subscription;

  constructor(
    private _snackBar: MatSnackBar,
    private _dashboardService:DashboardService,
    public _loadingService: LoadingService,
    private  authService: AuthService
  ) {}

   ngOnInit() {
    // ฟังก์ชัน: ข้อมูลปีย้อนหลัง
    this.getYearsBack();


    this.userId.set(this.authService.getUserId());

    this.fetchData();

    this.subscription = interval(60000).subscribe(() => {
      this.fetchData();
    });


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
    series: [{
      name: 'จำนวนขอใช้เปล',
      type: 'line',
      data: []
    }]
  };


  // ฟังก์ชัน: แสดงกราพประจำปีงบประมาณ
  onOptionSelectionChange() {
    // เปลี่ยน ค.ศ เป็น พ.ศ.
    this.selectedThaiOption = String(Number(this.selectedOption) + 543);
    this.selectedOption = String(this.selectedOption);

    this.fetchData();

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
   async fetchData() {
    const data: any = {};
    data.year = this.selectedOption;
    data.rider = this.userId();

    try {
      const result = await this._dashboardService.getDashboardByYearRider(data);

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
        this.updateChart(_data);

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

  updateChart(data: number[]) {
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        type: 'line',
        data: data
      }]
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }

  }


}
