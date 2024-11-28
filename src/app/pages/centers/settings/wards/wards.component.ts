import { Component, WritableSignal, inject, signal } from '@angular/core';
import WardListComponent from './ward-list/ward-list.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardCreate, WardList, WardListNew } from '../../../../core/interface/ward.interface';
import { LoadingIndicatorComponent } from '@core/components/loading/loading.component';
import { WardService } from '@core/services/ward.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-wards',
  standalone:true,
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.scss',
  imports:[
    WardListComponent,
    WardFormComponent,
  ]

})
export default class WardsComponent {

  wardService = inject(WardService);
  snackBar= inject(MatSnackBar);

  wards = signal<WardListNew[]>([]);

  constructor(){
    this.getWards();
  }


  // defualt false
  isOpened = signal(false);

  // defualt form
  formData:WritableSignal<WardCreate> = signal({
    mode:'create',
    ward_id: '',
    ward_name: '',
    ward_status: '',
    ward_created_at:''
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
      this.getWards();
    }
  }

  onFormData($event:any){
    this.formData.update(ward => ({
      ...ward,
      mode:$event.mode,
      ward_id: $event.ward_id,
      ward_name: $event.ward_name,
      ward_status:$event.ward_status,
    }));
  }

  initForm() {
    this.formData.set({
      mode:'create',
      ward_id: '',
      ward_name: '',
      ward_status: ''
    });
  }


  async getWards(){
    try {
      const wards = await this.wardService.getWardLists();
      this.wards.set(wards);
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
