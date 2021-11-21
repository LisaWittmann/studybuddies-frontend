export class User {
  username!: string;
  password!: string;

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }
}
