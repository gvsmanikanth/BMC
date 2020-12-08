import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  widgets = window['psc'].widgets;
  user = window['psc'].user;
  hasUserActivity = true;

  constructor() { 

  }
}
