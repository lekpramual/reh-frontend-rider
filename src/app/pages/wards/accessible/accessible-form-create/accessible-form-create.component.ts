import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { EquipsList } from '@core/interface/equips.interface';
import { OpdTypeList } from '@core/interface/opdtype.interface';
import { QuicksList } from '@core/interface/quicks.interface';
import { WardCreate } from '@core/interface/ward.interface';
import { WorkList } from '@core/interface/work.interface';
import { AcsService } from '@core/services/acs.service';
import { EquipsService } from '@core/services/equips.service';
import { OpdTypeService } from '@core/services/opdtype.service';
import { QuicksService } from '@core/services/quicks.service';
import { RoleService } from '@core/services/role.service';
import { WardService } from '@core/services/ward.service';
import { WorkService } from '@core/services/work.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable, ReplaySubject, Subject, firstValueFrom, lastValueFrom, map, single, startWith, take, takeUntil } from 'rxjs';


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

  @Output() messageChange = new EventEmitter<string>();

  wardId:number =  0;
  userId:number = 0;
  accessibleId: string = "";
  type_io = signal('ipd');
  formAccessible!: FormGroup;

  filteredOptionsDepart!: Observable<WardCreate[]>;
  searchControl: FormControl = new FormControl();


  optionWards:WardCreate[] = [];
  optionQuicks:QuicksList[] = [];
  optionEquips:EquipsList[] = [];
  optionOpdType:OpdTypeList[] = [];
  optionWork:WorkList[] = [];


  constructor(
    public dialogRef: MatDialogRef<AccessibleFormCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _wardService: WardService,
    private _quicksService:QuicksService,
    private _equipsService: EquipsService,
    private _opdTypeService: OpdTypeService,
    private _roleService: RoleService,
    private _acsService: AcsService,
    private _workService: WorkService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.accessibleId = this.data?.accessible_id;

    const _wardId =  this._roleService.ward();
    if(_wardId){
      this.wardId = _wardId;
    }
    const _userId =  this._roleService.userId();
    if(_userId){
      this.userId = _userId;
    }

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

    this._workService.getWorks().subscribe({
      next:(data) => {
        this.optionWork= data.result;
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
        const data: any = {};

        if(this.type_io() == 'opd'){
          data.type_oi = this.type_io()
          data.hn = this.formAccessible.value.opdtype;
          data.od_rem = this.getSelectedOptionLabel();
          data.equip = this.formAccessible.value.equips;
          data.quick = this.formAccessible.value.quicks;
          data.time_work = this.formAccessible.value.work;
          data.wcode_sta = this.formAccessible.value.wcode_sta;
          data.wcode_sto = this.formAccessible.value.wcode_sto;
          data.wcode_sto = this.formAccessible.value.wcode_sto;
          data.user_ward = this.wardId;
          data.user_save = this.userId;
          // console.log('data ', data)

        }else{
          data.type_oi = this.type_io()
          data.hn = this.formAccessible.value.hn;
          data.od_rem = this.formAccessible.value.od_rem;
          data.equip = this.formAccessible.value.equips;
          data.quick = this.formAccessible.value.quicks;
          data.time_work = this.formAccessible.value.work;
          data.wcode_sta = this.formAccessible.value.wcode_sta;
          data.wcode_sto = this.formAccessible.value.wcode_sto;
          data.wcode_sto = this.formAccessible.value.wcode_sto;
          data.user_ward = this.wardId;
          data.user_save = this.userId;
          // console.log('data ', data)
        }

        this._acsService.addAcsByWard(data).subscribe({
          next:(data)=> {
            const result = data.ok;
            if(result === 'ok'){
              this._snackBar.open(`บันทึกข้อมูลเรียบร้อย`, '', {
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
      } catch (error: any) {
        // Handle error during form submission
        console.error(error);
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

    // this.formAccessible.get('od_rem')?.disable();
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


   // Prevent the modal from closing when Enter key is pressed
   onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      console.log('Enter key pressed');
      event.preventDefault(); // Prevent form submission and modal closing on Enter
      // Handle your Enter key logic here
      const hn = this.formAccessible.value.hn;
      if(hn != ''){
        console.log('>>>',hn);
        this._acsService.getPatientByHn(hn).subscribe({
          next:(data) => {
            const _data = data.results;
            if(_data.length > 0){
              console.log(data.results);
              const _hn = data.results[0].hn;
              const _full_name = data.results[0].full_name;

              this.formAccessible.controls["hn"].setValue(_hn);
              this.formAccessible.controls["od_rem"].setValue(_full_name);

              console.log(_hn,_full_name);
            }

            this.formAccessible.controls["hn"].updateValueAndValidity();
            this.formAccessible.controls["od_rem"].updateValueAndValidity();

          },
          error:(error) => {
            console.error('Error fetching departments', error);
          }
        });
      }
    }
  }

}
