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
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
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

  formDataSignal:WritableSignal<Employee> = signal({
    emp_id: 0,
    emp_code: '',
    emp_name: '',
    emp_tel: '',
    emp_role_id:''
  })



  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }
  @Input() set formdata(val:any){
    console.log(val);

    this.formDataSignal.update(emp => ({
      ...emp,
      emp_id: val.emp_id,
      emp_code: val.emp_code,
      emp_name:val.emp_name,
      emp_tel:val.emp_tel,
      emp_role_id:val.emp_role_id
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


  departments = [
    { id: 1, name: 'วอร์ด' },
    { id: 2, name: 'เจ้าหน้าที่ IPD' },
    { id: 3, name: 'เจ้าหน้าที่ OPD' },
    { id: 4, name: 'ศูนย์ OPD' },
    { id: 5, name: 'ศูนย์ IPD' },
  ];

  options: any[] = [
    {name: 'หน่วยงาน 1', id: 1},
    {name: 'หน่วยงาน 2', id: 2},
    {name: 'หน่วยงาน 3', id: 3},
    {name: 'หน่วยงาน 4', id: 4},
    {name: 'หน่วยงาน 5', id: 5}

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


  constructor() {}

  ngOnInit(): void {
    // this.accessibleId = '';
    // this.initForm();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        const data: any = {};
        data.name = this.formGroupData.value.emp_name;
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
    console.log('Loadding ...',this.formDataSignal()?.emp_name)
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      emp_title: new FormControl(this.formDataSignal()?.emp_name, [Validators.required]),
      emp_firstname: new FormControl(this.formDataSignal()?.emp_name, [Validators.required]),
      emp_surname: new FormControl(this.formDataSignal()?.emp_name, [Validators.required]),
      emp_name: new FormControl(this.formDataSignal()?.emp_name, [Validators.required]),
      emp_tel: new FormControl(this.formDataSignal()?.emp_tel,[]),
      emp_depart: new FormControl(null,[Validators.required]),
      emp_position: new FormControl(''),
      emp_role_id: new FormControl(this.formDataSignal()?.emp_role_id,[Validators.required]),
      emp_status: new FormControl(false,[Validators.required]),
      emp_user: new FormControl('',[Validators.required]),
      emp_pass: new FormControl('',[Validators.required]),
    });
  }

  onNoClick(): void {

  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }




}
