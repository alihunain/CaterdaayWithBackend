import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.css']
})
export class EarnComponent implements OnInit {

  constructor(private global:GlobalService) { }

  ngOnInit() {
    this.global.header = 2;
  }

}
