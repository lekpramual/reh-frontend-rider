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
import { WardCreate, WardList, WardListNew } from '../../../../../core/interface/ward.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WardService } from '@core/services/ward.service';


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

  formDataSignal:WritableSignal<WardCreate> = signal({
    mode:'',
    ward_id: '',
    ward_name: '',
    ward_status: ''
  })

  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }

  @Input() set formdata(val:any){

    this.formDataSignal.update(ward => ({
      ...ward,
      mode: val.mode,
      ward_id: val.ward_id,
      ward_name: val.ward_name,
      ward_status:val.ward_status
    }));
    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();

  status = [
    { id: 'active', name: 'เปิดใช้งาน' },
    { id: 'inactive', name: 'ปิดใช้งาน' },
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


  constructor(private _snackBar: MatSnackBar,private _wardService: WardService) {

  }

  ngOnInit(): void {
    // this.accessibleId = '';

  }

  async onSubmit() {

    if (this.formGroupData.valid) {
      // Handle form submission
      try {

          console.log('from value ', this.formGroupData.value);
          const data: any = {};
          data.ward_name = this.formGroupData.value.ward_name;
          data.ward_status = this.formGroupData.value.ward_status;
          if(this.formDataSignal().mode == 'create'){
            await this._wardService.createWard(data);
          }else{
            await this._wardService.updateWard(this.formDataSignal().ward_id,data);
          }
          this._snackBar.open(`บันทึกข้อมูล เรียบร้อย`, '', {
            duration:1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['success-snackbar']
          }).afterDismissed().subscribe(() => {
            this.onMessageChange('reload');
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
    console.log('Loadding ...',this.formDataSignal());
    // choice_depart choice_stamp

    let statusId = this.formDataSignal()?.ward_status != '' ? this.formDataSignal()?.ward_status :'active';
    this.formGroupData = new FormGroup({
      ward_id: new FormControl(this.formDataSignal()?.ward_id, [Validators.required]),
      ward_name: new FormControl(this.formDataSignal()?.ward_name, [Validators.required]),
      ward_status: new FormControl(statusId,[Validators.required]),
    });

    // กรณีเป็นการบันทึกข้อมูลใหม่
    if(this.formDataSignal().mode == 'create'){
      this.formGroupData.controls["ward_id"].clearValidators();
    }

    this.formGroupData.controls["ward_id"].updateValueAndValidity();

  }

  onNoClick(): void {

  }

}
