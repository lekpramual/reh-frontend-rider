import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

import { firstValueFrom } from "rxjs";

import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  standalone:true,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
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
    MatSlideToggleModule,
    MatCardModule,
    RouterModule
  ]
})
export class LoginComponent implements OnInit {

  hide = true;
  error: string | null = null;

  formInitial!: FormGroup;

  constructor(

    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit() {
    if (this.formInitial.valid) {
      // Handle form submission
      try {
        // Handle successful form submission

        this._snackBar.open(`ยินดีต้อนรับเข้าสู่ระบบ`, '', {
          duration:2500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['success-snackbar']
        });
        this.router.navigate(['dashboard']);
      } catch (error: any) {
        console.error(error);
        // Handle error during form submission
        this._snackBar.open('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง', 'ลองอีกครั้ง', {
          duration:3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['error-snackbar']
        });
      }
    }
  }

  initForm() {
    // choice_depart choice_stamp
    this.formInitial = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      app: new FormControl('123', [Validators.required]),
    });
  }

  onClickRegister() {
    this.router.navigate(["auth/register"]);
  }
}
