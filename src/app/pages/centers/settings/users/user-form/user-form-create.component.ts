import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, WritableSignal, input, signal } from '@angular/core';
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
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createUser } from '@core/interface/user.interface';
import { UserService } from '@core/services/user.service';
import { WardService } from '@core/services/ward.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';

interface Employee {
  emp_id: number;
  emp_code: string;
  emp_name: string;
  emp_tel: string;
  emp_role_id: '';
}

@Component({
  selector: 'app-user-form-create',
  standalone: true,
  templateUrl: './user-form-create.component.html',
  styleUrl: './user-form-create.component.scss',
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
export class UserFormComponent implements OnInit{

  sideCreate = signal(false);
  typeType = input.required<any>();


  formDataSignal:WritableSignal<createUser> = signal({
    mode:'create',
    id:"",
    code:"",
    title: "",
    firstname: "",
    surname: "",
    tel: "",
    username: "",
    password: "",
    level_id: "",
  });



  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }

  @Input() set formdata(val:any){
    console.log(val);

    this.formDataSignal.update(result => ({
      ...result,
      id:val.id,
      code:val.code,
      mode: val.mode,
      title: val.title,
      firstname: val.firstname,
      surname: val.surname,
      tel: val.tel,
      username: val.username,
      password: val.password,
      level_id: val.level_id
    }));


    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();



  // Method to handle changes and emit the new value
  onMessageChange(newMessage: string) {
    this.messageChange.emit(newMessage);
    this.formGroupData.reset();
  }

  accessibleId: string = "";
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  constructor(private _snackBar: MatSnackBar,private _userService: UserService) {}

  ngOnInit(): void {}

  async onSubmit() {
    console.log(this.formGroupData.valid);
    console.log(this.formGroupData.value);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        console.log('from value ', this.formGroupData.value);
          const data: any = {};

          data.title = this.formGroupData.value.title;
          data.firstname = this.formGroupData.value.firstname;
          data.surname = this.formGroupData.value.surname;
          data.tel = this.formGroupData.value.tel;
          data.username = this.formGroupData.value.username;
          data.password = this.formGroupData.value.password;
          data.level_id = this.formGroupData.value.level_id;

          if(this.formDataSignal().mode == 'create'){
            await this._userService.createUser(data);
          }else{
            await this._userService.updateUser(this.formDataSignal().id,data);
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
      }
    } else {
      // Handle form validation errors
      console.log("form validation error..");
    }
  }

  initForm() {
    console.log('Loadding ...',this.formDataSignal())
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      title: new FormControl(this.formDataSignal()?.title, [Validators.required]),
      firstname: new FormControl(this.formDataSignal()?.firstname, [Validators.required]),
      surname: new FormControl(this.formDataSignal()?.surname, [Validators.required]),
      tel: new FormControl(this.formDataSignal()?.tel,[]),
      level_id: new FormControl(this.formDataSignal()?.level_id,[Validators.required]),
      username: new FormControl(this.formDataSignal()?.username,[Validators.required]),
      password: new FormControl('',[Validators.required]),
    });

    // กรณีเป็นการบันทึกข้อมูลใหม่
    if(this.formDataSignal().mode == "update"){
      this.formGroupData.controls["password"].clearValidators();
    }

    this.formGroupData.controls["password"].updateValueAndValidity();

  }

  onNoClick(): void {

  }



}
