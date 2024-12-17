import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuickChipComponent } from '../quick-chip/quick-chip.component';
import moment from 'moment';

@Component({
  selector: 'app-accessible-list-details',
  templateUrl: './accessible-list-details.component.html',
  styleUrl: './accessible-list-details.component.scss',
  standalone:true,
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
      MatBadgeModule,
      MatTooltipModule,
      MatChipsModule,
      QuickChipComponent
  ]
})
export class AccessibleListDetailsComponent {



  _data = signal<any>({});

  @Input() set detailData (val: any){
    console.log(val);
    this._data.set(val);
  }

  constructor(){
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

  //ฟังก์ชั่น: ปีภาษาไทย
    formatDateThai(date: Date): string {
      // return moment(date).format("LL"); // Customize the format as needed
      return moment(date).format("l"); // Customize the format as needed
  }
}
