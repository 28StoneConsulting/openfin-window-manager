import { Injectable } from '@angular/core';
import { _Window } from 'openfin/_v2/api/window/window';
import { TileManagerProxyMessage, TileWindowManager } from './types';
import { WindowOptions } from 'openfin/_v2/shapes/WindowOptions';
import { WINDOW_MANAGER_CHANNEL } from './config';

@Injectable({
  providedIn: 'root',
})
export class TileWindowManagerProxyService implements TileWindowManager {
  constructor() {}

  openWindow = async (options: WindowOptions) => {
    return this.sendMessage({
      type: 'openWindow',
      options,
    });
  };

  registerMainWindow = (window: _Window) => {
    return this.sendMessage({
      type: 'registerMainWindow',
      name: window.identity.name,
    });
  };

  closeAllChildWindows = async () => {
    return this.sendMessage({
      type: 'closeAllChildWindows',
    });
  };

  clearLastWindowData = async () => {
    return this.sendMessage({
      type: 'clearLastWindowData',
    });
  };

  private sendMessage = async (data: TileManagerProxyMessage) => {
    const mainWindow = await fin.Application.getCurrentSync().getWindow();
    fin.InterApplicationBus.send(mainWindow.identity, WINDOW_MANAGER_CHANNEL, data);
  };
}
