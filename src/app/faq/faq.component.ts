import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private global:GlobalService) { }

  ngOnInit() {
    this.global.header = 2;
  }

}
