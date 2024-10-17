import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";

@Injectable({
  providedIn: "root",
})
export class WardService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private apiUrl = `${this.hostUrl}/riders/ward`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });


  getWards() {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, { headers: this.headers });
  }


}
