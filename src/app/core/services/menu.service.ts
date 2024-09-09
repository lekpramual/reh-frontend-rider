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

  levelApp =  ""

  menuItems = signal<MenuItem[]>([]);

  constructor(private role: RoleService){
    this.initProfile(this.role.profile());
  }

  initProfile(data: any) {
    this.levelApp = data.levelApp;
  }

  public menuManager(){

    // TODO Staff
    const levelData = parseInt('6');

    console.log(levelData);
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
    }else if(levelData === 5){
      // ศูนย์ OPD
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
          icon: "domain_add",
          label: "วอร์ด",
          route: "settings/wards"
        },
        {
          icon: "people",
          label: "เจ้าหน้าที่",
          route: "settings/users",
        }
      ]);
    }else if(levelData === 4){
      // ศูนย์ IPD
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
          icon: "domain_add",
          label: "วอร์ด",
          route: "settings/wards"
        },
        {
          icon: "people",
          label: "เจ้าหน้าที่",
          route: "settings/users",
        }
      ]);
    }else if(levelData === 3){
      // เจ้าหน้าที่ OPD
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "dashboard",
        },
        {
          icon: "system_security_update",
          label: "รับงาน",
          route: "staff",
        },
        {
          icon: "analytics",
          label: "รายงาน",
          route: "reports",
        }
      ]);
    }else if(levelData === 2){
      // เจ้าหน้าที่ IPD
      this.menuItems.set([
        {
          icon: "dashboard",
          label: "แดชบอร์ด",
          route: "dashboard",
        },
        {
          icon: "system_security_update",
          label: "รับงาน",
          route: "staff",
        },
        {
          icon: "analytics",
          label: "รายงาน",
          route: "reports",
        }
      ]);
    }else{
      // วอร์ด
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
        }
      ]);
    }

    return this.menuItems;
  }
}
