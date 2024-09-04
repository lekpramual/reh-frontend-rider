import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone:true,
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  imports:[RouterOutlet]

})
export default class ContentComponent {

}
