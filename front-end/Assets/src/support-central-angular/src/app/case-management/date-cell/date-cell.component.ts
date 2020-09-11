import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.scss']
})
export class DateCellComponent implements OnInit, AgRendererComponent {

  date = null;

  constructor() { }

  ngOnInit() {
  }

  agInit(params) {
    this.date = params.value
  }

  refresh() {
    return true;
  }

}
