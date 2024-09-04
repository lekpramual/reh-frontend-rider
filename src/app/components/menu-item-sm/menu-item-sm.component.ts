import { Component, computed, input, signal } from '@angular/core';
import { MenuItem } from '../custom-sidenav/custom-sidenav.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item-sm',
  templateUrl: './menu-item-sm.component.html',
  styleUrl: './menu-item-sm.component.scss',
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
    ]),
    trigger('sidenavAnimation', [
      state('side', style({
        transform: 'translateX(0)'
      })),
      state('over', style({
        transform: 'translateX(-100%)'
      })),
      transition('side <=> over', [
        animate('500ms ease-in-out', style({opacity:0, height:'0px'}))
      ])
    ])

  ]
})
export class MenuItemSMComponent {

  item = input.required<MenuItem>();

  collapsed = input(false)
  sideBarPicSize = signal("220px");
  nestedMenuOpen = signal(false);

  toggleNested(){
    if(!this.item().subItems){
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
