import { ChangeDetectorRef, Component } from '@angular/core';
import { OpenfinWindowManagerService } from '../../../../openfin-window-manager/src/lib/openfin-window-manager.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent {
  constructor(private windowManager: OpenfinWindowManagerService, cd: ChangeDetectorRef) {
  }

  secondaryWindowCount = 0;
  windowCount = 0;

  openWindow = async () => {
    await this.windowManager.openWindow(`Tile ${this.windowCount}`, `/tile/${this.windowCount}`, 400, 300);
    this.windowCount++;
  }

  closeAllTiles = async () => {
    this.windowCount = 0;
    await this.windowManager.closeAllChildWindows();
  }

  clearLastWindowData = () => {
    this.windowManager.clearLastWindowData();
  }

  createSecondaryWindow = () => {
    fin.Window.create({
      name: `Secondary Window ${++this.secondaryWindowCount}`,
      url: '/secondary',
      defaultWidth: 300,
      defaultHeight: 100,
      defaultCentered: true,
    });
  }

  setWindowAsMain = () => {
    this.windowManager.registerMainWindow(fin.Window.getCurrentSync());
  }
}
