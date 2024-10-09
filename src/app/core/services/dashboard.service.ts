import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url_dev;
  private apiUrl = `${this.hostUrl}/riders/dashboard/ward`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });


  getDashboardByYear(bodyParams:any) {
    return this.http.post<any>(this.apiUrl,bodyParams,{
        headers: this.headers,
      });
  }
}
