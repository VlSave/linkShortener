export default class {
  constructor(nickname, passHash, dbID) {
    this.nickname = nickname;
    this.passHash = passHash;
    this.dbID = dbID;
    this.guest = false;
  }

  isGuest() {
    return this.guest;
  }
  getName() {
    return this.nickname;
  }
  getPassHash() {
    return this.passHash;
  }
  getID() {
    return this.dbID;
  }
}
