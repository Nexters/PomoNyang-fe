import { BrowserWindow, WebRequestFilter } from 'electron';

// @note: 아래 urls에 있는 경로로 보내지는 api들의 요청, 응답 헤더를 수정하여 cors 에러를 무시합니다
export const ignoreCors = (mainWindow: BrowserWindow) => {
  const reqFilters: WebRequestFilter = {
    // @see: https://www.electronjs.org/docs/latest/api/structures/web-request-filter
    urls: [`${process.env.VITE_SERVER_API_URL}/*`],
  };

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(reqFilters, (details, callback) => {
    const newHeaders = { ...details.requestHeaders };

    delete newHeaders['Origin'];
    delete newHeaders['Access-Control-Request-Method'];
    delete newHeaders['Access-Control-Request-Headers'];

    callback({ requestHeaders: newHeaders });
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived(reqFilters, (details, callback) => {
    const newHeaders = {
      ...details.responseHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    };

    callback({ responseHeaders: newHeaders });
  });
};
