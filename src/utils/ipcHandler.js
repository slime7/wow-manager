import { dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { download } from 'electron-dl';
import extract from 'extract-zip';

const DEVTOOLS = 'devtools';
const SELECT_GAME_PATH = 'select-game-path';
const INSTALL_ADDON = 'install-addon';

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
  [INSTALL_ADDON](event, { addon }) {
    const instances = global.store.get('gameInstances');
    const game = instances.games[instances.current];
    const addonsPath = path.join(game.path, `_${game.type}_`, 'Interface', 'AddOns');
    download(global.win, addon.file.downloadUrl, {
      directory: addonsPath,
      filename: addon.file.fileName,
      showBadge: false,
    }).then((dl) => {
      const addonFile = dl.getSavePath();
      extract(addonFile, { dir: addonsPath }, (err) => {
        if (err) {
          //
        } else {
          fs.unlink(addonFile, () => {});
          const addonInd = game.addons.findIndex(a => a.id === addon.id);
          if (addonInd !== -1) {
            game.addons[addonInd] = addon;
          } else {
            game.addons.push(addon);
          }
          global.store.set('gameInstances.games', instances.games);
          ipc.sendToClient('install-addon-done');
        }
      });
    });
  },
  ping() {
    ipc.sendToClient('ping', 'pong');
  },
});

export default ipcHandler;
