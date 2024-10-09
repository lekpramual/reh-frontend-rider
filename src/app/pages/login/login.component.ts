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
      try {
        // Handle successful form submission
        let response = await firstValueFrom(
          this._authService.login(this.formInitial.value)
        );

        if (response.token) {
          let _token = response.token;
          this.error = null;

          localStorage.setItem(environment.LOGIN_TOKENS, _token);
          localStorage.setItem(environment.LOGIN_STATUS, 'ok');

          this._snackBar.open(`ยินดีต้อนรับเข้าสู่ระบบ`, '', {
            duration:1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['success-snackbar']
          }).afterDismissed().subscribe(async () => {
            let role = await this._roleService.role();
            console.log('role...',role);

            if(role == 0){
              this.router.navigate(['ward/dashboard']);
            }else{
              this.router.navigate(['dashboard']);
            }

          });

        } else {
          this.error = response.message;
          localStorage.removeItem(environment.token);


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
