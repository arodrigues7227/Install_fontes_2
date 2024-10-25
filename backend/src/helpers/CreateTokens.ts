import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import User from "../models/User";

export const createAccessToken = (user: User, tokenVersion:number): string => {
  const { secret, expiresIn } = authConfig;

  return sign(
    {
      usarname: user.name,
      profile: user.profile,
      id: user.id,
      companyId: user.companyId,
      tokenVersion
    },
    secret,
    {
      expiresIn
    }
  );
};

export const createRefreshToken = (user: User, tokenVersion:number): string => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign(
    { id: user.id, tokenVersion, companyId: user.companyId },
    refreshSecret,
    {
      expiresIn: refreshExpiresIn
    }
  );
};
