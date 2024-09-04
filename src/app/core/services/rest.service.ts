import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class AssetsService {
  public assets() {
    return `${environment.baseUrl}/assets`;
  }
}
