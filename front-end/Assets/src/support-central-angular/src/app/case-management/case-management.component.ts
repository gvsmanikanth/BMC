import { Component, OnDestroy, OnInit } from '@angular/core';
import { Case } from '../shared/models/case/case.model';
import { CaseManageService } from '../shared/services/case-manage.service';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss']
})
export class CaseManagementComponent implements OnInit, OnDestroy {

  casesChunk: Case[] = null;

  constructor(
    public caseService: CaseManageService, 
    public state: StateService,
    private ga: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.caseService.getCases().then(() => {
      this.casesChunk = this.caseService.cases.slice(0,4);
    });
    this.state.caseManagementOpened$.next(true);
  }

  paginate(event) {
    this.casesChunk = this.caseService.cases.slice(event.first, event.first + +event.rows);
    this.ga.sendEvent('click', 'case managment', 'pagination');
  }

  sendCaseManagment(name: string) {
    this.ga.sendEvent('widget click', name, 'open resourse');
  } 

  submitCase() {
    this.ga.sendEvent('submit', 'case managment', 'new case');
  }

  getViews() {
    this.ga.sendEvent('view click', 'case managment', 'all cases');
  }

  sendCase(caseNumber: string, caseName: string) {
    this.ga.sendEvent('case click', caseNumber, caseName);
  }

  ngOnDestroy () {
    this.state.caseManagementOpened$.next(false);
  }
}
