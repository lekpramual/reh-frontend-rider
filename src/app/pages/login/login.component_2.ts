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
import { AuthService } from "@core/services/auth.service";
import { firstValueFrom } from "rxjs";
import { RoleService } from "@core/services/role.service";

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

  private accessToken: string | null = null;

  constructor(
    public _authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _roleService:RoleService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }


  async onSubmit() {
    if (this.formInitial.valid) {
      // Handle form submission
        this._authService.login(this.formInitial.value).subscribe({
          next: (data) => {
            this.accessToken = data.accessToken;
            console.log('Logged in! Access token:', this.accessToken);

            localStorage.setItem('accessToken', data.accessToken);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Login failed', err)
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

        });
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
