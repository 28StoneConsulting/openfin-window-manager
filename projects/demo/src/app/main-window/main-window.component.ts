import { Component } from '@angular/core';
import { TileWindowManagerService } from '../../../../tile-window-manager/src/lib/tile-window-manager.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss'],
})
export class MainWindowComponent {
  constructor(private windowManager: TileWindowManagerService) {}

  secondaryWindowCount = 0;
  windowCount = 0;

  openWindow = async () => {
    await this.windowManager.openWindow({
      uuid: fin.me.uuid,
      name: `Tile ${this.windowCount}`,
      url: `/tile/${this.windowCount}`,
      defaultWidth: 400,
      defaultHeight: 300,
    });
    this.windowCount++;
  };

  closeAllTiles = async () => {
    this.windowCount = 0;
    await this.windowManager.closeAllChildWindows();
  };

  clearLastWindowData = async () => {
    await this.windowManager.clearLastWindowData();
  };

  createSecondaryWindow = () => {
    fin.Window.create({
      name: `Secondary Window ${++this.secondaryWindowCount}`,
      url: '/secondary',
      defaultWidth: 300,
      defaultHeight: 100,
      defaultCentered: true,
    });
  };

  setWindowAsMain = () => {
    this.windowManager.registerMainWindow(fin.Window.getCurrentSync());
  };
}
