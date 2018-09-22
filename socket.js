const room = require('./room');
class Socket {
  constructor() {
    this.socketOpen = false;
    this.socketMsgQueue = [];
  }
  connect(data, cb) {
    let url = 'ws://192.168.124.8:3000/wss3/enter?'
    for (var key in data) {
      url += key + '=' + data[key] + '&'
    }
    url = url.slice(0, -1);
    try {
      wx.connectSocket({
        url: url
      })
      wx.onSocketMessage((res) => {
        console.log('收到服务器内容：' + res.data)
        this.parseData(res.data)
      })
      wx.onSocketOpen((res) => {
        this.socketOpen = true
        for (let i = 0; i < this.socketMsgQueue.length; i++) {
          send(this.socketMsgQueue[i])
        }
        this.socketMsgQueue = []
      })
      cb && cb();
    } catch (e) {
      throw e
    }
  }
  parseData(rData) {
    const data = JSON.parse(rData);
    if (!data.type) {
      return;
    }
    if(data.host){
      room.setHost(data.host);
    }
    if (data.type === 'change_userList') {
      room.changeUserList(data.userList);
      return;
    }
    if (data.type === 'game_start') {
      room.start(data.userList)
      return;
    }
    if (data.type === 'can_speak') {
      room.canSpeak(data.userList,data.notFirst);
      return;
    }
    if(data.type === 'can_vote'){
      room.canVote(data.userList);
      return;
    }
    if(data.type==='vote_end'){
      room.voteEnd(data.userList, data.maxUserIndex);
      return;
    }
    if(data.type==='game_over'){
      room.gameOver(data.userList,data,winner,data.words)
    }
    if(data.type==='get_new_round'){
      room.refresh(data.userList);
    }
    if(data.type==='change_word'){
      room.changeWord(data.userList);
    }
  }
  send(msg) {
    if (this.socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
    } else {
      this.socketMsgQueue.push(JSON.stringify(msg))
    }
  }
}
module.exports = new Socket();