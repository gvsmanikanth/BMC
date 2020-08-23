import { Component, OnInit } from '@angular/core';
import { EPDService } from '../shared/services/epd.service';

@Component({
  selector: 'app-epd-component',
  templateUrl: './epd-component.component.html',
  styleUrls: ['./epd-component.component.scss']
})
export class EpdComponentComponent implements OnInit {

  widgets = window['psc'].widgets;

  loggedIn = false;

  constructor(public epdService: EPDService) { }

  ngOnInit() {
    this.epdService.getProducts();
  }

}
