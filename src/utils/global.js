import { app } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { storeSetting } from './constants';

global.ROOT = path.join(__dirname, '..');
global.APPDATA_PATH = path.join(app.getPath('appData'), 'wow-manager');
global.win = null;
global.store = new Store(storeSetting);
