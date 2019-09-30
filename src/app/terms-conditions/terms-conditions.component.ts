import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {

  constructor(private global:GlobalService) { }

  ngOnInit() {
    this.global.header = 2;
  }

}
