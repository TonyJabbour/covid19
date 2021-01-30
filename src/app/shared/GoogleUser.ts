export class Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export class User {
  uid?: string;
  email?: string | null;
  roles: Roles = new Roles();
}

