import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
  username: Type.String(),
  password: Type.String()
});

export type UserType = Static<typeof UserSchema>;