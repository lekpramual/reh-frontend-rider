import { Component, Input, computed, signal } from '@angular/core';
import { RoleService } from '@core/services/role.service';
import { MenuService } from '@core/services/menu.service';

export type MenuItem = {
  icon:string;
  label:string;
  route?:string;
  subItems?:MenuItem[];
}

@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {
  sideNavCollapsed = signal(false);
  isBackDrop = signal(false);
  @Input() set collapsed(val:boolean){
    this.sideNavCollapsed.set(val)
  }

  defaultAccount = {
    userId: "",
    userName: "",
    levelApp: "",
    departId: "",
    departName: "",
  };



  menuItems = this.menu.menuManager();

  constructor(private role: RoleService, private menu: MenuService) {
    this.initProfile(this.role.profile());
  }

  initProfile(data: any) {
    this.defaultAccount.userName = data.userName;
    this.defaultAccount.departName = data.departName;

    const levelApp = parseInt(data.levelApp);
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

    console.log(this.menu.menuManager())

  }



  profilePicSize = computed(() => (this.sideNavCollapsed() ? "64" : "32"));
}
