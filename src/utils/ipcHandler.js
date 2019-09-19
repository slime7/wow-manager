import { dialog } from 'electron';
import path from 'path';
import fs from 'fs';

const DEVTOOLS = 'devtools';
const SELECT_GAME_PATH = 'select-game-path';

const ipcHandler = ipc => ({
  [DEVTOOLS]() {
    if (global.win) {
      global.win.webContents.openDevTools();
    }
  },
  async [SELECT_GAME_PATH]() {
    const listWowFolder = (p) => {
      const hasClassic = fs.existsSync(path.join(p, '_classic_'));
      const hasRetail = fs.existsSync(path.join(p, '_retail_'));
      return {
        classic: hasClassic,
        retail: hasRetail,
      };
    };
    try {
      const res = await dialog.showOpenDialog({
        title: '选择游戏目录',
        properties: ['openDirectory'],
      });
      if (!res.canceled) {
        const [gamePath] = res.filePaths;
        const parsedGamePath = path.parse(gamePath);
        parsedGamePath.sub = listWowFolder(gamePath);
        ipc.sendToClient(SELECT_GAME_PATH, parsedGamePath);
      } else {
        ipc.sendToClient(SELECT_GAME_PATH, false);
      }
    } catch (err) {
      ipc.sendToClient(SELECT_GAME_PATH, false);
    }
  },
  ping() {
    ipc.sendToClient('ping', 'pong');
  },
});

export default ipcHandler;
