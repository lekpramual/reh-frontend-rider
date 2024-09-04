import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) { }

  loadConfig(): Observable<any> {
    return this.http.get('/assets/config/config.json').pipe(
      tap(config => this.config = config),
      catchError(() => of({})) // Handle errors here if necessary
    );
  }
  // loadConfig(): Observable<any> {
  //   return this.http.get('../../../assets/config/config.json');
  // }

  getConfig(): any {
    return this.config;
  }

  setConfig(config: any): void {
    this.config = config;
  }


  getTitleApp(): string {
    return this.config?.titleApp || 'N/A';
  }

  // getFeatureFlag(): boolean {
  //   return this.config?.featureFlag || false;
  // }

  // getVersion(): string {
  //   return this.config?.version || 'N/A';
  // }
}
