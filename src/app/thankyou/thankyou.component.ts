import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  constructor(private global:GlobalService) { }
  stage=1;
  ngOnInit() {
    this.global.header = 3;
  }

}
