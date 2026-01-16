import * as jwt from 'jsonwebtoken';

import { UserDocument } from 'src/users/users.schema';

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createAndSendToken = (user: UserDocument) => {
  const token = signToken(user._id.toString());

  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: false, // TRUE -- only sent on https (production); FALSE -- for development using http
    httpOnly: true, // cookie cannot be accessed or modified by the browser
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  user.password = undefined;

  return token;
};
