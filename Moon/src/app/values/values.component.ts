import { Component, OnInit } from '@angular/core';
import { ValuesService } from './values.service';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss']
})
export class ValuesComponent implements OnInit {

  list: string[];
  constructor(private valuesService: ValuesService) { }

  ngOnInit() {
    this.getList();
  }
  getList() {
    this.valuesService.getList()
      .subscribe(list => {
        this.list = list;
      });
  }
  getNotFound() {
    this.valuesService.getNotFound()
      .subscribe();
  }
  getBadRequest() {
    this.valuesService.getBadRequest()
      .subscribe();
  }
  getNotExists() {
    this.valuesService.getNotExists()
      .subscribe();
  }
  getException() {
    this.valuesService.getException()
      .subscribe();
  }
}
