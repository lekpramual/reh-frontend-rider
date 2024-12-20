import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "@env/environment";
import { GetUserListsResponse, User, UserList } from "@core/interface/user.model";
import { firstValueFrom } from "rxjs";
import { AcsGetJobList, AcsList, GetAcsListResponse } from "@core/interface/acs.interface";
import { SkipLoading } from "@core/components/loading/skip-loading.component";

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
      "Bearer " + localStorage.getItem(environment.ACCESS_TOKENS) || "no-token",
  });

  // SECTION WARD
  getAcsByWard(ward: number) {
    const url = `${this.acsUrl}?ward=${ward}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getAcsByWId(Id: string) {
    const url = `${this.acsUrl}/${Id}/list`;
    return this.http.get<any>(url, {
      headers: this.headers,
      context: new HttpContext().set(SkipLoading,true)
    });
  }

  async getAcsByWIdNew(Id: string):Promise<AcsList[]> {
    const url = `${this.acsUrl}/${Id}/list`;
    const results$ = this.http.get<GetAcsListResponse>(url, {
      headers: this.headers,
      context: new HttpContext().set(SkipLoading,true)
    });
    const response = await firstValueFrom(results$);
    return response.result;
  }

  addAcsByWard(data: any) {
    return this.http.post<any>(this.acsUrl, data, {
      headers: this.headers,
      context: new HttpContext().set(SkipLoading,true)
    });
  }

  cancelAcsByWId(Id: number, comment:string) {
    const url = `${this.acsUrl}/${Id}/cancel`;
    const data = {
      comment:comment
    }
    return this.http.post<any>(url,data,{
        headers: this.headers,
        context: new HttpContext().set(SkipLoading,true)
      });
  }

  getPatientByHn(hn: string) {
    const data = {
        "hn":hn,
        "accessKeySecret": this.accessKeySecret
    }
    return this.http.post<any>(this.hisUrl, data, {
      headers: this.headers,
      context: new HttpContext().set(SkipLoading,true)
    });
  }

  getAcsByCenterGetJobs(type_oi: string, rxdate:string) {
    const url = `${this.acsUrl}/center?type_oi=${type_oi}&rxdate=${rxdate}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  async getAcsByCenterGetJobNew(type_oi: string, rxdate:string):Promise<AcsGetJobList[]> {
    const url = `${this.acsUrl}/center?type_oi=${type_oi}&rxdate=${rxdate}`;
    const results$ = this.http.get<any>(url, { headers: this.headers });
    const response = await firstValueFrom(results$);
    return response.result;
  }

  getAcsByCenterRiderJobs(type_oi: string, rxdate:string) {
    const url = `${this.acsUrl}/centerriderjob?type_oi=${type_oi}&rxdate=${rxdate}`;
    return this.http.get<any>(url, { headers: this.headers,context: new HttpContext().set(SkipLoading,true) });
  }

  async getAcsByCenterRiderJobsNew(type_oi: string, rxdate:string):Promise<UserList[]> {
    const url = `${this.acsUrl}/centerriderjob?type_oi=${type_oi}&rxdate=${rxdate}`;
    const results$ = this.http.get<GetUserListsResponse>(url, {
       headers: this.headers ,
       context: new HttpContext().set(SkipLoading,true)
    });
    const response = await firstValueFrom(results$);
    return response.result;
  }

  updateAcsByCenterRiderJobs(Id:string,data: any) {
    const url = `${this.acsUrl}/${Id}/centerrider`;

    return this.http.put<any>(url, data, {
      headers: this.headers,
      context: new HttpContext().set(SkipLoading,true)
    });
  }

  // รับงานและยืนยันปิดงาน
   async updateAcsByCenterGetAndConfirm(Id:string,data: any) :Promise<any>{
    const courses$ = this.http.put<any>(`${this.acsUrl}/${Id}/centergetandconfirm`, data, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });

    return await firstValueFrom(courses$)
  }

  getAcsByCenterMonitor(type_oi: string, rxdate:string, eddate:string,option:string,text:string) {
    const url = `${this.acsUrl}/centermonitor?type_oi=${type_oi}&rxdate=${rxdate}&eddate=${eddate}&option=${option}&text=${text}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  async getAcsByCenterMonitorNew(type_oi: string, rxdate:string, eddate:string,option:string,text:string,persion:string,ward:string):Promise<AcsList[]> {
    const url = `${this.acsUrl}/centermonitor?type_oi=${type_oi}&rxdate=${rxdate}&eddate=${eddate}&option=${option}&text=${text}&person=${persion}&ward=${ward}`;
    const results$ = this.http.get<GetAcsListResponse>(url, { headers: this.headers });
    const response = await firstValueFrom(results$);
    return await response.result;
  }

  // Rider
  async getAcsByRiderMonitorNew(rider:number, rxdate:string):Promise<AcsList[]> {
    const url = `${this.acsUrl}/riderbydate?rider=${rider}&rxdate=${rxdate}`;
    const results$ = this.http.get<GetAcsListResponse>(url, { headers: this.headers });
    const response = await firstValueFrom(results$);
    return await response.result;
  }


   // รับงานและยืนยันปิดงาน
   async updateAcsByRiderGetJob(Id:string,data: any) :Promise<any>{
    const courses$ = this.http.put<any>(`${this.acsUrl}/${Id}/scanrider`, data, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });

    return await firstValueFrom(courses$)
  }


}
