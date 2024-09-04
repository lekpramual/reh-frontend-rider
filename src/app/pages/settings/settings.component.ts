import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone:true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports:[RouterOutlet]

})
export default class SettingsComponent {

}
