import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "@env/environment";

import { firstValueFrom } from "rxjs";
import { SkipLoading } from "@core/components/loading/skip-loading.component";
import { GetUserListResponse,UserList } from "@core/interface/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(private http: HttpClient) {}

  private hostUrl = environment.node_api_url;
  private apiUrl = `${this.hostUrl}/riders/user`;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + localStorage.getItem(environment.LOGIN_TOKENS) || "no-token",
  });


  async getUserByType(type:string) :Promise<UserList[]>{
    const url = `${this.apiUrl}/useractive?type=${type}`;
    const wards$ = this.http.get<GetUserListResponse>(url, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });
    const response = await firstValueFrom(wards$);
    return response.result;
  }
}
