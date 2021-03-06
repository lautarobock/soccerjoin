import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Platform } from '../../tools/platform.service';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'sj-toolbar',
  templateUrl: './toolbar.component.html',
  styles: []
})
export class ToolbarComponent implements OnInit {

  @Input() title = 'Soccer Join';
  @Input() actions: Action[] = [];
  @Input() isHome = false;
  @Output() customBack = new EventEmitter();
  loading = false;
  actionsMain: Action[];
  actionsMenu: Action[];

  constructor(
    private spinner: SpinnerService,
    private router: Router,
    public menuService: MenuService
  ) { }

  ngOnInit() {
    if (this.spinner.current()) {
      this.loading = true;
    } else {
      this.loading = false
    }
    this.spinner.onChange.subscribe(count => {
      setTimeout(() => {
        if (count) {
          this.loading = true
        } else {
          this.loading = false
        }
      });
    });
    this.actionsMain = this.actions.filter(action => !action.menu);
    this.actionsMenu = this.actions.filter(action => action.menu);
  }

  back() {
    if (this.customBack.observers.length) {
      this.customBack.emit();
    } else {
      this.router.navigate(['/home']);
    }
  }

}

export class Action {
  styleName: string;
  text: string;
  click: () => void;
  menu: boolean;
}