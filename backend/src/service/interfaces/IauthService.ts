import { UserData } from "../../interfaces/userInterface";

export interface IAuthService {
  isEmailTaken(email: string): Promise<UserData | null>;
  registerUser(user: Omit<UserData, "_id">): Promise<UserData>;
  loginUser(identifier: string, password: string): Promise<UserData | null>;
}
