import { Component, OnInit, HostListener } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'sj-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit() {
  }

  @HostListener('click')
  click() {
    this.menuService.close()
  }


}
