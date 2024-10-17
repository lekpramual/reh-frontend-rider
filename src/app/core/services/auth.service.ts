import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private loginUrl = `${this.hostUrl}/riders/login`;

  login(value: User) {
    return this.http.post<any>(this.loginUrl, value);
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;  // If there's no token, consider it expired

    const decoded: any = jwt_decode(environment.LOGIN_TOKENS);

    // Current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the token is expired
    if (decoded.exp < currentTime) {
      return true;  // Token is expired
    }

    return false;  // Token is still valid
  }
}
