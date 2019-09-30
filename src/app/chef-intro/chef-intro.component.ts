import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service'

@Component({
  selector: 'app-chef-intro',
  templateUrl: './chef-intro.component.html',
  styleUrls: ['./chef-intro.component.css']
})
export class ChefIntroComponent implements OnInit {

  constructor(private global:GlobalService) { }

  ngOnInit() {
    this.global.header = 2;
  }

}
