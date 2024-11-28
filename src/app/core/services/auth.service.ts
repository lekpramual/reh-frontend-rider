import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import jwt_decode from 'jwt-decode';
import { JwtEncodeService } from "./jwt-encode.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient, private jwtEncodeService: JwtEncodeService) {}

  private hostUrl = environment.node_api_url;
  private loginUrl = `${this.hostUrl}`;
  private accessToken = environment.ACCESS_TOKENS;

  login(value: User) {
    return this.http.post<any>(`${this.loginUrl}/riders/login`, value);
  }

  logout(){
    localStorage.removeItem(this.accessToken);
  }

  getUserRole(): string | null {
    const token = localStorage.getItem(this.accessToken);
    if (token) {
      try {

        const decodeJwtToken:any = this.jwtEncodeService.decode(token);
        const decodeToken: any = jwt_decode(decodeJwtToken);
        console.log(decodeToken);

        const role:string = decodeToken.role;
        console.log('role ',role )
        return  role;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
      // return JSON.parse(user).role;
    }
    return null;
  }

  getUserId(): string | null {
    const token = localStorage.getItem(this.accessToken);
    if (token) {
      try {

        const decodeJwtToken:any = this.jwtEncodeService.decode(token);
        const decodeToken: any = jwt_decode(decodeJwtToken);
        console.log(decodeToken);

        const role:string = decodeToken.id;
        console.log('role ',role )
        return  role;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
      // return JSON.parse(user).role;
    }
    return null;
  }

  getDepartId(): number | null {
    const token = localStorage.getItem(this.accessToken);
    if (token) {
      try {

        const decodeJwtToken:any = this.jwtEncodeService.decode(token);
        const decodeToken: any = jwt_decode(decodeJwtToken);
        console.log(decodeToken);

        const role:number = decodeToken.depart;
        console.log('role ',role )
        return  role;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
      // return JSON.parse(user).role;
    }
    return null;
  }
}
