import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import { SkipLoading } from "@core/components/loading/skip-loading.component";

@Injectable({
  providedIn: "root",
})
export class OpdTypeService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private apiUrl = `${this.hostUrl}/riders/opdtype/active`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.ACCESS_TOKENS) || "no-token",
  });


  getOpdType() {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });
  }
}
