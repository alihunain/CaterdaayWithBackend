import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inner-catering-search',
  templateUrl: './inner-catering-search.component.html',
  styleUrls: ['./inner-catering-search.component.css']
})
export class InnerCateringSearchComponent implements OnInit {
  slideeConfig = {
    "slidesToShow": 1,
    "autoplay": true,
    "autoplaySpeed": 2000,
    "arrows": false,
    "dots": true,
    "focusOnSelect": false,
    "speed": 1000
  };
  constructor() { 

  }

  ngOnInit() {
   
  }

}
