import { User } from "./user.model";

export interface Category {
  id: number;
  name: string;
  color: string;
  user: User | number;
}
