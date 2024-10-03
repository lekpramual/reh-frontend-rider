import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { EquipsList } from '@core/interface/equips.interface';
import { OpdTypeList } from '@core/interface/opdtype.interface';
import { QuicksList } from '@core/interface/quicks.interface';
import { WardCreate } from '@core/interface/ward.interface';
import { EquipsService } from '@core/services/equips.service';
import { OpdTypeService } from '@core/services/opdtype.service';
import { QuicksService } from '@core/services/quicks.service';
import { WardService } from '@core/services/ward.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, ReplaySubject, Subject, firstValueFrom, map, single, startWith, take, takeUntil } from 'rxjs';


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
  type_io = signal('ipd');
  formAccessible!: FormGroup;

  filteredOptionsDepart!: Observable<WardCreate[]>;
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
    { value: 4, label: '  ' }
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

  optionworks:any[] = [
    { value: 1, label: 'เช้า' },
    { value: 2, label: 'บ่าย' },
    { value: 3, label: 'ดึก' }
  ];

  optionWards:WardCreate[] = [];
  optionQuicks:QuicksList[] = [];
  optionEquips:EquipsList[] = [];
  optionOpdType:OpdTypeList[] = [];


  constructor(
    public dialogRef: MatDialogRef<AccessibleFormCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _wardService: WardService,
    private _quicksService:QuicksService,
    private _equipsService: EquipsService,
    private _opdTypeService: OpdTypeService
  ) {}

  ngOnInit(): void {
    this.accessibleId = this.data?.accessible_id;
    this.initForm();


    this._wardService.getWards().subscribe({
        next:(data) => {
          this.optionWards = data.result;
          // Set up the filtered options logic
          this.filteredOptionsDepart = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterDepart(value))
          );
        },
        error:(error) => {
          console.error('Error fetching departments', error);
        }
      });

    this._quicksService.getQuicks().subscribe({
      next:(data) => {
        this.optionQuicks = data.result;
      },
      error:(error) => {
        console.error('Error fetching departments', error);
      }
    });

    this._equipsService.getEquips().subscribe({
      next:(data) => {
        this.optionEquips = data.result;
      },
      error:(error) => {
        console.error('Error fetching departments', error);
      }
    });

    this._opdTypeService.getOpdType().subscribe({
      next:(data) => {
        this.optionOpdType= data.result;
      },
      error:(error) => {
        console.error('Error fetching departments', error);
      }
    });
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

      console.log(this.formAccessible.valid);
      // Handle form submission
      try {
        console.log(this.formAccessible.value);

        let _opdtype = this.formAccessible.value.opdtype;
        if(_opdtype != null){
          console.log(this.getSelectedOptionLabel())
        }
        // const data: any = {};
        // data.name = this.formAccessible.value.activity_name;
        // data.indicator = this.formAccessible.value.activity_indicator;
        // data.amount = this.formAccessible.value.activity_amount;
        // data.productId = this.accessibleId;
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
      hn: new FormControl(null, [Validators.required]),
      od_rem: new FormControl(null, [Validators.required]),
      opdtype: new FormControl(null),
      quicks: new FormControl(null,[Validators.required]),
      equips: new FormControl(null,[Validators.required]),
      work: new FormControl(null,[Validators.required]),
      wcode_sta: new FormControl(null,[Validators.required]),
      wcode_sto: new FormControl(null,[Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSetTypeIO(type:string) {
    console.log(type);
    this.type_io.set(type)
  }

  onTabClick(event: MatTabChangeEvent) {
    // console.log("Selected Index: ", event.index);
    // console.log("Selected Tab: ", event.tab.textLabel);

    // Handle tab click logic here
    if (event.index === 0) {
      // console.log('First tab clicked');
      this.type_io.set('ipd');

      this.formAccessible.controls["hn"].setValidators([Validators.required]);

      this.formAccessible.controls["od_rem"].setValidators([
        Validators.required,
      ]);

      this.formAccessible.controls["opdtype"].clearValidators();
    } else if (event.index === 1) {
      // console.log('Second tab clicked');
      this.type_io.set('opd');

      this.formAccessible.controls["opdtype"].setValidators([
        Validators.required,
      ]);

      this.formAccessible.controls["hn"].clearValidators();
      this.formAccessible.controls["od_rem"].clearValidators();

    }

    this.formAccessible.controls["hn"].updateValueAndValidity();
    this.formAccessible.controls["od_rem"].updateValueAndValidity();
    this.formAccessible.controls["opdtype"].updateValueAndValidity();
    // You can add more logic for other tabs as needed.
  }



  private _filterDepart(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.optionWards.filter(option => option.ward_name.toLowerCase().includes(filterValue));
  }


  //โหลดข้อมูลรายการยา
  async getAcsByWards() {
    try {

      const response: any = await firstValueFrom(this._wardService.getWards());
      // console.log(response.result);
      this.optionWards = response.result;
      //this.dataSource.data = response.results;

    } catch (error) {

      console.error("Error fetching data:", error);
    } finally {
     console.log('loaddata success..')
    }
  }

  // Method to retrieve the selected option label
  getSelectedOptionLabel(): string | undefined {
    const selectedValue = this.formAccessible.get('opdtype')?.value;
    return this.optionOpdType.find(option => option.opd_type_id === selectedValue)?.opd_type_name;
  }

}
