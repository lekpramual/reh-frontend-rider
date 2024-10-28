import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
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
import { AcsList } from '@core/interface/acs.interface';
import { AcsService } from '@core/services/acs.service';
import moment from 'moment';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-accessible-form-confirm',
  standalone: true,
  templateUrl: './accessible-form-confirm.component.html',
  styleUrl: './accessible-form-confirm.component.scss',
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
export class AccessibleFormConfirmComponent implements OnInit{

  _Id = signal(0);
  _data = signal<AcsList[]>([]);
  formAccessible!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();

  /** list of banks */
  options: any[] = [
    {name: 'กรุงไทย', id: 1},
    {name: 'กรุงศรี', id: 2},
    {name: 'ธนชาติ', id: 3},
    {name: 'กสิกร', id: 4},
    {name: 'กสิกร5', id: 5},
    {name: 'กสิกร6', id: 6},
    {name: 'กสิกร7', id: 7},
    {name: 'กสิกร8', id: 8},
    {name: 'กสิกร9', id: 9},

  ];

  optionworks:any[] = [
    { value: 1, label: 'เช้า' },
    { value: 2, label: 'บ่าย' },
    { value: 3, label: 'ดึก' }
  ];

  optiontypes:any[] = [
    {
      value: "1",
      label: "รถนั่ง",

  },
  {
      value: "2",
      label: "เปลนอน",

  },
  {
      value: "3",
      label: "เปลนอน+ออกซิเจน",

  },
  {
      value: "4",
      label: "เปลนอน+ออกซิเจน+แผ่น slide board",

  },
  {
      value: "5",
      label: "เปลนอน+แผ่น  slide board",

  },
  {
      value: "6",
      label: "ขอคนเปล OPD",
      "equstatus": "1"
  },
  {
      value: "7",
      label: "เฉพาะพนักงานเปล",

  },
  {
      value: "8",
      label: "เปลนอน+ออกซิเจน+tube",

  }
  ];

  constructor(
    public dialogRef: MatDialogRef<AccessibleFormConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _acsService: AcsService
  ) {}

  async ngOnInit() {
    // this._Id = this.data?.Id;
    this._Id.set(this.data?.Id);
    this.initForm();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    await this.getWard();
  }

  async getWard(){
    await this._acsService.getAcsByWId(this._Id()).subscribe({
      next:(data) => {
        const response:AcsList[] = data.result;
        this._data.set(response);
      },
      error:(error) => {
        console.error('Error fetching departments', error);
      }
    });
  }

  async onSubmit() {
    if (this.formAccessible.valid) {
      // Handle form submission
      try {
        const data: any = {};
        data.name = this.formAccessible.value.activity_name;
        data.indicator = this.formAccessible.value.activity_indicator;
        data.amount = this.formAccessible.value.activity_amount;
        data.productId = this._Id();
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

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }

  calculateTimeDifferenceInMinutes(date:any,startTime: any, endTime: any): number {
    const _startTime = moment(startTime).format('HH:mm');
    const _endTime = moment(endTime).format('HH:mm');

    console.log(_startTime,_endTime)
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const diffInMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes
    return diffInMinutes;
  }


}
