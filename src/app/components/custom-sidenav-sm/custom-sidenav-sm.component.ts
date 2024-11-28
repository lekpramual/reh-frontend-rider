import { Component, Input, computed, signal } from '@angular/core';
import { MenuService } from '@core/services/menu.service';
import { RoleService } from '@core/services/role.service';

export type MenuItem = {
  icon:string;
  label:string;
  route?:string;
  subItems?:MenuItem[];
}

@Component({
  selector: 'custom-sidenav-sm',
  templateUrl: './custom-sidenav-sm.component.html',
  styleUrl: './custom-sidenav-sm.component.scss'
})
export class CustomSidenavSMComponent {
  sideNavCollapsed = signal(false);
  isBackDrop = signal(false);
  profilePicSize = signal("64");

  defaultAccount = {
    userId: "",
    userName: "",
    levelApp: "",
    departId: "",
    departName: "",
  };

  @Input() set collapsed(val:boolean){

    this.sideNavCollapsed.set(val)
  }


  menuItems = this.menu.menuManager();

  constructor(private role: RoleService, private menu: MenuService) {
    this.initProfile(this.role.profile());
  }

  initProfile(data: any) {
    this.defaultAccount.userName = 'เล็ก ลำปาว';
    this.defaultAccount.departName = 'หน่วยงาน'

    const levelApp = parseInt('5');
    if(levelApp === 6){
      this.defaultAccount.levelApp = "ผู้ดูแลระบบ";
    }else if(levelApp === 5){
      this.defaultAccount.levelApp = "ศูนย์ OPD";
    }else if(levelApp === 4){
      this.defaultAccount.levelApp = "ศูนย์ IPD";
    }else if(levelApp === 3){
      this.defaultAccount.levelApp = "เจ้าหน้าที่ OPD";
    }else if(levelApp === 2){
      this.defaultAccount.levelApp = "เจ้าหน้าที่ IPD";
    }else{
      this.defaultAccount.levelApp = "วอร์ด";
    }
  }


}
