import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
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
import {environment} from "@env/environment";

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

        const username = this.formInitial.controls['username'].value;
        const password = this.formInitial.controls['password'].value;
        if (username === 'admin' && password === 'abc123==') {

          const tokens = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2NywidXNlck5hbWUiOiLguJvguKPguLDguKHguKfguKUg4LiZ4Lix4LiU4LiX4Liw4Lii4Liy4LiiIiwibGV2ZWxBcHAiOjYsImRlcGFydElkIjoiMDE0IiwiZGVwYXJ0TmFtZSI6IkExMzAwLeC4q-C4meC5iOC4p-C4ouC4h-C4suC4meC4qOC4ueC4meC4ouC5jOC4hOC4reC4oeC4nuC4tOC4p-C5gOC4leC4reC4o-C5jCIsImlzcyI6InJlaC5nby50aCIsImlhdCI6MTcyNTM1NTkwMywiZXhwIjoxNzI1OTYwNzAzfQ.re6MWlZbLR1movnk1G1X5ZGpk-2PNTSMopYySRg8HZs";

          localStorage.setItem(environment.LOGIN_TOKENS, tokens);
          localStorage.setItem(environment.LOGIN_STATUS, 'ok');

          this._snackBar.open(`ยินดีต้อนรับเข้าสู่ระบบ`, '', {
            duration:1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['success-snackbar']
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['dashboard']);
          });
        } else {
          this._snackBar.open('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง', '', {
            duration:3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['error-snackbar']
          }).onAction().subscribe(() => {
            // Handle the action button click here
            console.log('Snackbar action button clicked!');
            // this.initForm();
          });
        }
      } catch (error: any) {
        console.error(error);
        // Handle error during form submission
        this._snackBar.open('การเข้าสู่ระบบผิดพลาด', '', {
          duration:3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['error-snackbar']
        }).onAction().subscribe(() => {
          // Handle the action button click here
          console.log('Snackbar action button clicked!');
          // this.initForm();
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
}
