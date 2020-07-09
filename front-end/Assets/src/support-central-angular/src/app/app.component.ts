import { Component } from '@angular/core';
import { Widgets } from './models/widgets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  widgets: Widgets = window['psc'].widgets;
}
