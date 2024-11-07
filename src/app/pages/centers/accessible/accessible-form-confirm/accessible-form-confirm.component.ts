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

  _Id = signal('');
  _data = signal<AcsList[]>([]);
  acsData = signal<AcsList[]>([]);
  formAccessible!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  constructor(
    public dialogRef: MatDialogRef<AccessibleFormConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _acsService: AcsService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    // this._Id = this.data?.Id;
    this._Id.set(this.data?.Id);
    this.initForm();


    this.getWardNew();
  }



  async getWardNew(){
    try {
      const response = await this._acsService.getAcsByWIdNew(this._Id());
      console.log('response >>>',response);
      this.acsData.set(response);
    } catch (error) {

      console.error(error);
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
    this.dialogRef.close('ok');


  }

  async onGetJob(event: Event){
    event.preventDefault();
    // console.log('Button clicked get job.');
    await this.updateJob('get');
  }

  async onConfirmJob(event: Event){
    event.preventDefault();
    // console.log('Button clicked get confirm job .');
    await this.updateJob('confirm');
  }



  async updateJob(mode:string){
    try {
      // console.log('mode',mode)
      // await this.coursesService.deleteCourse(courseId);
      // const courses = this.#courses();
      // const newCourse = courses.filter(course => course.id !== courseId);
      // this.#courses.set(newCourse);
      const data = {
        mode:mode
      }

      const response:any = await this._acsService.updateAcsByCenterGetAndConfirm(this._Id(),data);
      if(response.ok){
        this._snackBar.open(mode == 'get'? `รับงานเรียบร้อย` :`ปิดงานเรียบร้อย`, '', {
          duration:1500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['success-snackbar']
        }).afterDismissed().subscribe(async () => {
          // this.messageChange.emit('reset');
          // this.dialogRef.close("ok");
          this.getWardNew();
        });
      }

    } catch (error) {
      console.error(error);
      alert(`Error update job.`)
    }
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }

  calculateTimeDifferenceInMinutes(date:any,startTime: any, endTime: any): number {
    // console.log(_startTime,_endTime)
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const diffInMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes
    return diffInMinutes;
  }


}
