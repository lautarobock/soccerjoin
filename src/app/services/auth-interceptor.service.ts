import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Session } from './session.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private session: Session) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    if (req.url.startsWith(environment.backendUrl) && this.session.token()) {
      const authReq = req.clone({
        headers: req.headers.set('x-access-token',this.session.token())
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }

}
