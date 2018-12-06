import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';
import { TicketElf } from './ticket-elf';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AppSettingsService } from '../services/app-settings.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrlRoot: string;
  constructor(private http: HttpClient
    , private messageService: MessageService
    , private appsettingsService: AppSettingsService) {
    this.apiUrlRoot = appsettingsService.AppSettings.ApiUrlRoot;
  }

  save(row: TicketElf) {
    return this.http.post(this.apiUrlRoot.concat('ticket'), row, httpOptions)
      .pipe(
        catchError(this.handleError('save', {}))
      );
  }
  getList(): Observable<TicketElf[]> {
    return this.http.get<TicketElf[]>(this.apiUrlRoot.concat('ticket'))
      .pipe(
        catchError(this.handleError('getList', []))
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
        case 400: // #BadRequest, 通常指參數錯誤
          this.log('400服務不存在');
          break;
        case 401: // #Unauthorized();
          this.log('401未授權');
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
        case 0: // #存取跨Domain的Server時, 伺服器沒啟動或是沒有啟用CORS
          this.log('0伺服器無回應');
          break;
        default: // #其他
          this.log(`${operation} status:${error.status} failed: ${error.message}`);
          break;
      }
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`TicketService: ${message}`);
  }
}
