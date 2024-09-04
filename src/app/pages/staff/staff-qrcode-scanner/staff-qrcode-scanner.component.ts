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
import { ActivatedRoute, Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-qrcode-scanner',
  standalone: true,
  templateUrl: './staff-qrcode-scanner.component.html',
  styleUrl: './staff-qrcode-scanner.component.scss',
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
    ZXingScannerModule
  ],

})

export default class StaffQrcodeScannerComponent implements OnInit{

  jobId:string = '';
  wardId:string = '';
  wardName:string = '';
  qrCodeResult: any = {}; // Variable to store the scanned result
  hasDevices: boolean = false; // Variable to check if devices are available
  hasPermission: boolean = false; // Variable to check if permission is granted


  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit() {
    this.jobId = this.route.snapshot.params["id"];
    this.wardId = this.route.snapshot.params["ward"];
    this.wardName = this.route.snapshot.params["wardname"];
  }

   // Handle the scan success event
   onCodeResult(resultString: any) {
    this.qrCodeResult = JSON.parse(resultString);
    const ward_id = this.qrCodeResult.ward_id;
    const ward_name = this.qrCodeResult.ward_name;

    // Handle check ward params and ward scan qrcode
    if(ward_id === this.wardId){
      // console.log('Scanned Success:', ward_id,this.wardId);
      this._snackBar.open(`ปิดงาน สำเร็จ ${ward_name}`, '', {
        duration:2500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['success-snackbar']
      });
      this.router.navigate(['staff']);
    }else{
      // console.log('Scanned Fuile:', ward_id,this.wardId);
      this._snackBar.open('ผิดพลาด กรุณาตรวจสอบจุดสแกน', 'ลองอีกครั้ง', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }

  }

  // Handle the permission response
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  // Handle available devices
  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.hasDevices = devices && devices.length > 0;
  }

}
