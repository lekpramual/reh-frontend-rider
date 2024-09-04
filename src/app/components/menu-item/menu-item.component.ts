import { Component, computed, input, signal } from '@angular/core';
import { MenuItem } from '../custom-sidenav/custom-sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations:[
    trigger('expandContractMenu',[
      transition(':enter',[
        style({
          opacity:0,
          height:'0px'
        }),
        animate('500ms ease-in-out', style({opacity:1, height:'*'}))
      ]),
      transition(':leave',[
        animate('500ms ease-in-out', style({opacity:0, height:'0px'}))
      ])
    ])
  ]
})
export class MenuItemComponent {

  item = input.required<MenuItem>();

  collapsed = input(false)
  backdrop = input(false)

  nestedMenuOpen = signal(false);

  toggleNested(){
    if(!this.item().subItems){
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

  sideBarPicSize = computed(() => (this.collapsed() ? '38px' : '220px'));
}
