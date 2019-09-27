import { dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import extract from 'extract-zip';
import rimraf from 'rimraf';

const DEVTOOLS = 'devtools';
const SELECT_GAME_PATH = 'select-game-path';
const INSTALL_ADDON = 'install-addon';
const DELETE_ADDON = 'delete-addon';

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
  [INSTALL_ADDON](event, { addon, gamePath, gameType }) {
    if (!global.session) {
      global.session = global.win.webContents.session;
      global.session.on('will-download', (downloadEvent, item) => {
        const [downloadUrl] = item.getURLChain();
        const downloadOption = global.downloads
          .find(d => encodeURI(d.url) === downloadUrl);
        downloadOption.downloadItem = item;
        const savePath = path.join(downloadOption.addonPath, downloadOption.filename);
        downloadOption.savePath = savePath;
        downloadOption.downloadItem.setSavePath(savePath);
        ipc.sendToClient('install-addon', {
          state: 'download-start',
          addonId: downloadOption.addonId,
        });

        downloadOption.downloadItem.once('done', (doneEvent, state) => {
          if (state === 'completed') {
            ipc.sendToClient('install-addon', {
              state: 'download-complate',
              addonId: downloadOption.addonId,
            });

            extract(
              downloadOption.savePath,
              { dir: downloadOption.addonPath },
              (err) => {
                if (err) {
                  ipc.sendToClient('install-addon', {
                    state: 'extract-failed',
                    addonId: downloadOption.addonId,
                    reason: err,
                  });
                } else {
                  fs.unlink(downloadOption.savePath, () => {
                  });
                  ipc.sendToClient('install-addon', {
                    state: 'installed',
                    addonId: downloadOption.addonId,
                    addon: downloadOption.addon,
                  });
                }
              },
            );
          } else {
            ipc.sendToClient('install-addon', {
              state: 'download-failed',
              addonId: downloadOption.addonId,
              reason: state,
            });
          }
        });

        downloadOption.downloadItem.on('updated', (updateEvent, state) => {
          if (state === 'interrupted') {
            ipc.sendToClient('install-addon', {
              state: 'download-interrupted',
              addonId: downloadOption.addonId,
            });
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              ipc.sendToClient('install-addon', {
                state: 'download-paused',
                addonId: downloadOption.addonId,
              });
            } else {
              ipc.sendToClient('install-addon', {
                state: 'download-progressing',
                addonId: downloadOption.addonId,
                received: downloadOption.downloadItem.getReceivedBytes(),
                total: downloadOption.downloadItem.getTotalBytes(),
              });
            }
          }
        });
      });
    }

    const isDownloadingInd = global.downloads.findIndex(d => d.addonId === addon.id);
    if (isDownloadingInd >= 0) {
      if (global.downloads[isDownloadingInd].downloadItem) {
        global.downloads[isDownloadingInd].downloadItem.cancel();
      }
      global.downloads.splice(isDownloadingInd, 1);
    }

    const defaultDownloadOptions = {
      downloadItem: null,
      savePath: null,
    };
    const downloadFile = addon.new ? addon.new : addon.file;
    global.downloads.push(Object.assign({}, defaultDownloadOptions, {
      filename: downloadFile.fileName,
      url: downloadFile.downloadUrl,
      addonPath: path.join(gamePath, `_${gameType}_`, 'Interface', 'AddOns'),
      addonId: addon.id,
      addon,
    }));
    global.win.webContents.downloadURL(downloadFile.downloadUrl);
  },
  [DELETE_ADDON](event, { addon, gamePath, gameType }) {
    const addonFolders = addon.file.modules.map(m => m.foldername);

    addonFolders.forEach((addonFolder) => {
      const folder = path.join(gamePath, `_${gameType}_`, 'Interface', 'AddOns', addonFolder);
      if (fs.existsSync(folder)) {
        rimraf.sync(folder);
      }
    });
    ipc.sendToClient('delete-addon', {
      addonId: addon.id,
    });
  },
  ping() {
    ipc.sendToClient('ping', 'pong');
  },
});

export default ipcHandler;
