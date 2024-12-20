import { Injectable, signal } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { RoleService } from "@core/services/role.service";


export type MenuItem = {
  icon:string;
  label:string;
  route?:string;
  subItems?:MenuItem[];
}

@Injectable({
  providedIn: "root",
})
export class MenuService {

  levelApp =  "5"

  menuItems = signal<MenuItem[]>([]);

  constructor(private role: RoleService){

  }

  initProfile(data: any) {
    // console.log(data);
    // this.levelApp = data.levelApp;
  }

  public menuManager(){

    // const levelData = parseInt('3');
    const levelData = parseInt(this.levelApp)

    // console.log(this.levelApp);
    // console.log(levelData);
    if(levelData === 6){
      // ผู้ดูแลระบบ
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "dashboard",
        },
        {
          icon: "comment",
          label: "ขอใช้เปล",
          route: "accessible",
        },
        {
          icon: "analytics",
          label: "รายงาน",
          route: "reports",
        },
        {
          icon: "settings",
          label: "ตั้งค่า",
          route: "null",
          subItems:[
            {
              icon: "domain_add",
              label: "วอร์ด",
              route: "settings/wards"
            },
            {
              icon: "people",
              label: "เจ้าหน้าที่",
              route: "settings/users"
            }
          ]

        },
      ])
    }else if(levelData === 5 || levelData === 4){
      // ศูนย์ center
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "center/dashboard",
        },
        {
          icon: "comment",
          label: "ขอใช้เปล",
          route: "center/accessible",
        },
        {
          icon: "analytics",
          label: "รายงาน",
          route: "center/reports",
        },
        {
          icon: "domain_add",
          label: "วอร์ด",
          route: "center/wards"
        },
        {
          icon: "people",
          label: "เจ้าหน้าที่",
          route: "center/users",
        }
      ]);
    }else if(levelData === 3 || levelData === 2){
      // เจ้าหน้าที่ rider
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "rider/dashboard",
        },
        {
          icon: "system_security_update",
          label: "รับงาน",
          route: "rider/jobs",
        }
      ]);
    }else{
      // วอร์ด ward
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "ward/dashboard",
        },
        {
          icon: "comment",
          label: "ขอใช้เปล",
          route: "ward/accessible",
        },
        {
          icon: "analytics",
          label: "รายงาน",
          route: "ward/reports",
        }
      ]);
    }

    return this.menuItems;
  }
}
