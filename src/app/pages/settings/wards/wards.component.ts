import { Component, WritableSignal, signal } from '@angular/core';
import WardListComponent from './ward-list/ward-list.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardList } from '../../../core/interface/ward.interface';


@Component({
  selector: 'app-wards',
  standalone:true,
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.scss',
  imports:[
    WardListComponent,
    WardFormComponent
  ]

})
export default class WardsComponent {

  // defualt false
  isOpened = signal(true);

  formData:WritableSignal<WardList> = signal({
    ward_id: '',
    ward_name: '',
    ward_status_id: '',
    ward_status_name:'',
    ward_date:''
  })

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
    }
  }

  onFormData($event:any){
    this.formData.update(ward => ({
      ...ward,
      ward_id: $event.ward_id,
      ward_name: $event.ward_name,
      ward_status_id:$event.ward_status_id,
      ward_status_name:$event.ward_status_name,
      ward_date:$event.ward_date,
    }));
  }

  initForm() {
    this.formData.set({
      ward_id: '',
      ward_name: '',
      ward_status_id: '',
      ward_status_name:'',
      ward_date:''
    });
  }
}
