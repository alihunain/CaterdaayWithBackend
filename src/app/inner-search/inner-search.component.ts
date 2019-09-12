import { Component, OnInit } from '@angular/core';
// import * as  Sliders from '../../assets/js/script.js';
declare var functionality: any;
@Component({
  selector: 'app-inner-search',
  templateUrl: './inner-search.component.html',
  styleUrls: ['./inner-search.component.css']
})
export class InnerSearchComponent implements OnInit {
 
  constructor() { }

  ngOnInit() {
    functionality();
  }

}
