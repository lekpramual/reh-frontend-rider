import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, ReplaySubject, Subject, map, startWith, take, takeUntil } from 'rxjs';

export interface Bank {
  id: string;
  name: string;
}

/** list of banks */
export const BANKS: Bank[] = [
  {name: 'Bank A (Switzerland)', id: 'A'},
  {name: 'Bank B (Switzerland)', id: 'B'},
  {name: 'Bank C (France)', id: 'C'},
  {name: 'Bank D (France)', id: 'D'},
  {name: 'Bank E (France)', id: 'E'},
  {name: 'Bank F (Italy)', id: 'F'},
  {name: 'Bank G (Italy)', id: 'G'},
  {name: 'Bank H (Italy)', id: 'H'},
  {name: 'Bank I (Italy)', id: 'I'},
  {name: 'Bank J (Italy)', id: 'J'},
  {name: 'Bank Kolombia (United States of America)', id: 'K'},
  {name: 'Bank L (Germany)', id: 'L'},
  {name: 'Bank M (Germany)', id: 'M'},
  {name: 'Bank N (Germany)', id: 'N'},
  {name: 'Bank O (Germany)', id: 'O'},
  {name: 'Bank P (Germany)', id: 'P'},
  {name: 'Bank Q (Germany)', id: 'Q'},
  {name: 'Bank R (Germany)', id: 'R'}
];

@Component({
  selector: 'app-accessible-form-create',
  standalone: true,
  templateUrl: './accessible-form-create.component.html',
  styleUrl: './accessible-form-create.component.scss',
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
    NgxMatSelectSearchModule,
    MatRadioModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
    MatTabsModule
  ]
})
export class AccessibleFormCreateComponent implements OnInit,AfterViewInit, OnDestroy {


  accessibleId: string = "";
  formAccessible!: FormGroup;

  // filteredOptions!: Observable<any[]>;

  filteredOptions!: Observable<Bank[]>;
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

  opds:any[] = [
    { value: 1, label: 'กู้ชีพ' },
    { value: 2, label: 'มาเอง' },
    { value: 3, label: 'รถรีเฟอร์' },
    { value: 4, label: 'ญาติ หรือ พลเมืองดี' }
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
    public dialogRef: MatDialogRef<AccessibleFormCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.accessibleId = this.data?.accessible_id;
    this.initForm();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  ngOnDestroy() {
    // this._onDestroy.next();
    // this._onDestroy.complete();
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
      opd_status: new FormControl(null,[Validators.required]),
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

}
