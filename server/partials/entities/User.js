export default class {
  constructor(nickname, passHash) {
    this.nickname = nickname;
    this.passHash = passHash;
    this.guest = false;
  }

  isGuest() {
    return this.guest;
  }
}
