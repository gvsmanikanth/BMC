import { Component, OnInit } from '@angular/core';
import { Widgets } from './models/widgets';
import { trigger, state, style, transition, animate, query, stagger, group } from '@angular/animations';
import { AdaptDeviceDetectionService } from '@bmc-ux/adapt-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('openCloseRouter', [
      state('open', style({
        width: '70%'
      })),
      state('closed', style({
        width:'0'
      })),
      transition('closed => open', [
        animate('0.2s 0.3s')
      ]),
      transition('open => closed', [
        animate('0.2s')
      ])
    ]),
    trigger('openCloseTiles', [
      state('open', style({
        width: '100%'
      })),
      state('closed', style({
        width:'30%'
      })),
      transition('closed => open', [
        animate('0.01s 0.2s'),
        group([
          query('.tile', animate('0s 0.2s', style({
            'margin-bottom': '210px'
          }))),
          query('.tile:nth-child(3n+2)', animate('0s 0.2s', style({
            transform: 'translate(-108%, 138%)'
          }))),
          query('.tile:nth-child(3n+3)', animate('0s 0.2s', style({
            transform: 'translate(-216%, 276%)'
          }))),
          query('.tile', animate('0.3s 0.2s', style({
            transform: 'translate(0, 0)',
            'margin-bottom': '0'
          }))),
        ]),
      ]),
      transition('open => closed', [
        query('.tile', style({
          'margin-bottom': '210px'
        })),
        group([
          query('.tile:nth-child(3n+2)', animate('0.3s ease', style({
            transform: 'translate(-108%, 138%)'
          }))),
          query('.tile:nth-child(3n+3)', animate('0.3s ease', style({
            transform: 'translate(-216%, 276%)'
          }))),
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit{
  constructor (private deviceDetectionService: AdaptDeviceDetectionService) {}
  widgets: Widgets = window['psc'].widgets;
  isExtendedOpen = false;
  ngOnInit () {

  }
  toggleExtended() {
    this.isExtendedOpen = !this.isExtendedOpen;
  }
}
