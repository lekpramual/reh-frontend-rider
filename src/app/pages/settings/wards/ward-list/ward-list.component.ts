import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
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
import { WardList } from '../../../../core/interface/ward.interface';
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


const wards: WardList[] = [
  {
    ward_id: '01',
    ward_name: 'อายุรกรรม 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '02',
    ward_name: 'อายุรกรรมชาย 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '03',
    ward_name: 'อายุรกรรมชาย 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '04',
    ward_name: 'จิตเวช',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '05',
    ward_name: 'MICU1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '06',
    ward_name: 'ศัลยกรรม 1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '07',
    ward_name: 'ศัลยกรรม 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '08',
    ward_name: 'ศัลยกรรม 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '09',
    ward_name: 'ศัลยกรรม 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '100',
    ward_name: 'cohort 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '101',
    ward_name: 'cohort 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '102',
    ward_name: 'MICU 5',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '103',
    ward_name: 'MICU 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '104',
    ward_name: 'สวนหัวใจ ( Cath Lab )',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '105',
    ward_name: 'ห้องตรวจศูนย์กรุณาพีร์คำทอน',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '106',
    ward_name: 'รังสีร่วมรักษา',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '14',
    ward_name: 'ศัลยกรรมกระดูกชาย',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '15',
    ward_name: 'ศัลยกรรมกระดูกหญิง',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '16',
    ward_name: 'I.C.U. ศัลยกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '17',
    ward_name: 'เด็ก 1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '18',
    ward_name: 'เด็ก 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '19',
    ward_name: 'เด็ก 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '20',
    ward_name: 'ทารกแรกเกิด',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '21',
    ward_name: 'NICU',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '22',
    ward_name: 'ห้องคลอด',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '23',
    ward_name: 'สูติกรรม 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '24',
    ward_name: 'นรีเวชกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '25',
    ward_name: 'หู คอ จมูก',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '26',
    ward_name: 'OPD ENT',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '27',
    ward_name: 'มหาวีโร 1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '28',
    ward_name: 'มหาวีโร 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '29',
    ward_name: 'พิเศษอายุรกรรม 6',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '30',
    ward_name: 'สงฆ์อาพาธ',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '31',
    ward_name: 'เบญจสิริ 1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '32',
    ward_name: 'เบญจสิริ 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '33',
    ward_name: 'เบญจสิริ 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '34',
    ward_name: 'เบญจสิริ 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '35',
    ward_name: 'อายุรกรรมหญิง 2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '36',
    ward_name: 'MICU2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '37',
    ward_name: 'ICU-Neuro',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '39',
    ward_name: 'อายุรกรรมชาย2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '40',
    ward_name: 'วิกฤตหัวใจ และหลอดเลือด (CCU)1',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '41',
    ward_name: 'สังเกตอาการ (Observe)',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '42',
    ward_name: 'MICU3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '43',
    ward_name: 'พิเศษอายุรกรรม 5',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '44',
    ward_name: 'เบญจสิริ 5',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '45',
    ward_name: 'ศัลยกรรม 5',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '46',
    ward_name: 'ศัลยกรรม 6',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '47',
    ward_name: 'ศัลยกรรม 7',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '48',
    ward_name: 'ไตเทียม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '49',
    ward_name: 'CT สีมา',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '50',
    ward_name: 'CT อาคารมะเร็ง',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '51',
    ward_name: 'PICU',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '53',
    ward_name: 'Acute care',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '54',
    ward_name: 'แม่ปลั่ง',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '55',
    ward_name: 'หอผู้ป่วยมะเร็งชั้น 6',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '56',
    ward_name: 'หอผู้ป่วยพิเศษมะเร็งชั้น 7',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '57',
    ward_name: 'หอผู้ป่วยพิเศษมะเร็งชั้น 8',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '58',
    ward_name: 'ส่งผู้ป่วยกลับบ้าน',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '59',
    ward_name: 'x-ray',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '60',
    ward_name: 'Ultrasound',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '61',
    ward_name: 'ส่งตรวจ OPD',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '62',
    ward_name: 'ส่ง Echocardiogram',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '63',
    ward_name: 'ICU Trauma',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '64',
    ward_name: 'อายุรกรรมหญิง 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '65',
    ward_name: 'IPD หัวใจ',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '66',
    ward_name: 'OPD ศัลยกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '67',
    ward_name: 'OPD กุมารเชกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '68',
    ward_name: 'OPD ศัลยกรรมกระดูก',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '69',
    ward_name: 'ห้องเฝือก',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '70',
    ward_name: 'OPD ตา',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '71',
    ward_name: 'OPD สูติกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '72',
    ward_name: 'OPD นรีเวช',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '73',
    ward_name: 'ทันตกรรม',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '74',
    ward_name: 'OPD มะเร็ง',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '75',
    ward_name: 'ANC',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '76',
    ward_name: 'ตา',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '77',
    ward_name: 'พิเศษสงฆ์ 3',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '78',
    ward_name: 'พิเศษสงฆ์ 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '79',
    ward_name: 'พิเศษสงฆ์ 5',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '80',
    ward_name: 'พิเศษสงฆ์ 6',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '81',
    ward_name: 'หอผู้ป่วยระยะกลาง (IMC)',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '82',
    ward_name: 'Day care Chemo(เคมีบำบัด)',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '83',
    ward_name: 'เบญจสิริ1(PUI)',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '84',
    ward_name: 'OR',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '85',
    ward_name: 'Hematology Unit',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '86',
    ward_name: 'วิกฤตหัวใจ และหลอดเลือด (CCU)2',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '87',
    ward_name: 'กายภาพบำบัด',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '88',
    ward_name: 'กายอุปกรณ์',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '89',
    ward_name: 'เวชกรรมฟื้นฟู',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '90',
    ward_name: 'ส่องกล้อง',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '91',
    ward_name: 'เวชศาสตร์นิวเคลียร์',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '92',
    ward_name: 'รังสีรักษา',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '93',
    ward_name: 'ICU CVT',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '94',
    ward_name: 'pain Clinic',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '95',
    ward_name: 'Stroke unit',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '96',
    ward_name: 'OR เล็ก',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '97',
    ward_name: 'ห้องตรวจ นิติเวช (AE)',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '98',
    ward_name: 'พิเศษอายุรกรรม 4',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
  {
    ward_id: '99',
    ward_name: 'กินรี',
    ward_status_id: '01',
    ward_status_name: 'ใช้งาน',
    ward_date: '27 ส.ค. 2567',
  },
];

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
  ],
})
export default class WardListComponent implements  AfterViewInit{
  sideCreate = signal(false);

  searchValue = "";
  searchTerm = new Subject<string>();

  @Input() set sideopen(val: boolean) {
    this.sideCreate.set(val);
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();

  @Output() formChange = new EventEmitter<[]>();

  // Method to handle changes and emit the new value
  onMessageChange() {
    // console.log(newMessage)
    this.messageChange.emit('open');
    //  this.sideCreate.set(true)
  }
  displayedColumns: string[] = [
    'ward_id',
    'ward_name',
    'ward_status_name',
    'ward_date',
    'actions',
  ];


  // dataSource = wardList;
  dataSource!: MatTableDataSource<WardList>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(public assets: AssetsService,private http: HttpClient) {
    this.dataSource = new MatTableDataSource(wards);

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.searchTerm.next((event.target as HTMLInputElement).value);
  }


  clickedJob(row: any) {
    console.log('Clicked Job', row);
    this.onMessageChange();
    this.formChange.emit(row);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openSide() {
    this.sideCreate.set(true);
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
}
