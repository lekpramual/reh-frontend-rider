import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';
import {
  EmpFormSearch,
  WardFormSearch,
} from '../../../../core/interface/reports.interface';
import {
  MatDatepickerInputEvent,
  MatDatepickerIntl,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatMomentDateModule,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../core/custom-date-format';

import moment from 'moment';
import 'moment/locale/th'; // Import Thai locale

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssetsService } from '@core/services/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipsList } from '@core/interface/equips.interface';
import { QuicksService } from '@core/services/quicks.service';
import { QuicksList } from '@core/interface/quicks.interface';
import { WardList, WardListNew } from '@core/interface/ward.interface';
import { WardService } from '@core/services/ward.service';
import { ReportService } from '@core/services/report.service';

var doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

// Set locale globally
moment.locale('th');

@Component({
  selector: 'app-report-ward-form-search',
  standalone: true,
  templateUrl: './report-ward-form-search.component.html',
  styleUrl: './report-ward-form-search.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxMatSelectSearchModule,
  ],
  // providers: [provideNativeDateAdapter(),{ provide: MAT_DATE_LOCALE, useValue: "th-TH" },provideMomentDateAdapter(MY_DATE_FORMATS)],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'th' }, // Set the locale to Thai
  ],
})
export class ReportWardFormSearchComponent implements OnInit {

  typeType = input.required<any>();

  formDataSignal: WritableSignal<WardFormSearch> = signal({
    ward_start: '',
    ward_end: '',
    ward_depart: '',
    ward_quick: '',
  });

  wardOptions = signal<WardListNew[]>([]);
  quickOptions = signal<QuicksList[]>([]);

  dataArray = signal<any>([]);
  wardLabel = signal<string>('');


  accessibleId: string = '';
  currentDate = new Date();
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  filteredOptionquicks!: Observable<any[]>;
  searchControl: FormControl = new FormControl();
  searchQuickControl: FormControl = new FormControl();

  // date max min
  maxDate!: Date;
  minDate!: Date;

