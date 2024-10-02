import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url_dev;
  private loginUrl = `${this.hostUrl}/riders/login`;

  login(value: User) {
    return this.http.post<any>(this.loginUrl, value);
  }
}
