import { Component, WritableSignal, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form-create.component';
import UserListComponent from './user-list/user-list.component';
import { state, style, transition, trigger,animate } from '@angular/animations';


interface Employee {
  emp_id: number;
  emp_code: string;
  emp_name: string;
  emp_tel: string;
  emp_role_id: string;
}

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

  // defualt false
  isOpened = signal(false);

  formData:WritableSignal<Employee> = signal({
    emp_id: 0,
    emp_code: '',
    emp_name: '',
    emp_tel:'',
    emp_role_id:''
  })

  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:string){

    if($event === 'open'){
      this.isOpened.set(true);
      this.resetEmployeeData();
    }else if($event === 'close'){
      this.isOpened.set(false);
      this.resetEmployeeData();
    }
  }

  onFormData($event:any){
    this.formData.update(emp => ({
      ...emp,
      emp_id: $event.emp_id,
      emp_code: $event.emp_code,
      emp_name:$event.emp_name,
      emp_tel:$event.emp_tel,
      emp_role_id:$event.emp_role_id,
    }));
  }

  resetEmployeeData() {
    this.formData.set({
      emp_id: 0,
      emp_code: '',
      emp_name: '',
      emp_tel:'',
      emp_role_id:'',
    });
  }

}
