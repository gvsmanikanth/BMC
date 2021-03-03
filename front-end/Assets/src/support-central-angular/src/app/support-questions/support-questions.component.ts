import { Component, OnInit } from '@angular/core';
import { SupportQuestion } from '../shared/models/questions/question.model';
import { StateService } from '../shared/services/state.service';
import { SupportQuestionsService } from '../shared/services/support-questions/support-questions.service';

@Component({
  selector: 'app-support-questions',
  templateUrl: './support-questions.component.html',
  styleUrls: ['./support-questions.component.scss']
})
export class SupportQuestionsComponent implements OnInit {

  questionsChunk: SupportQuestion[] = null;

  constructor(public questionsService: SupportQuestionsService, public state: StateService) { }

  ngOnInit() {
    this.questionsService.getQuestions().then(() => {
      this.questionsChunk = this.questionsService.questions.slice(0,4)
    });
  }

  paginate(event) {
    this.questionsChunk = this.questionsService.questions.slice(event.first, event.first + +event.rows);
  }

}
