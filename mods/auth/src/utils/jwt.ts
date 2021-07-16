import {promisify} from "util";
import {sign, verify} from "jsonwebtoken";
import logger from "@fonos/logger";
import JwtPayload from "./jwt_payload";
import ITokenManager from "./itoken_manager";
/*
 * issuer 		— Organization who issue the toke.
 * role       — User role
 * accessKey  — User access key
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */
export default class JWT implements ITokenManager {
  async encode(
    payload: JwtPayload,
    privateKey: string,
    expiresIn = "30d"
  ): Promise<string> {
    if (!privateKey) throw new Error("Token generation failure");
    // @ts-ignore
    return promisify(sign)({...payload}, privateKey, {
      expiresIn
    });
  }

  /**
   * Returns the decoded payload if the signature is valid even if it is expired
   */
  async decode(token: string, privateKey: string): Promise<JwtPayload> {
    try {
      // @ts-ignore
      return (await promisify(verify)(token, privateKey, {
        ignoreExpiration: false
      })) as JwtPayload;
    } catch (e) {
      console.log(e);
      
      logger.log("error", "@fonos/auth [Bad token]");
      throw new Error(e);
    }
  }
}
