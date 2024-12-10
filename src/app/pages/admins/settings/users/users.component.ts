import { Component, WritableSignal, inject, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form-create.component';
import UserListComponent from './user-list/user-list.component';
import { state, style, transition, trigger,animate } from '@angular/animations';
import { UserService } from '@core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createUser, UserList } from '@core/interface/user.interface';
import { RoleService } from '@core/services/role.service';
import { AuthService } from '@core/services/auth.service';




@Component({
  selector: 'app-users',
  standalone:true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports:[
    UserListComponent,
    UserFormComponent
  ],
  animations:[

    trigger('sidenavAnimation', [
      state('side', style({
        transform: 'translateX(0)'
      })),
      state('over', style({
        transform: 'translateX(-100%)'
      })),
      transition('side <=> over', [
        animate('500ms ease-in-out', style({opacity:0, height:'0px'}))
      ])
    ])

  ]
})
export default class UsersComponent {


  roleId = signal<string | null>(null);

  authService = inject(AuthService);
  roleService = inject(RoleService);
  userService = inject(UserService);
  snackBar= inject(MatSnackBar);
  dataUsers = signal<UserList[]>([]);

  constructor(){

    let _roleId = this.authService.getUserRole();
    if(_roleId){
      this.roleId.set(_roleId == 'centeropd' ? 'opd' : 'ipd')
    }

    this.getUsers();
  }

  // defualt false
  isOpened = signal(false);

  formData:WritableSignal<createUser> = signal({
    mode:'create',
    id:"",
    code:"",
    title: "",
    firstname: "",
    surname: "",
    tel: "",
    username: "",
    password: "",
    level_id: "",
  });

  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:string){
    if($event === 'open'){
      this.isOpened.set(true);
      this.initForm();
    }else if($event === 'close'){
      this.isOpened.set(false);
      this.initForm();
    }else if($event == 'reload'){
      this.isOpened.set(false);
      this.initForm();
      this.getUsers();
    }
  }

  onFormData($event:any){
    this.formData.update(result => ({
      ...result,

      id:$event.id,
      code:$event.code,
      mode: $event.mode,
      title: $event.title,
      firstname: $event.firstname,
      surname: $event.surname,
      tel: $event.tel,
      username: $event.username,
      password: $event.password,
      level_id: `${$event.level_id}`
    }));
  }

  initForm() {
    this.formData.set({
      mode:'create',
      id:"",
      code:"",
      title: "",
      firstname: "",
      surname: "",
      tel: "",
      username: "",
      password: "",
      level_id: "",
    });
  }

  async getUsers(){
    try {
      const result$ = await this.userService.getUserByTypeLoad(this.roleId()!);
      this.dataUsers.set(result$);
    } catch (error) {
      console.error(error);
      this.snackBar.open('โหลดข้อมูลหน่วยงานผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      });
    }
  }

}
