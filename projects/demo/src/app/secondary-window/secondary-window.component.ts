import { ChangeDetectorRef, Component } from '@angular/core';
import { OpenfinWindowManagerService } from '../../../../openfin-window-manager/src/lib/openfin-window-manager.service';
import { OpenfinWindowManagerProxyService } from '../../../../openfin-window-manager/src/lib/openfin-window-manager-proxy.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './secondary-window.component.html',
  styleUrls: ['./secondary-window.component.scss']
})
export class SecondaryWindowComponent {
  constructor(private windowManager: OpenfinWindowManagerProxyService, cd: ChangeDetectorRef) {
  }

  setWindowAsMain = async () => {
    await this.windowManager.registerMainWindow(fin.Window.getCurrentSync());
  }
}
