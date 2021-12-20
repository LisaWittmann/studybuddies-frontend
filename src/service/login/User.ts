/**
 * datatype user for login and register
 */
export class User {
  username!: string;
  password!: string;
  isReady!: boolean;

  constructor(username: string) {
    this.username = username;
    this.isReady = false;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  isReadyToggle(): void {
    this.isReady = !this.isReady;
  }
}
