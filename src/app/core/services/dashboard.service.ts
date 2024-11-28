import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private apiUrl = `${this.hostUrl}/riders/dashboard`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.ACCESS_TOKENS) || "no-token",
  });

  getDashboardByYear(bodyParams:any) {
    return this.http.post<any>(`${this.apiUrl}/ward`,bodyParams,{
        headers: this.headers,
      });
  }

  async getDashboardByYearCenter(bodyParams:any) {
    const results$ = this.http.post<any>(`${this.apiUrl}/center`,bodyParams,{
        headers: this.headers,
    });

    const response = await firstValueFrom(results$);
    return response.result;
  }

  async getDashboardByYearRider(bodyParams:any) {
    const results$ = this.http.post<any>(`${this.apiUrl}/rider`,bodyParams,{
        headers: this.headers,
    });

    const response = await firstValueFrom(results$);
    return response.result;
  }
}
