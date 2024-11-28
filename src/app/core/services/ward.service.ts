import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "@env/environment";
import { User } from "@core/interface/user.model";
import { GetWardListResponse, GetWardsResponse, WardCreate, WardCreateForm, WardList, WardListNew } from "@core/interface/ward.interface";
import { firstValueFrom } from "rxjs";
import { SkipLoading } from "@core/components/loading/skip-loading.component";

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
      "Bearer " + localStorage.getItem(environment.ACCESS_TOKENS) || "no-token",
  });


  getWards() {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
     });
  }

  async getWardsNew() :Promise<WardListNew[]>{
    const url = `${this.apiUrl}`;
    const wards$ = this.http.get<GetWardListResponse>(url, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });
    const response = await firstValueFrom(wards$);
    return response.result;
  }

  async getWardLists() :Promise<WardListNew[]>{
    const url = `${this.apiUrl}`;
    const wards$ = this.http.get<GetWardListResponse>(url, {
      headers: this.headers
    });
    const response = await firstValueFrom(wards$);
    return response.result;
  }

  async createWard(ward:Partial<WardCreateForm>): Promise<WardCreateForm>{
    const ward$ = this.http.post<WardCreateForm>(`${this.apiUrl}`,ward, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    })
    return await firstValueFrom(ward$)
  }

   async updateWard(Id:string,ward:Partial<WardCreateForm>) :Promise<WardCreateForm>{
    const courses$ = this.http.put<WardCreateForm>(`${this.apiUrl}/${Id}/edit`, ward, {
      headers: this.headers,
      context:new HttpContext().set(SkipLoading,true)
    });

    return await firstValueFrom(courses$)
  }
}
