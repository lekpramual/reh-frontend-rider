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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AcsService } from '@core/services/acs.service';
import { AssetsService } from '@core/services/rest.service';
import moment from 'moment';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-accessible-form-assignment',
  standalone: true,
  templateUrl: './accessible-form-assignment.component.html',
  styleUrl: './accessible-form-assignment.component.scss',
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
export class AccessibleFormAssignmentComponent implements OnInit{

  _Id: string = "";
  _data:any;
  accessibleId: string = "";
  formAccessible!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();



  constructor(
    public assets: AssetsService,
    public dialogRef: MatDialogRef<AccessibleFormAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _acsService: AcsService,
    private _snackBar: MatSnackBar
  ) {}

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
        const data: any = {};
        data.name = this.formAccessible.value.activity_name;
        data.indicator = this.formAccessible.value.activity_indicator;
        data.amount = this.formAccessible.value.activity_amount;
        data.productId = this.accessibleId;
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
      activity_name: new FormControl(null, [Validators.required]),
      activity_indicator: new FormControl(null, [Validators.required]),
      activity_amount: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      type: new FormControl('',[Validators.required]),
      status: new FormControl(null,[Validators.required]),
      select: new FormControl(null,[Validators.required]),
      out: new FormControl(null,[Validators.required]),
      work: new FormControl(null,[Validators.required]),
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
