import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url_dev;
  private apiUrl = `${this.hostUrl}/riders/report/quick`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });


  getDateByQuick(bodyParams:any) {
    console.log(bodyParams)
    return this.http.post<any>(this.apiUrl,bodyParams,{
        headers: this.headers,
      });
  }
}
