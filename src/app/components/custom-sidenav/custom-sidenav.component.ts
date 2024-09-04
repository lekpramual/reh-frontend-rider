import { Component, Input, computed, signal } from '@angular/core';

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



  menuItems = signal<MenuItem[]>([
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
      icon: "system_security_update",
      label: "รับงาน",
      route: "staff",
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
        },

        // {
        //   icon: "post_add",
        //   label: "Posts",
        //   route: "posts"
        // }
      ]

    },
  ]);


  profilePicSize = computed(() => (this.sideNavCollapsed() ? "64" : "32"));
}