import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';
import { TicketElf } from './ticket-elf';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  save(row: TicketElf) {
    return this.http.post('api/ticket', row, httpOptions)
      .pipe(
        catchError(this.handleError('save', {}))
      );
  }
  getList(): Observable<TicketElf[]> {
    return this.http.get<TicketElf[]>('api/ticket')
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
