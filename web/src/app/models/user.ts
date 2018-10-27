import { Id } from 'app/types/types';

export class UserData {
  firstName: string;
  lastName: string;
  email: string;
  ttwId: string;
  rating: number;
}

export class User extends UserData {
  id: Id;
  createdAt: Date;

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
