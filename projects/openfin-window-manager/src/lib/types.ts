export type WindowManagerProxyMessage = {
  type: 'openWindow' | 'registerMainWindow' | 'closeAllChildWindows' | 'clearLastWindowData';
  [key: string]: any;
};
