import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import * as introJs from 'intro.js/intro.js'
import { Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators'

@Component({
  selector: 'app-guided-tour',
  templateUrl: './guided-tour.component.html',
  styleUrls: ['./guided-tour.component.scss']
})
export class GuidedTourComponent implements OnInit {

  constructor(public state: StateService) { }
  
  caseOpened = false;
  communitiesOpened = false;
  downloadsOpened = false;
  unsubscribeObs$ = new Subject();

  ngOnInit() {
    this.state.caseManagementOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.caseOpened = value;
    });
    this.state.communitiesOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.communitiesOpened = value;
    });
    this.state.productDownloadsOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.downloadsOpened = value;
    });

  }

  loggedInUserTour() {
    let intro = introJs();
    intro.setOptions(
      {
        steps: [
          { 
            intro: 'Welcome to the new BMC Support Central homepage.'
          }, //1
          {
            element: '.account-actions-wrapper .layout-inner-wrap',
            intro: 'You are already logged in. This ensures a fully personalized experience.'
          }//2
        ]
      }
    );
    if (!!document.getElementById('newUser')) {
      intro.addStep({
        element: '#newUser a',
        intro: 'If you are a new user, the orientation checklist is a great place to start.'
      })//3
    } else {
      intro.addStep({
        element: '.psc-o-checklist .learn-more',
        intro: 'If you are a new user, the orientation checklist is a great place to start.'
      })//3
    }
    intro.addStep({
      element: '#searchbox',
      intro: 'Use the search box to find answers to your questions.'
    });//4
    intro.addStep({
      element: '#tile0 .tile-body',
      intro: 'Clicking here will lead to the fully detailed case management application.'
    });//5
    intro.addStep({
      element: '#tile0 .tile-arrow',
      intro: 'Click on the personalized view icon to go into a summary of your support cases.',
    });//6
    intro.addStep({
      element: '.extended-widget-body .btn-primary',
      intro: 'You can submit a new support case here.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          intro.goToStepNumber(10);
          ++ctx._currentStep
          return false;
        } else {
          let element = document.querySelector('.extended-widget-body .btn-primary');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//7
    intro.addStep({
      element: '.extended-widget-body .btn-secondary',
      intro: 'View all your cases in the fully detailed case management application.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          intro.goToStepNumber(6);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-body .btn-secondary');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//8
    intro.addStep({
      element: '#tile0 .tile-arrow',
      intro: 'Click here to exit the case management widget and go back to the homepage.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          intro.goToStepNumber(6);
          --ctx._currentStep;
          return false;
        }
      }
    });//9
    intro.addStep({
      element: '#tile1 .tile-arrow',
      intro: 'Click here to open the community widget.'
    });//10
    intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing your top 5 personalized products. This personalization is based on your favorite products and activity on BMC websites.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          intro.goToStepNumber(16);
          ++ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-body');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//11
    intro.addStep({
      element:'.extended-widget-header .description a',
      intro: 'You can edit your favorite products and influence your personalization here.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          intro.goToStepNumber(10);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-header .description a');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//12
    intro.addStep({
      element:'.tab-container .nav-pills',
      intro: 'Click a tab to go to a particular content type.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          intro.goToStepNumber(10);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.tab-container .nav-pills');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//13
    intro.addStep({
      element:'adapt-accordion-tab:nth-child(2) .card',
      intro: 'Click on another product in the list to see that product\'s community content.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          intro.goToStepNumber(10);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('adapt-accordion-tab:nth-child(2) .card');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          } 
        }
      }
    });//14
    intro.addStep({
      element: '.container .close-action',
      intro: 'Click the X here to close this widget and go back to the homepage.',
      position: 'left',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          intro.goToStepNumber(10);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.container .close-action');
          if (!!element) {
            step.element = element;
            step.position = 'left';
            return true;
          }
        }
      }
    });//15
    intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to open a personalized view of Product downloads.',
      position: 'left'
    });//16
    intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing your top 5 personalized products. This personalization is based on your favorite products and activity on BMC websites.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          intro.goToStepNumber(21);
          ++ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-body');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          }
        }
      }
    });//17
    intro.addStep({
      element:'app-epd-product:first-child .epd-version:first-child',
      intro: 'You can click here to go straight to this product version\'s download page.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          intro.goToStepNumber(16);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('app-epd-product:first-child .epd-version:first-child');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          }
        }
      }
    });//18
    intro.addStep({
      element:'.extended-widget-header .external-app-link',
      intro: 'Clicking here will lead to the full download center.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          intro.goToStepNumber(16);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-header .external-app-link');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            return true;
          }
        }
      }
    });//19
    intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to exit the Product Downloads widget and go back to the homepage.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          intro.goToStepNumber(16);
          --ctx._currentStep;
          return false;
        }
      }
    });//20
    intro.addStep({
      element:'.psc-news .news-container-wrapper',
      intro: 'Here you can see the latest support news and features.Click on any one news card to read the news in detail.'
    });//21
    intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:first-child .psc-checklist-right',
      intro: 'If you are upgrading a BMC product, please click here & read about the Amigo program.'
    });//22
    intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:nth-child(2) .psc-checklist-right',
      intro: 'You can click here to view the Support Central user guide in PDF format or online.'
    });//23
    intro.addStep({
      element:'.support-chat-now',
      intro: 'If you don\'t find an answer to your questions, please use the chat function.'
    });//24
    intro.addStep({
      element:'#feedbackTab',
      intro: 'If you have feedback for us about this new support homepage, please click here.'
    });//25
    intro.start();
    intro.onbeforechange(function (step){
      console.log(this._currentStep);
      console.log(this._currentStepNumber);
      if (this._introItems[this._currentStep].preChange) {
        console.log(this._introItems[this._currentStep])
        return this._introItems[this._currentStep].preChange(this._introItems[this._currentStep], this);
      } else {
        return true;
      }
    })
  }


  ngOnDestroy() {
    this.unsubscribeObs$.next(true);
    this.unsubscribeObs$.complete();
  }
}
