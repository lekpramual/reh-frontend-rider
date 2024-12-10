// menu.service.ts
import { Injectable } from '@angular/core';
import { MENU_ITEMS } from '../menus/menu-data';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // ตรวจระดับการเข้าถึงของเมนู
  getFilteredMenu(userRole: string) {
    // const menuItems = MENU_ITEMS.some((role: string[]) => role === userRole);
    const menuItems = MENU_ITEMS.filter((item) => item.role.includes(userRole));
    console.log('menuItems >>>',menuItems);

    return menuItems;
    // return MENU_ITEMS.filter(
    //   (item) => item.level <= userLevel && item.themes.includes(theme)
    // );
  }
}
