import ipcHandler from './utils/ipcHandler';

export default class Ipc {
  constructor(listener, sender) {
    this.listener = listener;
    this.sender = sender;
    this.addListener('ipc-msg', this.handleFn.bind(this));
    this.handlerList = ipcHandler(this);
  }

  handleFn(event, data) {
    try {
      this.handlerList[data.type](event, data.data);
    } catch (error) {
      console.error(`handler event error:${error.message}`);
    }
  }

  addListener(chanel, cb) {
    this.listener.on(chanel, cb);
  }

  sendMsg(chanel, msgBody) {
    this.sender.send(chanel, msgBody);
  }

  sendToClient(type, data) {
    this.sendMsg('ipc-reply', {
      type,
      data,
    });
  }
}
