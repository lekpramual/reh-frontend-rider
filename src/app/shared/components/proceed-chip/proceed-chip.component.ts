import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-proceed-chip',
  templateUrl: './proceed-chip.component.html',
  styleUrl: './proceed-chip.component.scss',
  standalone:true,
  imports:[
    MatChipsModule,
    CommonModule
  ]
})
export class ProceedChipComponent {

  data = signal<any>({});

  @Input() set dataProcess (val:any){
    this.data.set(val);
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
