import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";

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

  getAcsByWId(Id: number) {
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
    return this.http.post<any>(url,{
      body: {
        comment:comment
      }
      },{
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
}
