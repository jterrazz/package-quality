// Invalid: domain importing from infrastructure
import { Database } from '../infrastructure/database';

export class Order {
  db = new Database();
}
