/**
 * datatype user for login and register
 */
export class User {
  username: string;
  password!: string;
  isReady: boolean;
    finished: boolean;

  constructor(username: string) {
    this.username = username;
    this.isReady = false;
      this.finished = false;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  setReady(isReady: boolean): void {
    this.isReady = isReady;
  }

    setFinished(isFinished: boolean): void {
      this.finished = isFinished;
    }
}
