import { Component, OnInit, Input } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'sj-toolbar',
  templateUrl: './toolbar.component.html',
  styles: []
})
export class ToolbarComponent implements OnInit {

  @Input() title = 'Soccer Join';
  @Input() actions: Action[];
  @Input() isHome = false;
  loading = false;

  constructor(
    private spinner: SpinnerService,
    private router: Router
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
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.actions = undefined;
      }
    });
  }

  back() {
    window.history.back();
  }

}

export class Action {
  styleName: string;
  text: string;
  click: () => void;
}