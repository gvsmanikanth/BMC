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
  documentationOpened = false;
  unsubscribeObs$ = new Subject();
  tourRunning = false;
  intro = introJs();

  ngOnInit() {
    this.state.caseManagementOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.caseOpened = value;
      // if (value && this.tourRunning) {
      //   setTimeout(() => {
      //     console.log(this.intro);
      //     this.intro.nextStep();
      //   }, 800)
      // }
    });
    this.state.communitiesOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.communitiesOpened = value;
      // if (value && this.tourRunning) {
      //   setTimeout(() => {
      //     this.intro.nextStep();
      //   }, 800)
      // }
    });
    this.state.productDownloadsOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.downloadsOpened = value;
      // if (value && this.tourRunning) {
      //   setTimeout(() => {
      //     this.intro.nextStep();
      //   }, 800)
      // }
    });
    this.state.documentationOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.documentationOpened = value;
      // if (value && this.tourRunning) {
      //   setTimeout(() => {
      //     this.intro.nextStep();
      //   }, 800)
      // }
    });
    if (this.state.user.loggedIn === 'true') {
      let lastTimeGuestTourStarted = localStorage.getItem('guidedTour');
      if (lastTimeGuestTourStarted) {
        localStorage.removeItem('guidedTour');
        let dateDiff = new Date().getTime() - parseInt(lastTimeGuestTourStarted);
        if (dateDiff < 1000 * 3600 * 24) {
          setTimeout(() => {
            this.loggedInUserTour(true);
          }, 800)
        }
      }
    }
  }

  startTour() {
    if (this.state.user.loggedIn === 'true') {
      this.loggedInUserTour(false);
    } else {
      this.guestUserTour();
    }
  }

  loggedInUserTour(skipFirstStep: boolean) {
    this.tourRunning = true;
    this.intro.setOptions(
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
      this.intro.addStep({
        element: '#newUser a',
        intro: 'If you are a new user, the orientation checklist is a great place to start.'
      })//3
    } else {
      this.intro.addStep({
      element: '.psc-o-checklist .learn-more',
        intro: 'If you are a new user, the orientation checklist is a great place to start.'
      })//3
    }
    this.intro.addStep({
      element: '#searchbox',
      intro: 'Use the search box to find answers to your questions.'
    });//4
    this.intro.addStep({
      element: '#tile0 .tile-body',
      intro: 'Clicking here will lead to the fully detailed case management application.'
    });//5
    this.intro.addStep({
      element: '#tile0 .tile-arrow',
      intro: 'Click on the personalized view icon to go into a summary of your support cases.',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile0 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//6
    this.intro.addStep({
      element: '.extended-widget-body .btn-primary',
      intro: 'You can submit a new support case here.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          this.intro.goToStepNumber(10);
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
    this.intro.addStep({
      element: '.extended-widget-body .btn-secondary',
      intro: 'View all your cases in the fully detailed case management application.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          this.intro.goToStepNumber(6);
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
    this.intro.addStep({
      element: '#tile0 .tile-arrow',
      intro: 'Click here to exit the case management widget and go back to the homepage.',
      preChange: (step, ctx) => {
        if (!this.caseOpened) {
          this.intro.goToStepNumber(6);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('#tile0 .tile-arrow');
          if (!!element) {
            step.element = element;
            return true;
          } 
        }
      }
    });//9
    this.intro.addStep({
      element: '#tile1 .tile-arrow',
      intro: 'Click here to open the community widget.',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile1 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//10
    this.intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing your top 5 personalized products. This personalization is based on your favorite products and activity on BMC websites.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(16);
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
    this.intro.addStep({
      element:'.extended-widget-header .description a',
      intro: 'You can edit your favorite products and influence your personalization here.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(10);
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
    this.intro.addStep({
      element:'.tab-container .nav-pills',
      intro: 'Click on any tab to go to a particular community content type.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(10);
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
    this.intro.addStep({
      element:'adapt-accordion-tab:nth-child(2) .card',
      intro: 'Click on another product in the list to see that product\'s community content.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(10);
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
    this.intro.addStep({
      element: '.container .close-action',
      intro: 'Click the X here to close this widget and go back to the homepage.',
      position: 'left',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(10);
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
    this.intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to open a personalized view of Product downloads.',
      position: 'left',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile2 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//16
    this.intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing your top 5 personalized products. This personalization is based on your favorite products and activity on BMC websites.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(21);
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
    this.intro.addStep({
      element:'app-epd-product:first-child .epd-version:first-child',
      intro: 'You can click here to go straight to this product version\'s download page.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(16);
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
    this.intro.addStep({
      element:'.extended-widget-header .external-app-link',
      intro: 'Clicking here will lead to the full download center.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(16);
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
    this.intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to exit the Product Downloads widget and go back to the homepage.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(16);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('#tile2 .tile-arrow');
          if (!!element) {
            step.element = element;
            return true;
          }
        }
      }
    });//20
    this.intro.addStep({
      element:'.psc-news .news-container-wrapper',
      intro: 'Here you can see the latest support news and features. Click on any news item to read the news in detail.'
    });//21
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:first-child .psc-checklist-right',
      intro: 'If you are upgrading a BMC product, please click here to learn about the Amigo program.'
    });//22
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:nth-child(2) .psc-checklist-right',
      intro: 'You can click here to view the Support Central user guide in PDF format or online.'
    });//23
    this.intro.addStep({
      element:'.support-chat-now',
      intro: 'If you don\'t find an answer to your questions, please use the chat function.',
      preChange: (step, ctx) => {
        window.scrollTo(0,0);
        if (step.element.style.display === 'none') {
          this.intro.nextStep();
          ++ctx._currentStep;
          return false;
        } 
        return true;
      }
    });//24
    this.intro.addStep({
      element:'#feedbackTab',
      intro: 'If you have feedback for us about this new support homepage, please click here.',
      preChange: () => {
        window.scrollTo(0,0);
        return true;
      }
    });//25
    this.intro.onbeforechange(function (){
      if (!this._introItems.length || this._currentStep >= this._introItems.length) {
        return true
      } //in case it`s skipping start step or fix to keyboard control (IDK why it`s broken);
      if (this._introItems[this._currentStep].preChange) { // Now it is called on nextStep as _currentStep is set for next step;
        return this._introItems[this._currentStep].preChange(this._introItems[this._currentStep], this);
      } else {
        return true;
      }
    });
    this.intro.onexit(() => {
      this.tourRunning = false;
    })
    this.intro.start();
    if (skipFirstStep) {
      this.intro.nextStep();
    }
    
  }

  guestUserTour () {
    this.tourRunning = true;
    function resumeAfterLogin():void {
      localStorage.setItem('guidedTour', new Date().getTime().toString());
    };
    let loginButton = document.querySelector('.account-actions a[href="/available/supportlogin.html"]');
    if (!!loginButton) {
      loginButton.addEventListener('click', resumeAfterLogin);
    }
    this.intro.setOptions(
      {
        steps: [
          { 
            intro: 'Welcome to the new BMC Support Central homepage.',
          }, //1
          {
            element: '.account-actions-wrapper .layout-inner-wrap',
            intro: 'You can log in or register for a fully personalized experience or continue this tour as a guest user.'
          } //2
        ]
      }
    );
    this.intro.addStep({
      element: '.psc-o-checklist .learn-more',
        intro: 'If you are a new user, the orientation checklist is a great place to start.'
    });//3

    this.intro.addStep({
      element: '#searchbox',
      intro: 'Use the search box to find answers to your questions.'
    });//4

    this.intro.addStep({
      element: '#tile1 .tile-arrow',
      intro: 'Click here to open the community widget.',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile1 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//5
    this.intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing the 5 most popular BMC products.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(10);
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
    });//6
    this.intro.addStep({
      element:'.tab-container .nav-pills',
      intro: 'Click a tab to go to a particular content type.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(5);
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
    });//7
    this.intro.addStep({
      element:'adapt-accordion-tab:nth-child(2) .card',
      intro: 'Click on another product in the list to see that product\'s community content.',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(5);
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
    });//8
    this.intro.addStep({
      element: '.container .close-action',
      intro: 'Click the X here to close this widget and go back to the homepage.',
      position: 'left',
      preChange: (step, ctx) => {
        if (!this.communitiesOpened) {
          this.intro.goToStepNumber(5);
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
    });//9
    this.intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to open Product downloads widget.',
      position: 'left',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile2 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//10
    this.intro.addStep({
      element:'.extended-widget-body',
      intro: 'You are now seeing the 5 most popular BMC products.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(15);
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
    this.intro.addStep({
      element:'app-epd-product:first-child .epd-version:first-child',
      intro: 'You can click here to go straight to this product version\'s download page.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(10);
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
    });//12
    this.intro.addStep({
      element:'.extended-widget-header .external-app-link',
      intro: 'Clicking here will lead to the full download center.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(10);
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
    });//13
    this.intro.addStep({
      element:'#tile2 .tile-arrow',
      intro: 'Click here to exit the Product Downloads widget and go back to the homepage.',
      preChange: (step, ctx) => {
        if (!this.downloadsOpened) {
          this.intro.goToStepNumber(10);
          --ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('#tile2 .tile-arrow');
          if (!!element) {
            step.element = element;
            return true;
          }
        }
      }
    });//14
    this.intro.addStep({
      element: '#tile3 .tile-arrow',
      intro: 'Click on the \'personalized view\' icon of the Documentation widget in the widget list to view popular product documentation.',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile3 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//15
    this.intro.addStep({
      element: '.extended-widget-body',
      intro: 'You are now seeing the 5 most popular BMC products & their documentation.',
      preChange: (step, ctx) => {
        if (!this.documentationOpened) {
          this.intro.goToStepNumber(18);
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
    });//16
    this.intro.addStep({
      element: '.extended-widget-header .external-app-link',
      intro: 'Clicking here will lead to the full documentation website.',
      preChange: (step, ctx) => {
        if (!this.documentationOpened) {
          this.intro.goToStepNumber(15);
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
    });//17
    this.intro.addStep({
      element:'.psc-news .news-container-wrapper',
      intro: 'Here you can see the latest support news and features.Click on any one news card to read the news in detail.'
    });//18
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:first-child .psc-checklist-right',
      intro: 'If you are upgrading a BMC product, please click here & read about the Amigo program.'
    });//19
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:nth-child(2) .psc-checklist-right',
      intro: 'You can click here to view the Support Central user guide in PDF format or online.'
    });//20
    this.intro.addStep({
      element:'.support-chat-now',
      intro: 'If you don\'t find an answer to your questions, please use the chat function.',
      preChange: (step, ctx) => {
        window.scrollTo(0,0);
        if (step.element.style.display === 'none') {
          this.intro.nextStep();
          ++ctx._currentStep;
          return false;
        } 
        return true;
      }
    });//21
    this.intro.addStep({
      element:'#feedbackTab',
      intro: 'If you have feedback for us about this new support homepage, please click here.',
      preChange: () => {
        window.scrollTo(0,0);
        return true;
      }
    });//22
    this.intro.onbeforechange(function (step){
      console.log(this._currentStep, this);
      if (!this._introItems.length || this._currentStep >= this._introItems.length) {
        return true
      } //in case it`s skipping start step or fix to keyboard control (IDK why it`s broken)
      if (this._introItems[this._currentStep].preChange) {
        return this._introItems[this._currentStep].preChange(this._introItems[this._currentStep], this);
      } else {
        return true;
      }
    });
    this.intro.onexit(() => {
      this.tourRunning = false;
      if(!!loginButton) {
        loginButton.removeEventListener('click', resumeAfterLogin);
      }
    })
    this.intro.start();
  }


  ngOnDestroy() {
    this.unsubscribeObs$.next(true);
    this.unsubscribeObs$.complete();
  }
}
