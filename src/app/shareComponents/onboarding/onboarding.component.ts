import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  slideConfig = {
    "slidesToShow": 3, 
    "slidesToScroll": 1,
    "autoplay":true,
  "autoplaySpeed":2000,
  "arrows":true,
    "dots":false,
    "infinite": true,
    "focusOnSelect":false,
    "speed":700,
  "responsive":[{
    "breakpoint":1200,
    "setting":{
      "slidesToShow":5,
    }
  },{
      "breakpoint":992,
      "settings":{
        "slidesToShow":2,
        "slidersToScroll":1
      }
    },{
      "breakpoint":575,
      "setting":{
        "slidesToShow":1,
        "slidersToScroll":1,
        arrows: false,
        dots:true	
      }
    }
  ]
  };
  constructor() { }

  ngOnInit() {
  }

}
