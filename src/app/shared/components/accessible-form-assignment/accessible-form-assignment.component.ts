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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserList } from '@core/interface/user.model';
import { AcsService } from '@core/services/acs.service';
import { AuthService } from '@core/services/auth.service';
import { AssetsService } from '@core/services/rest.service';
import { RoleService } from '@core/services/role.service';
import { QuickChipComponent } from '@shared/components/quick-chip/quick-chip.component';
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

    QuickChipComponent
  ]
})
export class AccessibleFormAssignmentComponent implements OnInit{

  _Id: string = "";
  levelApp:string = '';
  currentDate: string ='';
  _data:any;
  _dataRiderJob:any;
  // _userId:string = "";
  accessibleId: string = "";
  formAccessible!: FormGroup;


  userId = signal<number | null>(null);
  roleId = signal<string | null>(null);
  personOprions = signal<UserList[] | []>([]);

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();



  constructor(
    public assets: AssetsService,
    public dialogRef: MatDialogRef<AccessibleFormAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _acsService: AcsService,
    private _roleService:RoleService,
    private _snackBar: MatSnackBar,
    private _authService : AuthService
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
      this._acsService.getAcsByWId(this._Id).subscribe({
        next:(data) => {
          this._data = data.result[0];
        },
        error:(error) => {
          console.error('Error fetching departments', error);
        }
      });
    }

    const _roleId =  this._authService.getUserRole();
    if(_roleId){
      this.roleId.set(_roleId == 'centeropd' ? 'opd' : 'ipd')
    }

    const _userId = this._authService.getUserId();
    if(_userId){
      this.userId.set(_userId);
    }

    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');

    this.getRiderByRole();

    // this._acsService.getAcsByCenterRiderJobsNew(this.levelApp,this.currentDate).subscribe({
    //   next:(data:any) =>{
    //     this._dataRiderJob = data.result;
    //   },
    //   error:(error:any) => {
    //   console.error('Error fetching data', error);
    //   }
    // });

  }

  async getRiderByRole(){
    this.currentDate = moment().add('years',-543).format('YYYY-MM-DD');
    try {
      const resultRider = await this._acsService.getAcsByCenterRiderJobsNew(this.roleId()!,this.currentDate)
      console.log('resultRider >>> ',resultRider)
      this.personOprions.set(resultRider);

    } catch (error) {
      console.error(error);
      this._snackBar.open('โหลดข้อมูลเจ้าหน้าที่เปลผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
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

  sendJobRider(userId:string){
    try {
      const data: any = {};
      data.wk_perid = String(userId);
      data.admin_wk_perid = this.userId();

      this._acsService.updateAcsByCenterRiderJobs(this._Id,data).subscribe({
        next:(data)=> {
          const result = data.ok;
          if(result === 'ok'){
            this._snackBar.open(`จ่ายงานเรียบร้อย`, '', {
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
            this.dialogRef.close();
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
  }




}
