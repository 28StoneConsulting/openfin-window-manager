import { WindowOptions } from 'openfin/_v2/shapes/WindowOptions';
import { _Window } from 'openfin/_v2/api/window/window';
import { WindowOption } from 'openfin/_v2/api/window/windowOption';

export type TileManagerProxyMessage =
  | TileWindowManagerProxyOpenMessage
  | TileWindowManagerProxyRegisterMessage
  | TileWindowManagerProxyCloseMessage
  | TileWindowManagerProxyClearMessage;

export interface TileWindowManagerProxyOpenMessage {
  type: 'openWindow';
  options: WindowOptions;
}

export interface TileWindowManagerProxyRegisterMessage {
  type: 'registerMainWindow';
  name: string;
}

export interface TileWindowManagerProxyCloseMessage {
  type: 'closeAllChildWindows';
}

export interface TileWindowManagerProxyClearMessage {
  type: 'clearLastWindowData';
}

export interface TileWindowManager {
  openWindow: (options: WindowOption) => Promise<void>;
  registerMainWindow: (window: _Window) => void;
  closeAllChildWindows: () => Promise<void>;
  clearLastWindowData: () => Promise<void>;
}
