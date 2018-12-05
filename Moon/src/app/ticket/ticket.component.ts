import { Component, OnInit } from '@angular/core';
import { TicketService } from './ticket.service';
import { TicketElf } from './ticket-elf';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  mainForm = this.fb.group({
    ID: [0, Validators.required],
    Name: ['', Validators.required],
    Seat: ['', Validators.required],
    Amount: [0, Validators.required],
    DateTime: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private ticketService: TicketService) { }
  list: TicketElf[] = [];
  ngOnInit() {
    this.resetForm();
    this.getList();
  }
  getList() {
    this.ticketService.getList()
      .subscribe(list => {
        list.forEach(p => {
          // #日期要轉型
          p.DateTime = new Date(p.DateTime);
        });
        this.list = list;
      });
  }
  save() {
    this.ticketService.save(this.mainForm.value)
      .subscribe(_ => this.getList());
  }
  resetForm() {
    this.mainForm.patchValue({
      ID: 0,
      Name: '',
      Seat: '',
      Amount: 0,
      DateTime: new Date()
    });
  }
}
