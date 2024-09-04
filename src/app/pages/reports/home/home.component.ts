import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from '../settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AllFunctionServiceService } from '../all-function-service.service';
import { LocalServiceService } from '../local-service.service';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { Provider } from '@/hooks/APIs/Provider';

var doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4"
});
var base64Img = "";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  userData: any;

  searchText: string = "";

  all_datas: any[] = [];
  displayedColumns: string[] = ['no', 'year', 'month', 'income', 'diff', 'summary', 'income_type', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private settingsService: SettingsService, route: ActivatedRoute,
    public allFn: AllFunctionServiceService, private ls: LocalServiceService, private router: Router, public dialog: MatDialog,
    private apis: Provider) {
    this.setHeaderImage();
    const userData = this.ls.getUserData();
    if (userData) {
      let u = JSON.parse(userData);
      if (u) {
        this.userData = u.userData;
        this.userData.organization = u.organization;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.userData) {
      this.isLoading = true;
      // ===== ตรวจสอบว่าได้รับเงินเดือนหรือยัง =====
      let isInREH_DB = await this.verifyUserREH_HASH_CID();
      if (isInREH_DB && isInREH_DB.empData && isInREH_DB.empData.length > 0) {

        let payrolAll = await this.getPayrollAll();
        if (payrolAll && payrolAll.salaryData && payrolAll.salaryData.length > 0) {
          let all_datas = payrolAll.salaryData;
          all_datas.map((a: any) => {
            let day = new Date(a.salary_year, (a.salary_month - 1), 1);
            let dayMoment = moment(day);
            a.year = dayMoment.add(543, 'year').format("YYYY");
            a.month = dayMoment.format("MMMM");
            a.income = a.salary_total;
            a.diff = a.salary_total_minus;
            a.summary = a.salary_total_all;
            a.income_type = a.salary_type == 2 ? "กรมบัญชีกลาง" : "โรงพยาบาลร้อยเอ็ด";
          });

          this.all_datas = all_datas;
          this.dataSource.data = this.all_datas;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
      }
    }
    else {
      this._snackBar.open("มีข้อผิดพลาด ไม่สามารถดึงข้อมูล UserData ได้", "", { duration: 5000 });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.searchText = "";
    this.dataSource.filter = "";
  }

  // ============================================== REH ENDPOINT ============================================== //
  async verifyUserREH_HASH_CID(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apis.post("/payroll/UAT/api/v1/auth/verify", {}).subscribe({
        next: (results: any) => {
          resolve(results);
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
          this._snackBar.open("ท่านยังไม่ได้รับเงินเดือน หรือมีข้อผิดพลาด HASH_CID", "ติดต่อ 2096", { duration: 5000 });
          reject(err);
        }
      });
    });
  }

  async getPayrollAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apis.get("/payroll/UAT/api/v1/payroll-all").subscribe({
        next: (results: any) => {
          resolve(results);
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
          this._snackBar.open("มีข้อผิดพลาด Get Payroll All By CID", "", { duration: 5000 });
          reject(err);
        }
      });
    });
  }

  async getPayrollBySID(sid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apis.get("/payroll/UAT/api/v1/payroll-salary?sid=" + sid).subscribe({
        next: (results: any) => {
          resolve(results);
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
          this._snackBar.open("มีข้อผิดพลาด Get Payroll By SID", "", { duration: 5000 });
          reject(err);
        }
      });
    });
  }

  // ============================================== SHOW PDF ============================================== //
  setHeaderImage() {
    // รูปภาพ Logo
    if (base64Img == "") {
      this.http.get(this.allFn.getFullPathBaseHref() + '/assets/logo-moph-reh.png', { responseType: 'blob' })
        .subscribe(res => {
          const reader = new FileReader();
          reader.onloadend = () => {
            var base64data = reader.result;
            base64Img = base64data as string;
          }
          reader.readAsDataURL(res);
        });
    }
  }

  showPDF = async (element: any) => {
    try {
      let detail = await this.getPayrollBySID(element.sid);
      if (detail) {
        let salary_type = element.salary_type;
        let empData = detail.empData[0];
        let salaryData = detail.salaryData[0];

        let day = new Date(salaryData.yyyy, (salaryData.mm - 1), 1);
        let dayMoment = moment(day);
        let year = dayMoment.add(543, 'year').format("YYYY");
        let month = dayMoment.format("MMMM");

        let date_strr = month + " พ.ศ. " + year;

        this.initialPDF(date_strr);
        let result = await this.generatePDF(salary_type, empData, salaryData);
        if (result)
          this.outputPDF();
      }
    }
    catch (exception) {
      this._snackBar.open("มีข้อผิดพลาด", "", { duration: 5000 });
    }
  }

  initialPDF(date_strr: string) {
    doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    doc.setProperties({
      title: date_strr,
    });

    doc.addFont(this.allFn.getBaseHref() + '/assets/THSarabun.ttf', 'THSarabun', 'normal');
    doc.addFont(this.allFn.getBaseHref() + '/assets/THSarabun Bold.ttf', 'THSarabun', 'bold');
    moment.locale('th');
  }

  outputPDF() {
    // doc.output('dataurlnewwindow', { filename: "เดือน กรกฎาคม 2567" });
    window.open(doc.output('bloburl'), '_blank');
  }

  generatePDF = async (salary_type: number, empData: any, salaryData: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        // =============== Image ===============
        doc.addImage(base64Img, 'PNG', 15, 6, 25, 25, "Logo", 'MEDIUM');

        // =============== Header ===============
        let width = doc.internal.pageSize.getWidth();

        let y_number = 10;
        doc.setFontSize(10);
        doc.setFont('THSarabun', 'normal');
        doc.text("S-REH-001", width - 15, y_number, { align: 'right' });

        y_number += 8;
        doc.setFontSize(18);
        doc.setFont('THSarabun', 'bold');
        doc.text("รายละเอียด รายรับ - รายจ่าย เงินเดือนบุคลากร โรงพยาบาลร้อยเอ็ด", (width / 2), y_number, { align: 'center' });

        y_number += 6;
        let date_header = "";
        date_header = moment().format('D MMMM') + " "
          + moment().add(543, 'year').format('YYYY');
        date_header += " เวลา " + moment().utcOffset('+0700').format('HH:mm น.');
        doc.setFontSize(16);
        doc.setFont('THSarabun', 'normal');
        doc.text("วันที่พิมพ์ " + date_header, (width / 2), y_number, { align: 'center' });

        // =============== Employee Detail ===============
        doc.setFontSize(16);
        doc.setLineDashPattern([0.5, 1], 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);

        y_number += 12;
        doc.setFont('THSarabun', 'bold');
        doc.text("ชื่อ - นามสกุล : ", 20, y_number);
        doc.line(55, (y_number + 2), (width - 15), (y_number + 2));
        doc.setFont('THSarabun', 'normal');
        doc.text(empData.emp_name, 60, y_number);

        y_number += 8;
        doc.setFont('THSarabun', 'bold');
        doc.text("ประเภท : ", 20, y_number);
        doc.line(55, (y_number + 2), (width - 15), (y_number + 2));
        doc.setFont('THSarabun', 'normal');
        doc.text(empData.emp_type, 60, y_number);

        y_number += 8;
        doc.setFont('THSarabun', 'bold');
        doc.text("ประเภทการจ่ายเงิน : ", 20, y_number);
        doc.line(55, (y_number + 2), (width - 15), (y_number + 2));
        doc.setFont('THSarabun', 'normal');
        doc.text(empData.salary_type, 60, y_number);

        if (salary_type == 2) {
          y_number += 8;
          doc.setFont('THSarabun', 'bold');
          doc.text("บัญชี / สาขา : ", 20, y_number);
          doc.line(55, (y_number + 2), (width - 15), (y_number + 2));
          doc.setFont('THSarabun', 'normal');
          doc.text(salaryData.bank_name + " / " + salaryData.brand_name, 60, y_number);
        }

        let day = new Date(salaryData.yyyy, (salaryData.mm - 1), 1);
        let dayMoment = moment(day);
        let year = dayMoment.add(543, 'year').format("YYYY");
        let month = dayMoment.format("MMMM");

        y_number += 8;
        doc.setFont('THSarabun', 'bold');
        doc.text("ประจำเดือน : ", 20, y_number);
        doc.line(55, (y_number + 2), (width - 15), (y_number + 2));
        doc.setFont('THSarabun', 'normal');
        doc.text(month + " พ.ศ. " + year, 60, y_number);

        y_number += 12;
        doc.setFontSize(18);
        doc.setFont('THSarabun', 'bold');
        doc.text("รายละเอียด รายรับ - รายจ่าย เงินเดือนบุคลากร", 15, y_number);

        let dt: string[][] = [];

        // =============== โรงพยาบาลร้อยเอ็ด ===============
        if (salary_type == 1) {
          dt = [
            ['เงินเดือน', this.toCurrency(salaryData.emp_salary), 'ภาษี (OT)', this.toCurrency(salaryData.tax)],
            ['เงินประจำตำแหน่ง', this.toCurrency(salaryData.position_income), 'ค่าทำความสะอาด', this.toCurrency(salaryData.hosp_welfare)],
            ['ค่าครองชีพ', this.toCurrency(salaryData.child_amount), 'ประกันชีวิต', this.toCurrency(salaryData.insurance)],
            ['เงินค่าตกเบิก', this.toCurrency(salaryData.remain), 'อาคารสงเคราะห์', this.toCurrency(salaryData.assist)],
            ['เงินการศึกษาบุตร', this.toCurrency(salaryData.child_edu), 'ออมสิน', this.toCurrency(salaryData.savings)],
            ['เงินพิเศษเต็มขั้น', this.toCurrency(salaryData.renthome), 'ออมสิน 2', this.toCurrency(salaryData.bank)],
            ['เงินค่าไม่ทำเวชฯ', this.toCurrency(salaryData.lack), 'ประกันสังคม', this.toCurrency(salaryData.social)],
            ['เงินเบิกค่ารักษา', this.toCurrency(salaryData.total_keep), 'ฌกส.', this.toCurrency(salaryData.dead)],
            ['เงินเวรนอกเวลา', this.toCurrency(salaryData.total_ot), 'กองทุน พกส.', this.toCurrency(salaryData.car)],
            ['เงิน พตส.', this.toCurrency(salaryData.pts), 'สวัสดิการ สสจ.', this.toCurrency(salaryData.welfare)],
            ['เงินค่าตอบแทน จนท.', this.toCurrency(salaryData.emolument), 'กบข./กสจ.', this.toCurrency(salaryData.ghb)],
            ['P4P คุณภาพ', this.toCurrency(salaryData.p4pq), 'กองทุน กยศ.', this.toCurrency(salaryData.studentloan)],
            ['อื่นๆ', this.toCurrency(salaryData.other_amount), 'ค่าน้ำประปา', this.toCurrency(salaryData.water)],
            ['', '', 'ค่าไฟฟ้า', this.toCurrency(salaryData.electric)],
            ['', '', 'สวัสดิการ รพ.', this.toCurrency(salaryData.gsb)],
            ['', '', 'อื่นๆ', this.toCurrency(salaryData.buy_other)]
          ];
          let total_amount =
            Number(salaryData.emp_salary) + Number(salaryData.position_income) + Number(salaryData.child_amount) +
            Number(salaryData.remain) + Number(salaryData.child_edu) + Number(salaryData.renthome) +
            Number(salaryData.lack) + Number(salaryData.total_keep) + Number(salaryData.total_ot) +
            Number(salaryData.pts) + Number(salaryData.emolument) + Number(salaryData.p4pq) +
            Number(salaryData.other_amount);
          salaryData.total_amount = total_amount;

          let total_play =
            Number(salaryData.hosp_welfare) + Number(salaryData.insurance) + Number(salaryData.assist) +
            Number(salaryData.savings) + Number(salaryData.bank) + Number(salaryData.social) + Number(salaryData.dead) +
            Number(salaryData.car) + Number(salaryData.welfare) + Number(salaryData.ghb) + Number(salaryData.studentloan) +
            Number(salaryData.water) + Number(salaryData.electric) + Number(salaryData.gsb) + Number(salaryData.buy_other);
          salaryData.total_play = total_play;

          salaryData.net_amount = total_amount - total_play;
        }
        // =============== กรมบัญชีกลาง ===============
        else if (salary_type == 2) {
          dt = [
            ['เงินเดือน', this.toCurrency(salaryData.salary_amount), 'ภาษี', this.toCurrency(salaryData.tax_play)],
            ['เงินเดือน (ตกเบิก)', this.toCurrency(salaryData.salary_turn_amount), 'ค่าทุนเรือนหุ้น - เงินกู้สหกรณ์', this.toCurrency(salaryData.loan_play)],
            ['เงินปจต. / วิชาชีพ / วิทยฐานะ', this.toCurrency(salaryData.position_amount), 'กบข. / กสจ. (รายเดือน)', this.toCurrency(salaryData.account_play)],
            ['เงินปจต. / วิชาชีพ / วิทยฐานะ (ตกเบิก)', this.toCurrency(salaryData.position_turn_amount), 'เงินกู้เพื่อที่อยู่อาศัย', this.toCurrency(salaryData.home_play)],
            ['ต.ข.ท.ปจต. / ต.ข.8-8ว. / ต.ด.ข. 1-7', this.toCurrency(salaryData.position2_amount), 'เงินกู้เพื่อการศึกษา', this.toCurrency(salaryData.educate_play)],
            ['ต.ข.ท.ปจต./ต.ข.8-8ว./ต.ด.ข. 1-7 (ตกเบิก)', this.toCurrency(salaryData.position2_turn_amount), 'เงินกู้ยานพาหนะ', this.toCurrency(salaryData.car_play)],
            ['เงินช่วยเหลือบุตร', this.toCurrency(salaryData.child_amount), 'ค่าฌาปนกิจ / เงินช่วยเหลืองานศพ', this.toCurrency(salaryData.dead_play)],
            ['เงิน พ.ส.ร. / พ.ต.ก.', this.toCurrency(salaryData.fight_amount), 'เงินบำรุง/เงินทุน/กู้สวัสดิการ/สงเคราะห์', this.toCurrency(salaryData.cooperative_play)],
            ['เงินตอบแทนพิเศษ', this.toCurrency(salaryData.extra_amount), 'เงินบำรุงเรียกคืน/ ชดใช้ทางแพ่ง/ อายัดเงิน', this.toCurrency(salaryData.compensate_play)],
            ['อื่นๆ', this.toCurrency(salaryData.other_amount), 'อื่นๆ', this.toCurrency(salaryData.other_play)]
          ];
        }

        // =============== Table ===============
        y_number += 3;
        autoTable(doc, {
          startY: y_number,
          head: [['รายการรับ', 'จำนวน', 'รายการหัก', 'จำนวน']],
          body: dt,
          theme: 'grid',
          styles: { font: 'THSarabun', fontSize: 14, cellPadding: 2, textColor: 50 },
          headStyles: {
            fillColor: [200, 200, 200],
            // fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 14,
            halign: 'center'
          },
          columnStyles: {
            0: { halign: 'left', cellWidth: ((width - 30) * 0.35), cellPadding: { top: 1, bottom: 2, left: 3, right: 3 }, textColor: [0, 0, 0] },
            1: { halign: 'right', cellWidth: ((width - 30) * 0.15), cellPadding: { top: 1, bottom: 2, left: 3, right: 3 }, textColor: [0, 0, 0] },
            2: { halign: 'left', cellWidth: ((width - 30) * 0.35), cellPadding: { top: 1, bottom: 2, left: 3, right: 3 }, textColor: [0, 0, 0] },
            3: { halign: 'right', cellWidth: "auto", cellPadding: { top: 1, bottom: 2, left: 3, right: 3 }, textColor: [0, 0, 0] }
          },
          margin: { top: 24 },
        });

        // =============== Summary Table ===============
        y_number = (doc as any).lastAutoTable.finalY;

        y_number += 6;
        doc.setFont('THSarabun', 'bold');
        doc.setFontSize(14);
        doc.text("รวมรายการรับ : ", 43, y_number, { align: 'left' });
        doc.setTextColor(0, 0, 0);
        doc.text("**" + this.toCurrencyFooter(salaryData.total_amount) + "**", (width / 2 - 2), y_number, { align: 'right' });

        doc.setTextColor(0, 0, 0);
        doc.text("รวมรายการหัก : ", (width / 2 + 28), y_number, { align: 'left' });
        doc.setTextColor(0, 0, 0);
        doc.text("**" + this.toCurrencyFooter(salaryData.total_play) + "**", (width - 15), y_number, { align: 'right' });

        // =============== Summary Footer ===============
        doc.setFontSize(16);

        y_number += 16;
        doc.setTextColor(0, 0, 0);
        doc.text("รวมรายการรับ : ", (width / 2 + 5), y_number, { align: 'left' });
        doc.setTextColor(0, 0, 255);
        doc.text("**" + this.toCurrencyFooter(salaryData.total_amount) + "**", (width - 15), y_number, { align: 'right' });

        y_number += 8;
        doc.setTextColor(0, 0, 0);
        doc.text("รวมรายการหัก : ", (width / 2 + 5), y_number, { align: 'left' });
        doc.setTextColor(255, 0, 0);
        doc.text("**" + this.toCurrencyFooter(salaryData.total_play) + "**", (width - 15), y_number, { align: 'right' });

        y_number += 8;
        doc.setTextColor(0, 0, 0);
        doc.text("เงินโอนสุทธิ : ", (width / 2 + 5), y_number, { align: 'left' });
        doc.setTextColor(0, 102, 0);
        doc.text("**" + this.toCurrencyFooter(salaryData.net_amount) + "**", (width - 15), y_number, { align: 'right' });

        resolve(true);
      }
      catch (exception) {
        console.log(exception);
        this._snackBar.open("มีข้อผิดพลาด", "", { duration: 5000 });
        reject(false);
      }
    });
  }

  toCurrency(bath: any) {
    try {
      return (bath == "0.00") ? "" : Number(bath).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    }
    catch (error) {
      return "ERROR";
    }
  }

  toCurrencyFooter(bath: any) {
    try {
      return Number(bath).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    }
    catch (error) {
      return "ERROR";
    }
  }
}