import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
@Component({
  selector: 'app-buyer-intro',
  templateUrl: './buyer-intro.component.html',
  styleUrls: ['./buyer-intro.component.css']
})
export class BuyerIntroComponent implements OnInit {

  constructor(private global:GlobalService) { }

  ngOnInit() {
    this.global.header = 2;
  }

}
