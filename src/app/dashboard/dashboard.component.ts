import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
declare var functionality: any;
declare var srcollEnterance: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  slideConfig = {
    "slidesToShow": 5, 
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
        "slidesToShow":4
      }
    },{
      "breakpoint":768,
      "setting":{
        "slidesToShow":3,
      }
    },{
      "breakpoint":576,
      "settings":{
        "slidesToShow":1
      }
    }
    
  ]
  };
  

  constructor(public router: Router, public changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    // srcollEnterance();
    // this.changeDetectorRef.detectChanges();
    // this.loadScript('../assets/js/jquery-3.2.1.min.js');
    // this.loadScript('../assets/js/script.js');
    // this.loadScript('../assets/js/bootstrap.min.js');
    // this.loadScript('../assets/js/slick.js');
  }
  // public loadScript(url: string) {
  //   const body = document.body as HTMLDivElement;
  //   const script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = url;
  //   script.async = false;
  //   script.defer = true;
  //   body.appendChild(script);
  // }
  navigateToListing(city, cusine) {
    // tslint:disable-next-line:object-literal-shorthand
    this.router.navigate(['/listing'], { queryParams: { city: city, cusine: cusine } });
  }
}
