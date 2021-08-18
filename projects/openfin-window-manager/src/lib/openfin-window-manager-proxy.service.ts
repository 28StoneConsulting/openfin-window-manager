import { Injectable } from '@angular/core';
import { AnchorType, Bounds } from 'openfin/_v2/shapes/shapes';
import { _Window } from 'openfin/_v2/api/window/window';
import { MonitorDetails, Rect } from 'openfin/_v2/api/system/monitor';
import WindowBoundsEvent = fin.WindowBoundsEvent;
import { WindowManagerProxyMessage } from './types';

@Injectable({
  providedIn: 'root',
})
export class OpenfinWindowManagerProxyService {
  constructor() {}

  openWindow = async (name: string, url: string, width: number, height: number) => {
    return this.sendMessage({
      type: 'openWindow',
      name,
      url,
      width,
      height
    });
  }

  registerMainWindow = (window: _Window) => {
    return this.sendMessage({
      type: 'registerMainWindow',
      name: window.identity.name
    });
  }

  closeAllChildWindows = async () => {
    return this.sendMessage({
      type: 'closeAllChildWindows'
    });
  }

  clearLastWindowData = async () => {
    return this.sendMessage({
      type: 'clearLastWindowData'
    });
  }

  private sendMessage = async (data: WindowManagerProxyMessage) => {
    const mainWindow = await fin.Application.getCurrentSync().getWindow();
    fin.InterApplicationBus.send(mainWindow.identity, 'window_manager', data);
  }
}
