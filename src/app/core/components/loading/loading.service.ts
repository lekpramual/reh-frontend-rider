import {Injectable, signal} from "@angular/core";
import { single } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {

  #loadingSignal = signal(false);

  loading = this.#loadingSignal.asReadonly()
  loadingOn(){
    this.#loadingSignal.set(true);
  }

  loaddingOff(){
    this.#loadingSignal.set(false);
  }
}
