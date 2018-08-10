export class UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export class User extends UserData {
  id: number;
  createdAt: Date;

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
