import { Component, OnInit } from '@angular/core';
import { _Window } from 'openfin/_v2/api/window/window';
import { OpenfinWindowManagerService } from '../../../../openfin-window-manager/src/lib/openfin-window-manager.service';
import { OpenfinWindowManagerProxyService } from '../../../../openfin-window-manager/src/lib/openfin-window-manager-proxy.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './child-window.component.html',
  styleUrls: ['./child-window.component.scss']
})
export class ChildWindowComponent implements OnInit {
  window: _Window;
  constructor(private windowManager: OpenfinWindowManagerProxyService) {
  }

  ngOnInit() {
    this.window = fin.Window.getCurrentSync();
    window.document.title = this.window.identity.name;
  }
}
