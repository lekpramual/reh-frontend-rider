// menu.service.ts
import { Injectable } from '@angular/core';

import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root',
})
export class AssetsService {

  public assets(filename: string): string {
    console.log('filename >>>',filename)
    return `${environment.baseUrl}/assets/${filename}`;
  }
}
