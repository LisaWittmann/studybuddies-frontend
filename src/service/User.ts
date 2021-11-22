/**
 * datatype user for login and register
 */
export class User {
  username!: string;
  password!: string;

  setUsername(username: string): void {
    this.username = username;
  }

  setPassword(password: string): void {
    this.password = password;
  }
}
