import { Injectable } from '@angular/core';
import { SupportQuestion } from '../../models/questions/question.model';
import { DataFetchService } from '../data-fetch.service';

@Injectable()
export class SupportQuestionsService {
  questions: SupportQuestion[] = [];
  busyConfig = {
    busy: true,
    backdrop: false,
    loaderType: 'section',
    message: 'Loading'
  }
  constructor(private dataFetch: DataFetchService) { }

  getQuestions() {
    return this.dataFetch.getQuestions().then((response) => {
              this.questions = response;
              this.busyConfig.busy = false;
            }).catch(() => {
              this.busyConfig.busy = false;
            })
    }
}
