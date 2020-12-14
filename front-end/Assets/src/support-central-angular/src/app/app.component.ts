import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { WidgetsLinks } from './shared/models/widgets-links.model';
import { trigger, state, style, transition, animate, query, stagger, group, animateChild } from '@angular/animations';
import { widgets }  from "./shared/data/widgets";
import { Widget } from './shared/models/widget.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('openCloseMobile', [
      transition(':enter', [
        style({
          'height': '0px',
          'overflow': 'hidden'
        }),
        animate('0.5s',style({
          'height': '730px'
        }))
      ])
    ]),
    trigger('openCloseRouter', [
      state('open', style({
        width: '70%',
        opacity: '1'
      })),
      state('closed', style({
        width:'0',
        opacity: '0'
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
          query('app-tile', animate('0s 0.2s', style({
            'margin-bottom': '210px'
          }))),
          query('app-tile:nth-child(3n+2)', animate('0s 0.2s ease', style({
            transform: 'translate(-108%, 138%)'
          }))),
          query('app-tile:nth-child(3n+3)', animate('0s 0.2s ease', style({
            transform: 'translate(-216%, 276%)'
          }))),
          query('app-tile', animate('0.3s 0.2s', style({
            transform: 'translate(0, 0)',
            'margin-bottom': '0'
          }))),
        ]),
      ]),
      transition('open => closed', [
        group([
          query('app-tile', animate('0.3s ease', style({
            'margin-bottom': '210px'
          }))),
          query('app-tile:nth-child(3n+2)', animate('0.3s ease', style({
            transform: 'translate(-108%, 138%)'
          }))),
          query('app-tile:nth-child(3n+3)', animate('0.3s ease', style({
            transform: 'translate(-216%, 276%)'
          }))),
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit{

  @ViewChild('tileBlock', { static: false }) tileBlock;

  mobile = false;
  widgetLinks: WidgetsLinks = window['psc'].widgets;
  userLoggedIn = window['psc'].user.loggedIn === "true";
  widgets: Widget[] = widgets;
  isExtendedOpen = false;
  openedWidget: number = widgets.length;

  viewOptions = [
    {
      id: 0,
      name: 'Version 1'
    },
    {
      id: 1,
      name: 'Version 2'
    },
    {
      id:2,
      name: 'Version 3'
    }
  ]
  viewVersion = [0];

  constructor (private cdr: ChangeDetectorRef) {}
  @HostListener("window:resize", [])
  onResize() {
    this.detectScreenSize();
  }
  
  ngOnInit () {
    widgets.forEach((widget)=> {
      widget.href = this.widgetLinks[widget.id];
      if (widget.id === "manageCase") {
        if (!this.userLoggedIn) {
          widget.routerLink = null;
        }
      }
    })
    this.cdr.detectChanges()
  }

  ngAfterViewInit () {
    this.detectScreenSize();
  }

  detectScreenSize() {
    if (window.innerWidth < 1200) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.cdr.detectChanges();
  }


  toggleExtended(index) {
    if (this.openedWidget === index) {
      this.isExtendedOpen = false;
      this.openedWidget = widgets.length;
    } else {
      this.isExtendedOpen = true;
      if (this.openedWidget !== this.widgets.length) {
        this.widgets[this.openedWidget].isExtended = false;
      }
      this.openedWidget = index;
    }
    this.cdr.detectChanges()
    setTimeout(() => {
      let el = document.getElementById("tile" + index);
      if (el) {
       let top = el.offsetTop;
       this.tileBlock.nativeElement.scrollTop = top;
      }
    },600);
  }

  closeWidgets() {
    this.isExtendedOpen = false;
    this.openedWidget = this.widgets.length;
    this.widgets.forEach((widget) => {
      widget.isExtended = false;
    })
  }
}
