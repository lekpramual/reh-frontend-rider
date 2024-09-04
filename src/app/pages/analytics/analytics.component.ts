import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-analytics',
  standalone:true,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  imports:[
    MatTabsModule,
    MatIconModule,
  ]
})
export default class AnalyticsComponent {

}
