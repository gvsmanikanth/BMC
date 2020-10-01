import { Component, OnInit } from '@angular/core';
import { Case } from '../shared/models/case/case.model';
import { CaseManageService } from '../shared/services/case-manage.service';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss']
})
export class CaseManagementComponent implements OnInit {

  widgets = window['psc'].widgets;
  casesChunk: Case[] = [];

  constructor(public caseService: CaseManageService) { }

  ngOnInit() {
    this.caseService.getCases().then(() => {
      this.casesChunk = this.caseService.cases.slice(0,4);
    })
  }

  paginate(event) {
    this.casesChunk = this.caseService.cases.slice(event.first, event.first + +event.rows);
  }

}
