// Invalid: use case importing from infrastructure
import { Database } from '../../infrastructure/database';

export function saveUser() {
  const db = new Database();
  return db;
}
