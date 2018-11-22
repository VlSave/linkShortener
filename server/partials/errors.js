export default (status) => {
  class SomeError extends Error {
    constructor(...args) {
      super(...args);
      this.status = status;
    }
  }

  return new SomeError();
}
