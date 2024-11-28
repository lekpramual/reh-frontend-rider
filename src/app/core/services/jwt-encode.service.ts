// src/app/services/jwt-encode.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class JwtEncodeService {
  // Secret key used to sign the token (Note: This should normally be kept on the server)
  private secretKey = 'CMS#Witoo@2024'; // Never expose this in production!

  constructor() {}

  public encode = (text: string) => {
    // const SECRET = this.settingsService.getProjectSecretKey();
    const base64UrlPayload = this.base64UrlEncode(text);
    return base64UrlPayload;
 };

 private base64UrlEncode(input: string): string {
  const b64 = CryptoJS.AES.encrypt(input,this.secretKey).toString();
  const e64 = CryptoJS.enc.Base64.parse(b64);
  const eHex = e64.toString(CryptoJS.enc.Hex);
  return eHex;
}


public decode = (text: string) => {
  // const SECRET = this.settingsService.getProjectSecretKey();
  const base64UrlPayload = this.base64UrlDecode(text);
  return base64UrlPayload;
};

private base64UrlDecode(input: string): string {
  const reb64 = CryptoJS.enc.Hex.parse(input);
  const bytes = reb64.toString(CryptoJS.enc.Base64);
  const decrypt = CryptoJS.AES.decrypt(bytes, this.secretKey);
  const plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
}
}
