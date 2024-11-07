import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import { firstValueFrom } from "rxjs";
import { GetReportEmpResponse, GetReportWardResponse, ReportEmp, ReportWard } from "@core/interface/reports.interface";

@Injectable({
  providedIn: "root",
})
export class ReportService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private apiUrl = `${this.hostUrl}/riders/report`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });


  getDateByQuick(bodyParams:any) {
    return this.http.post<any>(`${this.apiUrl}/quick`,bodyParams,{
        headers: this.headers,
      });
  }

  async getDateByPer(type_oi: string, rxdate:string, eddate:string,perid:string):Promise<ReportEmp[]> {
    const url = `${this.apiUrl}/emp?type_oi=${type_oi}&rxdate=${rxdate}&eddate=${eddate}&perid=${perid}`;
    const results$ = this.http.get<GetReportEmpResponse>(url, { headers: this.headers });
    const response = await firstValueFrom(results$);
    return await response.result;
  }

  async getDateByWard(type_oi: string, rxdate:string, eddate:string,ward:string):Promise<ReportWard[]> {
    const url = `${this.apiUrl}/ward?type_oi=${type_oi}&rxdate=${rxdate}&eddate=${eddate}&ward=${ward}`;
    const results$ = this.http.get<GetReportWardResponse>(url, { headers: this.headers });
    const response = await firstValueFrom(results$);
    return await response.result;
  }
}
