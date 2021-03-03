import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-services-and-consulting',
  templateUrl: './services-and-consulting.component.html',
  styleUrls: ['./services-and-consulting.component.scss']
})
export class ServicesAndConsultingComponent implements OnInit {

  constructor(public state: StateService) { }

  ngOnInit() {
  }

}
