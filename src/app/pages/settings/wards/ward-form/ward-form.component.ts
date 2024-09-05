import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';
import { WardList } from '../../../../core/interface/ward.interface';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ward-form',
  standalone: true,
  templateUrl: './ward-form.component.html',
  styleUrl: './ward-form.component.scss',
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
    MatSlideToggleModule,
    MatCardModule
  ]
})
export class WardFormComponent implements OnInit{

  sideCreate = signal(false);

  formDataSignal:WritableSignal<WardList> = signal({
    ward_id: '',
    ward_name: '',
    ward_status_id: '',
    ward_status_name: '',
    ward_date:''
  })

  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }

  @Input() set formdata(val:any){
    console.log(val);

    this.formDataSignal.update(ward => ({
      ...ward,
      ward_id: val.ward_id,
      ward_name: val.ward_name,
      ward_status_id:val.ward_status_id,
      ward_status_name:val.ward_status_name,
      ward_date:val.ward_date
    }));

    // this.formData.set({
    //   data: {
    //     emp_id: val.data.emp_id
    //   }
    // })
    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();


  status = [
    { id: '01', name: 'เปิดใช้งาน' },
    { id: '02', name: 'ปิดใช้งาน' },
  ];

  // Method to handle changes and emit the new value
  onMessageChange(newMessage: string) {
    this.messageChange.emit(newMessage);
    this.formGroupData.reset();
  }

  accessibleId: string = "";
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  constructor(private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    // this.accessibleId = '';

  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        const data: any = {};
        data.name = this.formGroupData.value.emp_name;

          this._snackBar.open(`บันทึกข้อมูล เรียบร้อย`, '', {
            duration:1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['success-snackbar']
          }).afterDismissed().subscribe(() => {
            this.onMessageChange('close')
          });
      } catch (error: any) {
        // Handle error during form submission
        console.error(error);
        this._snackBar.open('มีข้อผิดพลาด', 'ลองอีกครั้ง', {
          duration:3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['error-snackbar']
        });
      }
    } else {
      // Handle form validation errors
      console.log("form validation error..");
    }
  }

  initForm() {
    // console.log('Loadding ...',this.formDataSignal())
    // choice_depart choice_stamp
    let statusId = this.formDataSignal()?.ward_status_id != '' ? this.formDataSignal()?.ward_status_id :'01';
    this.formGroupData = new FormGroup({
      ward_id: new FormControl(this.formDataSignal()?.ward_id, [Validators.required]),
      ward_name: new FormControl(this.formDataSignal()?.ward_name, [Validators.required]),
      ward_status: new FormControl(statusId,[Validators.required]),
    });
  }

  onNoClick(): void {

  }

}
