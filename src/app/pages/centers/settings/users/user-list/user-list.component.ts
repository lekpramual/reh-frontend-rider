import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingService } from '@core/components/loading/loading.service';
import { createUser } from '@core/interface/user.interface';
import { Subject } from 'rxjs';
import { LoadingIndicatorComponent } from "../../../../../core/components/loading/loading.component";
import { WardCreate } from '@core/interface/ward.interface';


export interface PeriodicElement {
  name: string;
  type:string;
  type_id:number;
  equipment: string;
  in: string;
  out: string;
  date:string;
  time:string;
}

export interface UserList {
  emp_id:number;
  emp_code:string;
  emp_name:string;
  emp_tel:string;
  emp_date:string;
  emp_role_id:number;
  emp_role_name:string;
  emp_status_id:number;
  emp_status_name:string;
}

const users:UserList[] = [
  {emp_id:1,emp_code:'EMP-00001',emp_name:'นายทดสอบ ทดสอบ',emp_tel:'0832549551',emp_role_id:1,emp_role_name:'ผู้ดูแลระบบ',emp_status_id:1,emp_status_name:'ใช้งาน',emp_date:'23 ส.ค. 2567'},
  {emp_id:2,emp_code:'EMP-00002',emp_name:'นายทดสอบ2 ทดสอบ2',emp_tel:'0832512345',emp_role_id:2,emp_role_name:'ผู้ดูแลระบบ',emp_status_id:1,emp_status_name:'ใช้งาน',emp_date:'23 ส.ค. 2567'}
]


@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    CommonModule,
    LoadingIndicatorComponent
],

})

export default class UserListComponent{

  sideCreate = signal(false);
  searchValue = "";
  searchTerm = new Subject<string>();

  typeType = input.required<any>();

  @Input() set sideopen(val:boolean){
    this.sideCreate.set(val)
  }

  @Input() set dataUsers(val:any){
    console.log('val >>>',val);
     this.dataSource.data = val;
     this.dataSource.paginator = this.paginator;
   }

   // Output property to send data back to the parent
   @Output() messageChange = new EventEmitter<string>();

   @Output() formChange = new EventEmitter<WardCreate>();


   // Method to handle changes and emit the new value
   onMessageChange() {
    // console.log(newMessage)
     this.messageChange.emit('open');
    //  this.sideCreate.set(true)
   }

  displayedColumns :string[]= ['user_id','code','fullname','tel', 'role', 'status','actions'];

  dataSource = new MatTableDataSource<createUser>;

  formData:WritableSignal<any> = signal({
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public _loadingService: LoadingService
  ) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  clickedJob(row:any){
    console.log('Clicked Job', row);
    this.onMessageChange();


    this.formData.update(result => ({
      ...result,
      mode:'update',
      id:row.id,
      code:row.code,
      title: row.title,
      firstname: row.firstname,
      surname: row.surname,
      tel: row.tel,
      username: row.username,
      password: "",
      level_id: row.level_id
    }));

    this.formChange.emit(this.formData());
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openSide(){
    this.sideCreate.set(true);
  }


  clearSearch() {
    this.searchValue = "";
    this.searchTerm.next("");

    this.dataSource.filter = '';

  }


}
