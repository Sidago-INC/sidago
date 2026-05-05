export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  type: "refresh";
};

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: string;
};
