import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { CaseManageService } from '../shared/services/case-manage.service';
import { CaseIdCellComponent } from './case-id-cell/case-id-cell.component';
import { DateCellComponent } from './date-cell/date-cell.component';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.scss']
})
export class CaseManagementComponent implements OnInit {

  widgets = window['psc'].widgets;
  gridApi: GridApi = null;
  frameworkComponents = null;
  columnDefs = [
    { headerName: 'Case Number', field: 'CaseNumber', cellRenderer: 'caseIdRenderer', width: 140 },
    { headerName: 'Subject', field: 'Subject', width: 120 },
    { headerName: 'Product', field: 'ProductName', width: 120 },
    { headerName: 'Created', field: 'CreatedDate', cellRenderer: 'dateCellRenderer', width: 150 },
    { headerName: 'Modified', field: 'LastModifiedDate', cellRenderer: 'dateCellRenderer', width: 150 },
    { headerName: 'Status', field: 'Status'},

  ]

  constructor(public caseService: CaseManageService, private cdr: ChangeDetectorRef) {
    this.frameworkComponents = {
      dateCellRenderer: DateCellComponent,
      caseIdRenderer: CaseIdCellComponent
    }
   }

  ngOnInit() {
    this.caseService.getCases()
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.cdr.detectChanges();
  }

}
