import { Component, Input, OnInit } from '@angular/core';
import { SupportQuestion } from 'src/app/shared/models/questions/question.model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input('') question: SupportQuestion;
  truncated = false;
  constructor() { }

  ngOnInit() {
  }

  toggleTruncate() {
    this.truncated = !this.truncated;
  }

}
