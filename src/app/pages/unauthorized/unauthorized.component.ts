import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone:true,
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
  imports:[
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatButton,
    RouterModule

  ]
})
export default class UnauthorizedComponent {

}
