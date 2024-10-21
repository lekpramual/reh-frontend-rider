import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AcsService } from '@core/services/acs.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';
import moment from 'moment';
import 'moment/locale/th';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accessible-form-cancel',
  standalone: true,
  templateUrl: './accessible-form-cancel.component.html',
  styleUrl: './accessible-form-cancel.component.scss',
  imports:[
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
    NgxMatSelectSearchModule,
    MatRadioModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,


  ]
})
export class AccessibleFormCancelComponent implements OnInit{

  _Id: string = "";
  _data:any;
  formAccessible!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AccessibleFormCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _acsService: AcsService,
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
    this._Id = this.data?.Id;
    this.initForm();

    if(this._Id){
      this._acsService.getAcsByWId(parseInt(this._Id)).subscribe({
        next:(data) => {
          this._data = data.result[0];
        },
        error:(error) => {
          console.error('Error fetching departments', error);
        }
      });
    }
  }

  async onSubmit() {
    if (this.formAccessible.valid) {
      // Handle form submission
      try {

        const comment = this.formAccessible.value.comment;
        const Id = parseInt(this._Id);
        this._acsService.cancelAcsByWId(Id,comment).subscribe({
          next:(data)=> {
            const result = data.ok;
            if(result === 'ok'){
              this._snackBar.open(`ยกเลิกเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                // this.messageChange.emit('reset');
                this.dialogRef.close("ok");
              });
            }
          },
          error:(error) => {
            console.error('Error fetching departments', error);
            this._snackBar.open('บันทึกข้อมูลผิดพลาด', '', {
              duration:3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass:['error-snackbar']
            }).afterDismissed().subscribe(() => {
              // this.onMessageChange('close');
              // this.initForm();
            });
          }
        });

        this.dialogRef.close("ok");
      } catch (error: any) {
        // Handle error during form submission
        console.error(error);

      }
    } else {
      // Handle form validation errors
      console.log("form validation error..");
    }
  }

  initForm() {
    // choice_depart choice_stamp
    this.formAccessible = new FormGroup({
      comment: new FormControl(null, [Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }



}
