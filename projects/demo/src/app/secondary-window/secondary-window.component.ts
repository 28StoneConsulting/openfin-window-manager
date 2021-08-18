import { Component } from '@angular/core';
import { TileWindowManagerProxyService } from '../../../../tile-window-manager/src/lib/tile-window-manager-proxy.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './secondary-window.component.html',
  styleUrls: ['./secondary-window.component.scss'],
})
export class SecondaryWindowComponent {
  constructor(private windowManager: TileWindowManagerProxyService) {}

  setWindowAsMain = async () => {
    await this.windowManager.registerMainWindow(fin.Window.getCurrentSync());
  };
}
