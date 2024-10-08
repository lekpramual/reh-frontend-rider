import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  // test
  constructor() {}

  profile() {
    if (this.isLoggedIn) {
      const token: any = localStorage.getItem(environment.LOGIN_TOKENS) || null;
      try {
        return jwt_decode(token);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Error decoding ...");
      return null;
    }
  }

  role() {
    if (this.isLoggedIn) {
      const token: any = localStorage.getItem(environment.LOGIN_TOKENS) || null;
      try {
        const decodeToken: any = jwt_decode(token);
        return Number(decodeToken.levelApp);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Error decoding ...");
      return null;
    }
  }

  ward() {
    if (this.isLoggedIn) {
      const token: any = localStorage.getItem(environment.LOGIN_TOKENS) || null;
      try {
        const decodeToken: any = jwt_decode(token);
        return Number(decodeToken.departId);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Error decoding ...");
      return null;
    }
  }

  wardName() {
    if (this.isLoggedIn) {
      const token: any = localStorage.getItem(environment.LOGIN_TOKENS) || null;
      try {
        const decodeToken: any = jwt_decode(token);
        return decodeToken.departName;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Error decoding ...");
      return null;
    }
  }

  userId() {
    if (this.isLoggedIn) {
      const token: any = localStorage.getItem(environment.LOGIN_TOKENS) || null;
      try {
        const decodeToken: any = jwt_decode(token);
        return Number(decodeToken.userId);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    } else {
      console.error("Error decoding ...");
      return null;
    }
  }

  //--------------------------
  public get isLoggedIn(): boolean {
    return localStorage.getItem(environment.LOGIN_STATUS) === 'ok';
  }
}
