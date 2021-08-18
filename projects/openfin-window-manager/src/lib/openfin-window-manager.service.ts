import { Injectable } from '@angular/core';
import { AnchorType, Bounds } from 'openfin/_v2/shapes/shapes';
import { _Window } from 'openfin/_v2/api/window/window';
import { MonitorDetails, Rect } from 'openfin/_v2/api/system/monitor';
import WindowBoundsEvent = fin.WindowBoundsEvent;
import { WindowManagerProxyMessage } from './types';

export type WindowMonitor = {
  primary: boolean;
  bounds: Rect;
  name: string;
};

const WINDOW_OFFSET = 30;
const HORIZONTAL_OFFSET = 100;

@Injectable({
  providedIn: 'root',
})
export class OpenfinWindowManagerService {
  private mainWindow: _Window;
  private windows: _Window[] = [];
  private lastWindow: _Window;
  private lastWindowBounds: Bounds;
  private layoutPassNum = 0;
  constructor() {
    const handleSubscription = async (data: WindowManagerProxyMessage) => {
      switch (data.type) {
        case 'openWindow':
          await this.openWindow(data.name, data.url, data.width, data.height);
          break;
        case 'registerMainWindow':
          const window = fin.Window.wrapSync({ uuid: fin.me.uuid, name: data.name });
          this.registerMainWindow(window);
          break;
        case 'closeAllChildWindows':
          await this.closeAllChildWindows();
          break;
        case 'clearLastWindowData':
          await this.clearLastWindowData();
          break;
      }
    };

    fin.InterApplicationBus.subscribe({ uuid: fin.me.uuid }, 'window_manager', handleSubscription);
  }

  openWindow = async (name: string, url: string, width: number, height: number) => {
    const window = await fin.Window.create({
      name,
      autoShow: false,
      saveWindowState: false,
      url
    });

    const lastWindowMonitor = await this.getWindowMonitor(this.lastWindow || this.mainWindow || fin.Window.getCurrentSync());
    let windowBounds: Bounds;

    if (!this.lastWindowBounds) {
      this.lastWindowBounds = JSON.parse(localStorage.getItem('lastWindowBounds'));
    }

    if (this.lastWindowBounds) {
      let top = this.lastWindowBounds.top;
      let left = this.lastWindowBounds.left;

      if (this.windows.find(item => item.identity.name === this.lastWindow.identity.name)) {
        top += WINDOW_OFFSET;
        left += WINDOW_OFFSET;
      }

      windowBounds = { top, left, bottom: top + height, right: left + width, width, height };

      if (!this.windowFitToScreen(windowBounds, lastWindowMonitor.bounds)) {
        windowBounds.top = lastWindowMonitor.bounds.top + WINDOW_OFFSET;
        windowBounds.left = lastWindowMonitor.bounds.left + WINDOW_OFFSET + this.layoutPassNum * HORIZONTAL_OFFSET;
        this.layoutPassNum++;
      }
    } else {
      windowBounds = await this.getCenteredWindowBounds(window, width, height, lastWindowMonitor.bounds);
    }

    await window.setBounds(windowBounds);
    this.lastWindow?.removeListener('bounds-changed', this.windowBoundsChangedHandler);
    window.addListener('bounds-changed', this.windowBoundsChangedHandler);
    window.addListener('closed', this.windowClosedHandler);
    this.lastWindow = window;
    localStorage.setItem('lastWindowBounds', JSON.stringify(windowBounds));
    this.lastWindowBounds = windowBounds;
    this.windows.push(window);
    window.show();
  }

  registerMainWindow = (window: _Window) => {
    this.mainWindow = window;
  }

  closeAllChildWindows = async () => {
    this.windows.forEach(window => window.close());
  }

  clearLastWindowData = async () => {
    this.lastWindow = null;
    this.lastWindowBounds = null;
    this.layoutPassNum = 0;
    localStorage.removeItem('lastWindowBounds');
  }

  private windowBoundsChangedHandler = (e: WindowBoundsEvent) => {
    if (!this.lastWindowBounds) {
      return;
    }

    this.lastWindowBounds.top = e.top;
    this.lastWindowBounds.left = e.left;
    this.lastWindowBounds.bottom = e.top + e.height;
    this.lastWindowBounds.right = e.left + e.width;
    this.lastWindowBounds.width = e.width;
    this.lastWindowBounds.height = e.height;
  }

  private windowClosedHandler = (e) => {
    if (this.lastWindow?.identity.name === e.name) {
      this.lastWindow = null;
    }

    this.windows = this.windows.filter(item => item.identity.name !== e.name);
  }

  private getCenteredWindowBounds = async (window: _Window, width: number, height: number, monitorBounds: Rect): Promise<Bounds> => {
    const windowTop = monitorBounds.top + (monitorBounds.bottom - monitorBounds.top) / 2 - height / 2;
    const windowLeft = monitorBounds.left + (monitorBounds.right - monitorBounds.left) / 2 - width / 2;
    return { top: windowTop, left: windowLeft, bottom: windowTop + height, right: windowLeft + width, width, height };
  }

  private windowFitToScreen = (windowBounds: Bounds, monitorBounds: Rect) => {
    return windowBounds.top >= monitorBounds.top
      && windowBounds.left >= monitorBounds.left
      && windowBounds.bottom <= monitorBounds.bottom
      && windowBounds.right <= monitorBounds.right;
  }

  private getWindowMonitor = async (window: _Window): Promise<WindowMonitor> => {
    const windowBounds = await window.getBounds();
    const monitorInfo = await fin.System.getMonitorInfo();

    const getMonitor = (anchor: AnchorType) => {
      let result: WindowMonitor;

      if (this.isInMonitor(windowBounds, monitorInfo.primaryMonitor, anchor)) {
        result = { primary: true, name: monitorInfo.primaryMonitor.name, bounds: monitorInfo.primaryMonitor.monitor.dipRect };
      }
      else {
        monitorInfo.nonPrimaryMonitors.forEach(monitorData => {
          if (this.isInMonitor(windowBounds, monitorData, anchor)) {
            result = { primary: false, name: monitorData.name, bounds: monitorData.monitor.dipRect };
          }
        });
      }

      return result;
    };

    let windowMonitor = getMonitor('top-left');

    if (!windowMonitor) {
      windowMonitor = getMonitor('top-right');
    }

    return windowMonitor;
  }

  private isInMonitor = (winBounds: Bounds, monitorData: MonitorDetails, anchor: AnchorType = 'top-left') => {
    if (anchor === 'top-left') {
      return winBounds.left >= monitorData.monitorRect.left
        && winBounds.left <= monitorData.monitorRect.right
        && winBounds.top >= monitorData.monitorRect.top
        && winBounds.top <= monitorData.monitorRect.bottom;
    }

    if (anchor === 'top-right') {
      return winBounds.right <= monitorData.monitorRect.right
        && winBounds.right >= monitorData.monitorRect.left
        && winBounds.top >= monitorData.monitorRect.top
        && winBounds.top <= monitorData.monitorRect.bottom;
    }

    if (anchor === 'bottom-left') {
      return winBounds.left >= monitorData.monitorRect.left
        && winBounds.left <= monitorData.monitorRect.right
        && winBounds.bottom <= monitorData.monitorRect.bottom
        && winBounds.bottom >= monitorData.monitorRect.top;
    }

    if (anchor === 'bottom-right') {
      return winBounds.right <= monitorData.monitorRect.right
        && winBounds.right >= monitorData.monitorRect.left
        && winBounds.bottom <= monitorData.monitorRect.bottom
        && winBounds.bottom >= monitorData.monitorRect.top;
    }
  }
}
