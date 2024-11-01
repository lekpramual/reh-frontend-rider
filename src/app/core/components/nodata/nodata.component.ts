import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nodata',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './nodata.component.html',
  styleUrl: './nodata.component.scss'
})
export class NoDataComponent {

}
