import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  constructor(private http: HttpClient, private messageService: MessageService) { }
  getList(): Observable<string[]> { // #200
    return this.http.get<string[]>('api/values')
      .pipe(
        catchError(this.handleError('getList', []))
      );
  }
  getNotFound(): Observable<{}> { // #404
    return this.http.get<{}>('values')
      .pipe(
        catchError(this.handleError('getNotExists', {}))
      );
  }
  getBadRequest(): Observable<{}> { // #400
    return this.http.get<{}>('api/values/error')
      .pipe(
        catchError(this.handleError('getBadRequest', {}))
      );
  }
  getNotExists(): Observable<{}> { // #200 Error
    return this.http.get<{}>('api/value')
      .pipe(
        catchError(this.handleError('getNotExists', {}))
      );
  }
  getException(): Observable<{}> {
    return this.http.get<{}>('api/values/exception')
      .pipe(
        catchError(this.handleError('getException', {}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      switch (error.status) {
        case 200: // #URL錯了
          this.log('200服務不存在');
          break;
        // case 204: // #NoContent
        //   break;
        case 400: // #BadRequest
          this.log('400服務不存在');
          break;
        case 404: // #NotFound
          this.log('404服務不存在');
          break;
        case 500: // #Excpetion
          this.log('500服務發生未知錯誤');
          break;
        case 504: // #Server沒啟動
          this.log('504伺服器無回應');
          break;
        default: // #其他
          this.log(`${operation} failed: ${error.message}`);
          break;
      }
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`ValuesService: ${message}`);
  }
}
