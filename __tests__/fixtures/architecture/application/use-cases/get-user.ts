// Valid: use case importing from domain
import { User } from '../../domain/user.entity';

export function getUser(): User {
  return new User('test');
}
