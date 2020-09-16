import { Component, OnInit } from '@angular/core';
import { DocsService } from '../shared/services/docs.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  widgets = window['psc'].widgets;

  constructor(public docsService: DocsService) { }

  ngOnInit() {
    this.docsService.loadDocs();
  }

}
