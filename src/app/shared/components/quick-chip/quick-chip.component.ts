import { CommonModule } from '@angular/common';
import { Component, Input, input, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-quick-chip',

  templateUrl: './quick-chip.component.html',
  styleUrl: './quick-chip.component.scss',
  standalone:true,
  imports:[
    MatChipsModule,
    CommonModule
  ]
})
export class QuickChipComponent {

  data = signal<any>({});

  @Input() set dataQuick (val:any){
    this.data.set(val);
  }
}
