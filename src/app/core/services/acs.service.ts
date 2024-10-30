import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AcsService {

  constructor(private http: HttpClient) { }

  private hostUrl = environment.node_api_url;
  private hostUrlHis = environment.node_api_his;
  private accessKeySecret = environment.accessKeySecret;
  private acsUrl = `${this.hostUrl}/riders/acs`;
  private hisUrl = `${this.hostUrlHis}/rider/patientByHn`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });

  // SECTION WARD
  getAcsByWard(ward: number) {
    const url = `${this.acsUrl}?ward=${ward}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getAcsByWId(Id: string) {
    const url = `${this.acsUrl}/${Id}/list`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  addAcsByWard(data: any) {
    return this.http.post<any>(this.acsUrl, data, {
      headers: this.headers,
    });
  }

  cancelAcsByWId(Id: number, comment:string) {
    const url = `${this.acsUrl}/${Id}/cancel`;
    const data = {
      comment:comment
    }
    return this.http.post<any>(url,data,{
        headers: this.headers,
      });
  }

  getPatientByHn(hn: string) {
    const data = {
        "hn":hn,
        "accessKeySecret": this.accessKeySecret
    }
    return this.http.post<any>(this.hisUrl, data, {
      headers: this.headers,
    });
  }

  getAcsByCenterGetJobs(type_oi: string, rxdate:string) {
    const url = `${this.acsUrl}/center?type_oi=${type_oi}&rxdate=${rxdate}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getAcsByCenterRiderJobs(type_oi: string, rxdate:string) {
    const url = `${this.acsUrl}/centerriderjob?type_oi=${type_oi}&rxdate=${rxdate}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  updateAcsByCenterRiderJobs(Id:string,data: any) {
    const url = `${this.acsUrl}/${Id}/centerrider`;

    return this.http.put<any>(url, data, {
      headers: this.headers,
    });
  }

  // รับงานและยืนยันปิดงาน
   async updateAcsByCenterGetAndConfirm(Id:string,data: any) :Promise<any>{
    const courses$ = this.http.put<any>(`${this.acsUrl}/${Id}/centergetandconfirm`, data, {
      headers: this.headers,
    });

    return await firstValueFrom(courses$)
  }

  getAcsByCenterMonitor(type_oi: string, rxdate:string, eddate:string,option:string,text:string) {
    const url = `${this.acsUrl}/centermonitor?type_oi=${type_oi}&rxdate=${rxdate}&eddate=${eddate}&option=${option}&text=${text}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

}
