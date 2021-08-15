import { Injectable } from '@angular/core';
import { AnchorType, Bounds } from 'openfin/_v2/shapes/shapes';
import { _Window } from 'openfin/_v2/api/window/window';
import { MonitorDetails, Rect } from 'openfin/_v2/api/system/monitor';

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
  private lastWindowName: string;
  private lastWindowBounds: Bounds;
  private lastWindowMonitor: WindowMonitor;
  private layoutPassNum = 0;
  constructor() {}

  openWindow = async (name: string, url: string, width: number, height: number) => {
    const window = await fin.Window.create({
      name,
      autoShow: false,
      saveWindowState: false,
      url
    });

    let windowBounds: Bounds;
    this.lastWindowMonitor = this.lastWindowMonitor || await this.getWindowMonitor(fin.Window.getCurrentSync());

    if (this.lastWindowBounds) {
      const allWindows = await fin.System.getAllWindows();
      let top = this.lastWindowBounds.top;
      let left = this.lastWindowBounds.left;

      if (allWindows[0].childWindows.find(item => item.name === this.lastWindowName)) {
        top += WINDOW_OFFSET;
        left += WINDOW_OFFSET;
      }

      windowBounds = { top, left, bottom: top + height, right: left + width, width, height };

      if (!this.windowFitToScreen(windowBounds, this.lastWindowMonitor.bounds)) {
        windowBounds.top = this.lastWindowMonitor.bounds.top + WINDOW_OFFSET;
        windowBounds.left = this.lastWindowMonitor.bounds.left + WINDOW_OFFSET + this.layoutPassNum * HORIZONTAL_OFFSET;
        this.layoutPassNum++;
      }
    } else {
      windowBounds = await this.getCenterWindowBounds(window, width, height, this.lastWindowMonitor.bounds);
    }

    await window.setBounds(windowBounds);
    this.lastWindowBounds = windowBounds;
    this.lastWindowName = name;
    window.show();
  }

  closeAllChildWindows = async () => {
    const allWindows = await fin.System.getAllWindows();
    allWindows[0].childWindows.forEach(item => fin.Window.wrap({ uuid: fin.me.uuid, name: item.name }).then(window => window.close()));
  }

  clearLastWindowData = () => {
    this.lastWindowName = null;
    this.lastWindowBounds = null;
    this.lastWindowMonitor = null;
    this.layoutPassNum = 0;
  }

  getCenterWindowBounds = async (window: _Window, width: number, height: number, monitorBounds: Rect): Promise<Bounds> => {
    const windowTop = monitorBounds.top + (monitorBounds.bottom - monitorBounds.top) / 2 - height / 2;
    const windowLeft = monitorBounds.left + (monitorBounds.right - monitorBounds.left) / 2 - width / 2;
    return { top: windowTop, left: windowLeft, bottom: windowTop + height, right: windowLeft + width, width, height };
  }

  windowFitToScreen = (windowBounds: Bounds, monitorBounds: Rect) => {
    return windowBounds.top >= monitorBounds.top
      && windowBounds.left >= monitorBounds.left
      && windowBounds.bottom <= monitorBounds.bottom
      && windowBounds.right <= monitorBounds.right;
  }

  getWindowCount = async () => {
    const children = await fin.Application.getCurrentSync().getChildWindows();
    return children.length;
  }

  getWindowMonitor = async (window: _Window): Promise<WindowMonitor> => {
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
