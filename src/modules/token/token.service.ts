import jwt from "jsonwebtoken";
import config from "../../config/db.config";

export class TokenService {

  /**
   * Verifies the authenticity of a token and returns the corresponding user document.
   * @param {string} token - The token to verify.
   * @returns {Promise<IUser>} - A promise that resolves to the user document associated with the token.
   * @throws {Error} - If the token is invalid or the user is not found.
   */
  verifyToken(token: string): string {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload);
    if (!payload.sub) {
      throw new Error("bad user");
    }
    return payload.sub;
  }
}
