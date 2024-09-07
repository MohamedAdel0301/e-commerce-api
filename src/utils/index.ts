import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  role: string;
};

const isTokenValid = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token validation failed:");
    return null;
  }
};

export default isTokenValid;
