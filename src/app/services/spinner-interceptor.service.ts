import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable()
export class SpinnerInterceptorService implements HttpInterceptor {

  constructor(
    private spinnerService: SpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this.spinnerService.start();
    return next.handle(req).pipe(
      tap(data => {
        if (data instanceof HttpResponse) {
          this.spinnerService.stop();
        }
      }, err => {
        this.spinnerService.stop();
      })
    );
  }

}
