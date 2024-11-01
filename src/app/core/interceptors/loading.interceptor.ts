import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../components/loading/loading.service";
import { finalize } from "rxjs";
import { SkipLoading } from "../components/loading/skip-loading.component";

export const loadingIntercaptor:HttpInterceptorFn =
(req: HttpRequest<unknown>, next: HttpHandlerFn) =>{

  if(req.context.get(SkipLoading)){
    return next(req);
  }

  console.log('req >>>',req)

  const loadingService = inject(LoadingService);
  loadingService.loadingOn();
  return next(req)
  .pipe(
    finalize(() => {

      setTimeout(() => {
        loadingService.loaddingOff();
      }, 1000);
    })
  )

}
