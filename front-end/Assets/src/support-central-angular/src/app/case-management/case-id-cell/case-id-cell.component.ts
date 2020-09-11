import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { CaseManageService } from 'src/app/shared/services/case-manage.service';

@Component({
  selector: 'app-case-id-cell',
  templateUrl: './case-id-cell.component.html',
  styleUrls: ['./case-id-cell.component.scss']
})
export class CaseIdCellComponent implements OnInit, AgRendererComponent {
  
  caseNumber = null;
  caseId = null;

  constructor(public caseService: CaseManageService) { }

  ngOnInit() {
  }

  agInit(params) {
    this.caseNumber = params.value;
    this.caseId = params.data.Id;
  }

  refresh() {
    return true;
  }

}