  constructor(
    public assets: AssetsService,
    private _snackBar: MatSnackBar,
    private _quicksService : QuicksService,
    private _wardService : WardService,
    private _reportService:ReportService
  ) {
    // moment.locale('th');

    // Override the Thai locale to display Buddhist Era year (Thai year)
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
    // Set the max and min date based on the current year
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31); // December 31 of next year
    this.minDate = new Date(currentYear - 1, 0, 1); // January 1 of the current year
  }

  ngOnInit(): void {
    // this.accessibleId = '';
    this.initForm();

    this.loadWards();
  }



  async loadWards(){
    try {
      const results = await this._wardService.getWardsNew();
      // console.log('results >>>',results);
      this.wardOptions.set(results);

      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } catch (error) {
      this._snackBar.open('โหลดข้อมูรับงานผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }
  }


  getSelectedLabel(event: any) {
    const selectedOption = this.wardOptions().find(option => option.ward_id === event.value);
    // console.log('selectedOption ',selectedOption)
    this.wardLabel.set(selectedOption ? selectedOption.ward_name : 'all');
  }

  async loadReport(type_oi:string,rxdate:string,eddate:string,ward:string){
    try {
      let pername = ward == 'all' ? 'ทั้งหมด' : this.wardLabel();

      console.log('pername', pername);

      const result$ = await this._reportService.getDateByWard(type_oi,rxdate,eddate,ward);
      console.log('result >>> ',result$);

      // this.dataArray().set(this.convertTo2DArray(result$));
      this.dataArray.set(this.convertTo2DArray(result$));

      // showPDF
      this.showPDF(type_oi, rxdate,eddate,pername);
      console.log(this.dataArray());

    } catch (error) {
      this._snackBar.open('มีข้อผิดพลาดในการโหลดรายงาน', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      console.error(error);
    }
  }

  convertTo2DArray(data: any[]): any[][] {
    return data.map(obj => Object.values(obj));
  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {

      console.log('form data >>>',this.formGroupData.value);
      let rxdate = moment(this.formGroupData.value.ward_start).add('year', (-543)).format("YYYY-MM-DD");
      let eddate = moment(this.formGroupData.value.ward_end).add('year', (-543)).format("YYYY-MM-DD");
      let ward = this.formGroupData.value.ward_depart;

      let type_oi = this.typeType();

      await this.loadReport(type_oi,rxdate,eddate,ward);
      // Handle form submission
      // try {

      //   let ward_start = this.formGroupData.value.ward_start;
      //   let ward_end = this.formGroupData.value.ward_end;
      //   let ward_depart = this.formGroupData.value.ward_depart;
      //   let ward_quick = this.formGroupData.value.ward_quick;


      //   this.showPDF(ward_start, ward_end,ward_depart);

      // } catch (error: any) {
      //   console.error(error);
      //   this._snackBar.open('มีข้อผิดพลาด...', '', {
      //     duration:3000,
      //     horizontalPosition: 'center',
      //     verticalPosition: 'bottom',
      //     panelClass:['error-snackbar']
      //   });
      // }
    }
  }

  showPDF = async (type_oi:string, rxdate: string, eddate: string, ward: string) => {
    try {
      // let dayMoment = moment(ward_start);
      // let year = dayMoment.add(543, 'year').format("YYYY");
      // let month = dayMoment.format("MMMM");

      // let date_strr = month + " พ.ศ. " + year;
      let date_strr =
        'รายงานจำนวนวอร์ดที่ขอใช้เปลแยกประเภท ' +
        moment(rxdate).format('ll') +
        ' - ' +
        moment(eddate).format('ll');

      this.initialPDF(date_strr);

      let result = await this.generatePDF(rxdate, eddate, ward,type_oi);
      if (result) {
        this.outputPDF();
      }
    } catch (exception) {
      console.log('มีข้อผิดพลาด');
      // this._snackBar.open("มีข้อผิดพลาด", "", { duration: 5000 });
    }
  };

  initialPDF(date_strr: string) {
    doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setProperties({
      title: date_strr,
    });

    doc.addFont(
      this.assets.assets() + '/fonts/THSarabunNew/THSarabunNew.ttf',
      'THSarabun',
      'normal'
    );
    doc.addFont(
      this.assets.assets() + '/fonts/THSarabunNew/THSarabunNew Bold.ttf',
      'THSarabun',
      'bold'
    );
    moment.locale('th');
  }

  generatePDF = async (
    rxdate: string,
    eddate: string,
    ward: string,
    type_oi:string
  ) => {

    return new Promise(async (resolve, reject) => {
      try {
        // =============== Image ===============
        // doc.addImage(base64Img, 'PNG', 15, 6, 25, 25, "Logo", 'MEDIUM');

        // =============== Header ===============
        let width = doc.internal.pageSize.getWidth();

        // let y_number = 10;
        // doc.setFontSize(10);
        // doc.setFont('THSarabun', 'normal');
        // doc.text("S-REH-001", width - 15, y_number, { align: 'right' });

        let y_number = 10;
        doc.setFontSize(18);
        doc.setFont('THSarabun', 'bold');
        doc.text(
          'รายงานจำนวนวอร์ดที่ขอใช้เปลแยกประเภท โรงพยาบาลร้อยเอ็ด',
          width / 2,
          y_number,
          { align: 'center' }
        );

        y_number += 6;
        let date_header = '';
        date_header =
          moment(rxdate).format('ll') + ' - ' + moment(eddate).format('ll');
        doc.setFontSize(16);
        doc.setFont('THSarabun', 'normal');
        doc.text('ประจำวันที่ ' + date_header, width / 2, y_number, {
          align: 'center',
        });

        y_number += 10;
        doc.setFontSize(14);
        doc.setFont('THSarabun', 'bold');
        doc.text('ประเภท: '+ type_oi, 14, y_number, {
          align: 'left',
        });


        y_number += 6;
        doc.setFontSize(14);
        doc.setFont('THSarabun', 'bold');
        doc.text('วอร์ด : '+ ward, 14, y_number, {
          align: 'left',
        });

        y_number += 6;
        doc.setFontSize(12);
        doc.setFont('THSarabun', 'normal');
        doc.text('* หมายเหตุ แสดงเฉพาะข้อมูลที่มีการปิดงานเท่านั้น', 14, y_number, {
          align: 'left',
        });

        let dt: any[][] = this.dataArray();
        // =============== Table ===============

        // Insert row numbers
        let data = this.dataArray().map((item:any, index:any) =>  [index + 1, ...item]);

        console.log('data >>>',data);

        // Calculate the total
        const total8_9 = dt.reduce((acc, row) => acc + row[1], 0);
        const total9_10 = dt.reduce((acc, row) => acc + row[2], 0);
        const total10_11 = dt.reduce((acc, row) => acc + row[3], 0);
        const total11_12 = dt.reduce((acc, row) => acc + row[4], 0);
        const total12_13 = dt.reduce((acc, row) => acc + row[5], 0);
        const total13_14 = dt.reduce((acc, row) => acc + row[6], 0);
        const total14_15 = dt.reduce((acc, row) => acc + row[7], 0);
        const total15_16 = dt.reduce((acc, row) => acc + row[8], 0);
        const total16_17 = dt.reduce((acc, row) => acc + row[9], 0);
        const total17_18 = dt.reduce((acc, row) => acc + row[10], 0);
        const total18_19 = dt.reduce((acc, row) => acc + row[11], 0);
        const total19_20 = dt.reduce((acc, row) => acc + row[12], 0);
        const total20_21 = dt.reduce((acc, row) => acc + row[13], 0);
        const total21_22 = dt.reduce((acc, row) => acc + row[14], 0);
        const total22_23 = dt.reduce((acc, row) => acc + row[15], 0);
        const total23_24 = dt.reduce((acc, row) => acc + row[16], 0);
        const total24_8 = dt.reduce((acc, row) => acc + row[17], 0);
        const total_total = dt.reduce((acc, row) => acc + row[18], 0);

        y_number += 3;
        autoTable(doc, {
          startY: y_number,
          head: [
            [
              {content:'#', styles:{halign:'center'}},
              {content:'ชื่อ-สกุล', styles:{halign:'left'}},
              '8-9',
              '9-10',
              '10-11',
              '11-12',
              '12-13',
              '13-14',
              '14-15',
              '15-16',
              '16-17',
              '17-18',
              '18-19',
              '19-20',
              '20-21',
              '21-22',
              '22-23',
              '23-24',
              '24-8',
              'จำนวน',
            ],
          ],
          body: data,
          theme: 'grid',
          styles: {
            font: 'THSarabun',
            fontSize: 10,
            cellPadding: 1,
            textColor: 50,
          },
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontSize: 10,
            halign: 'center',
            cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
          },
          columnStyles: {
            0: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 1, right: 1 },
              textColor: [0, 0, 0],
            },
            1: {
              halign: 'left',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            2: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            3: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            4: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            5: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            6: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            7: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            8: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            9: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            10: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            11: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            12: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            13: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            14: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            15: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            16: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            17: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            18: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
            19: {
              halign: 'center',
              cellWidth: 'auto',
              cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
              textColor: [0, 0, 0],
            },
          },
          foot: [
            [
              {content:'รวมจำนวน',colSpan: 2 , styles:{halign: 'right'}},
              total8_9.toFixed(0),
              total9_10.toFixed(0),
              total10_11.toFixed(0),
              total11_12.toFixed(0),
              total12_13.toFixed(0),
              total13_14.toFixed(0),
              total14_15.toFixed(0),
              total15_16.toFixed(0),
              total16_17.toFixed(0),
              total17_18.toFixed(0),
              total18_19.toFixed(0),
              total19_20.toFixed(0),
              total20_21.toFixed(0),
              total21_22.toFixed(0),
              total22_23.toFixed(0),
              total23_24.toFixed(0),
              total24_8.toFixed(0),
              total_total.toFixed(0),
            ],
          ],
          footStyles:{
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontSize: 10,
            halign: 'center',
            cellPadding: { top: 1, bottom: 2, left: 3, right: 3 },
          },
          didDrawPage: (data) => {
            // Footer content
            const pageCount = doc.getNumberOfPages();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Set footer content and styling
            doc.setFontSize(10);
            doc.text(
              `หน้า ${data.pageNumber} / ${pageCount}`,
              pageWidth / 2,
              pageHeight - 10,
              {
                align: 'center',
              }
            );
          },
          margin: { top: 24 },
        });
        resolve(true);
      } catch (exception) {
        console.log(exception);
        console.log('มีข้อผิดพลาด....');
        // this._snackBar.open("มีข้อผิดพลาด", "", { duration: 5000 });
        reject(false);
      }
    });
  };

  outputPDF() {
    // doc.output('dataurlnewwindow', { filename: "เดือน กรกฎาคม 2567" });
    window.open(doc.output('bloburl'), '_blank');
  }

  initForm() {
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      ward_start: new FormControl(this.currentDate, [Validators.required]),
      ward_end: new FormControl(this.currentDate, [Validators.required]),
      ward_depart: new FormControl('all', [Validators.required])
    });
  }

  onNoClick(): void {}

  // กำหนดวันที่ดึงข้อมูล
  onDateChanged(event: MatDatepickerInputEvent<Date>): void {
    // Handle the date change event here
    // this.selectedDate = newDate;
    // console.log("Selected Date:", event.value);
    // this.formSearch.setValue({
    //   today: event.value,
    //   range: this.formSearch.get("range")?.value,
    // });
    this.formGroupData.patchValue({
      ward_start: event.value,
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.wardOptions().filter((option) =>
      option.ward_name.toLowerCase().includes(filterValue)
    );
  }

}
