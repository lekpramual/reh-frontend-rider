import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
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
import { GetWardListResponse, WardCreate, WardList, WardListNew } from '../../../../../core/interface/ward.interface';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import moment from 'moment';
import 'moment/locale/th'; // Import Thai locale
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssetsService } from '@core/services/rest.service';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { Subject } from 'rxjs';
import { WardService } from '@core/services/ward.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { LoadingService } from '@core/components/loading/loading.service';

export interface qrType  {
  ward_id:string,ward_name:string,ward_dt:string
}
var doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});
var base64Img = '';
var qrData = '';

// Set locale globally
moment.locale('th');




@Component({
  selector: 'app-ward-list',
  standalone: true,
  templateUrl: './ward-list.component.html',
  styleUrl: './ward-list.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    CommonModule,

    LoadingIndicatorComponent
  ],
})
export default class WardListComponent implements  OnInit, AfterViewInit{
  sideCreate = signal(false);

  searchValue = "";
  searchTerm = new Subject<string>();


  wardLists = signal<WardListNew[]>([]);

  formData:WritableSignal<WardCreate> = signal({
    mode:'create',
    ward_id: '',
    ward_name: '',
    ward_status: ''
  });

  @Input() set sideopen(val: boolean) {
    this.sideCreate.set(val);
  }

  @Input() set wardData(val:WardListNew[]){
   this.wardLists.set(val);

    this.dataSource.data = this.wardLists();
    this.dataSource.paginator = this.paginator;
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();

  @Output() formChange = new EventEmitter<WardCreate>();

  displayedColumns: string[] = [
    'ward_id',
    'ward_name',
    'ward_status',
    'ward_created_at',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    public assets: AssetsService,
    private http: HttpClient,
    private _wardService: WardService,
    private _snackBar: MatSnackBar,
    public _loadingService: LoadingService
  ) {

    this.setHeaderImage();

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

  }
  ngAfterViewInit() {
    // this.getWards();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.searchTerm.next((event.target as HTMLInputElement).value);
  }


  // เพิ่มข้อมูล
  onMessageChange() {
    // console.log(newMessage)
    this.messageChange.emit('open');

    this.formData.update(ward => ({
      ...ward,
      mode:'create',
      ward_id: '',
      ward_name: '',
      ward_status:''
    }));

    this.formChange.emit(this.formData());
  }

  // แก้ไขข้อมูล
  clickedJob(row: any) {
    console.log('Clicked Job', row);
    this.onMessageChange();

    this.formData.update(ward => ({
      ...ward,
      mode:'update',
      ward_id: row.ward_id,
      ward_name: row.ward_name,
      ward_status:row.ward_status
    }));

    this.formChange.emit(this.formData());
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openSide() {
    this.sideCreate.set(true);
  }

  async getWards(){
    try {
      const wards = await this._wardService.getWardLists();
      this.dataSource.data = wards;
      this.dataSource.paginator = this.paginator;

    } catch (error) {
      console.error(error);
      this._snackBar.open('โหลดข้อมูลหน่วยงานผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }
  }


  generateQRCode(ward_id:string,ward_name:string) {
    const qrDataText:qrType = {
      ward_id:ward_id,
      ward_name:ward_name,
      ward_dt:moment().format('YYYY-DD-MM HH:mm:ss')
    };


    // Convert object to JSON string
    const jsonString = JSON.stringify(qrDataText);
    // console.log(jsonString);
    QRCode.toDataURL(jsonString, { width: 96 }, (err, url) => {
      if (err) {
        console.error('QR Code generation error:', err);
        return;
      }
      qrData =  url;
    });
  }

  setHeaderImage() {
    // รูปภาพ Logo
    if (base64Img == "") {
      this.http.get(this.assets.assets() + '/images/logo-moph-reh.png', { responseType: 'blob' })
        .subscribe((res:any) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            var base64data = reader.result;
            base64Img = base64data as string;
          }
          reader.readAsDataURL(res);
        });
    }
  }

  showPDF = async (element:any) => {

    try {
      // console.log(element);
      let ward_id = element.ward_id;
      let ward_name = element.ward_name;
      // let year = dayMoment.add(543, 'year').format("YYYY");
      // let month = dayMoment.format("MMMM");


      // let date_strr = month + " พ.ศ. " + year;
      let title =
        `QRCODE จุดสแกน ${ward_name}`;

      this.initialPDF(title);


      let result = await this.generatePDF(ward_id, ward_name);
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
    ward_id: string,
    ward_name: string
  ) => {

    return new Promise(async (resolve, reject) => {
      try {
        // =============== Image ===============
        // doc.addImage(base64Img, 'PNG', 15, 6, 25, 25, "Logo", 'MEDIUM');
        this.generateQRCode(ward_id,ward_name);

        // =============== Header ===============
        let width = doc.internal.pageSize.getWidth();

        let y_number = 10;
        doc.setFontSize(10);
        doc.setFont('THSarabun', 'normal');
        doc.text("QR-REH-" + ward_id, width - 15, y_number, { align: 'right' });

        const imgHeight = 48;
        y_number += 10;
        doc.addImage(base64Img, 'PNG', (width - imgHeight) / 2, y_number, 48, 48);

        y_number += 6 + imgHeight;
        doc.setFontSize(28);
        doc.setFont('THSarabun', 'bold');
        doc.text(
          ward_name + ' โรงพยาบาลร้อยเอ็ด',
          width / 2,
          y_number,
          { align: 'center' }
        );

        y_number += 6;
        doc.setFontSize(16);
        doc.setFont('THSarabun', 'normal');
        doc.text('สำหรับเจ้าหน้าที่เปล : จุดสแกนระบบขอใช้เปลออนไลน์', width / 2, y_number, {
          align: 'center',
        });

        y_number += 2;
        const qrHeight = 96;
        doc.addImage(qrData, 'JPEG', (width - qrHeight) / 2, y_number, 96, 96);


        // Add the footer
        doc.setFontSize(14);
        doc.setFont('THSarabun', 'normal');
        doc.text(`วันที่ปริ้น ${moment().format('LL')}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
          align: 'center'
        });
        // this.addFooter(doc);
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

   // ฟังก์ชัน: ล้างค่าข้อมูลค้นหา
   clearSearch() {
    this.searchValue = "";
    this.searchTerm.next("");

    this.dataSource.filter = '';

  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("l"); // Customize the format as needed
  }
}
