import { Session } from "next-auth";

export interface SessionUserId extends Session {
  userId: number;
}