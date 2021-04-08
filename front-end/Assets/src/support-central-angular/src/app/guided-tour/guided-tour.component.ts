import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import * as introJs from 'intro.js/intro.js'
import { Observable, Subject } from 'rxjs';
import {debounceTime, take, takeUntil, takeWhile} from 'rxjs/operators'

@Component({
  selector: 'app-guided-tour',
  templateUrl: './guided-tour.component.html',
  styleUrls: ['./guided-tour.component.scss']
})
export class GuidedTourComponent implements OnInit {

  constructor(public state: StateService) { }
  
  caseOpened = false;
  communitiesOpened = false;
  communitiesLoaded = false;
  downloadsOpened = false;
  downloadsLoaded = false;
  documentationOpened = false;
  documentationLoaded = false;
  unsubscribeObs$ = new Subject();
  skipStep$ = new Subject();
  tourRunning = false;
  tourPaused = false;
  intro = introJs();

  ngOnInit() {
    this.state.caseManagementOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.caseOpened = value;
      if (this.tourRunning) {
        this.skipStep$.next();
      }
    });
    this.state.communitiesOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.communitiesOpened = value;
      if (this.tourRunning) {
        this.skipStep$.next();
      }
    });
    this.state.productDownloadsOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.downloadsOpened = value;
      if (this.tourRunning) {
        this.skipStep$.next();
      }
    });
    this.state.documentationOpened$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.documentationOpened = value;
      if (this.tourRunning) {
        this.skipStep$.next();
      }
    });
    this.state.communitiesDownloaded$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.communitiesLoaded = value;
    })
    this.state.documentationDownloaded$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.documentationLoaded = value;
    })
    this.state.productDownloadsDownloaded$.pipe(takeUntil(this.unsubscribeObs$)).subscribe((value) => {
      this.downloadsLoaded = value;
    })

    this.skipStep$.pipe(debounceTime(200), takeUntil(this.unsubscribeObs$)).subscribe(() => {
      setTimeout(() => {
        this.intro.nextStep();
      }, 600)
    })

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
    let self = this;
    this.intro.setOptions(
      {
        steps: [
          { 
            intro: 'Welcome to the new BMC Support Central homepage.'
          }, //1
          {
            element: '.psc-account-actions',
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
            if (!this.communitiesLoaded) {
              this.pauseIntro(step, 11, this.state.communitiesDownloaded$);
            }
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
            if (!this.downloadsLoaded) {
              this.pauseIntro(step, 17, this.state.productDownloadsDownloaded$);
            }
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
      if (self.tourPaused) {
        return false;
      }
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
      this.tourPaused = false;
    })
    this.intro.start();
    if (skipFirstStep) {
      this.intro.nextStep();
    }
    
  }

  guestUserTour () {
    this.tourRunning = true;
    let self = this;
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
            element: '.psc-account-actions',
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
              if (!this.communitiesLoaded) {
                this.pauseIntro(step, 6, this.state.communitiesDownloaded$);
              }
              return true;
            }
        }
      }
    });//6
    this.intro.addStep({
      element:'.tab-container .nav-pills',
      intro: 'Click on any tab to go to a particular community content type.',
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
      element: '#tile3 .tile-arrow',
      intro: 'Click on the \'personalized view\' icon of the Documentation widget in the widget list to view popular product documentation.',
      preChange: (step, ctx) =>  {
        let element = document.querySelector('#tile3 .tile-arrow');
        if (!!element) {
          step.element = element;
          return true;
        } 
      }
    });//10
    this.intro.addStep({
      element: '.extended-widget-body',
      intro: 'You are now seeing the 5 most popular BMC products & their documentation.',
      preChange: (step, ctx) => {
        if (!this.documentationOpened) {
          this.intro.goToStepNumber(13);
          ++ctx._currentStep;
          return false;
        } else {
          let element = document.querySelector('.extended-widget-body');
          if (!!element) {
            step.element = element;
            step.position = 'bottom';
            if (!this.documentationLoaded) {
              this.pauseIntro(step, 11, this.state.documentationDownloaded$)
            }
            return true;
          }
        }
      }
    });//11
    this.intro.addStep({
      element: '.extended-widget-header .external-app-link',
      intro: 'Clicking here will lead to the full documentation website.',
      preChange: (step, ctx) => {
        if (!this.documentationOpened) {
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
    });//12
    this.intro.addStep({
      element:'.psc-news .news-container-wrapper',
      intro: 'Here you can see the latest support news and features. Click on any news item to read the news in detail.'
    });//13
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:first-child .psc-checklist-right',
      intro: 'If you are upgrading a BMC product, please click here to learn about the Amigo program.'
    });//14
    this.intro.addStep({
      element:'.psc-orientation-checklist .psc-fs-12:nth-child(2) .psc-checklist-right',
      intro: 'You can click here to view the Support Central user guide in PDF format or online.'
    });//15
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
    });//16
    this.intro.addStep({
      element:'#feedbackTab',
      intro: 'If you have feedback for us about this new support homepage, please click here.',
      preChange: () => {
        window.scrollTo(0,0);
        return true;
      }
    });//17
    this.intro.onbeforechange(function (step){
      if (self.tourPaused) {
        return false;
      }
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
      this.tourPaused = false;
      if(!!loginButton) {
        loginButton.removeEventListener('click', resumeAfterLogin);
      }
    })
    this.intro.start();
  }

  pauseIntro(step: any, resumeStepNumber: number, exitClause: Observable<boolean>) { //Intro do not allow add steps while running, so I am replacing step with loading html, and then back
    let previousStep = {...step};
    this.tourPaused = true;
    step.intro = '<div class="psc-tour-loading-text"><span class="psc-loading-icon"></span>Please wait...</div>';
    step.position = "floating";
    step.element = document.querySelector('.introjsFloatingElement');
    let buttons: HTMLElement = document.querySelector('.introjs-tooltipbuttons');
    buttons.style.display = 'none';
    exitClause.pipe(takeWhile((e) => !e, true)).subscribe((value) => { //subscribe while widget isn`t loaded.
      if (value) {
        buttons.style.display = 'block';
        step.intro = previousStep.intro;
        this.tourPaused = false;
        setTimeout(() => {
          this.intro.goToStepNumber(resumeStepNumber);
        }, 300)
      }
    })
  }


  ngOnDestroy() {
    this.unsubscribeObs$.next(true);
    this.unsubscribeObs$.complete();
  }
}
