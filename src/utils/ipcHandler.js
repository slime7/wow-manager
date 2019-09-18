import { dialog } from 'electron';

const DEVTOOLS = 'devtools';
const SELECT_GAME_PATH = 'select-game-path';

const ipcHandler = ipc => ({
  [DEVTOOLS]() {
    if (global.win) {
      global.win.webContents.openDevTools();
    }
  },
  async [SELECT_GAME_PATH]() {
    try {
      const res = await dialog.showOpenDialog({
        title: '选择游戏目录',
        properties: ['openDirectory'],
      });
      if (!res.canceled) {
        [global.gamePath] = res.filePaths;
      }
      ipc.sendToClient(SELECT_GAME_PATH, true);
    } catch (err) {
      ipc.sendToClient(SELECT_GAME_PATH, false);
    }
  },
  ping() {
    ipc.sendToClient('ping', 'pong');
  },
});

export default ipcHandler;
