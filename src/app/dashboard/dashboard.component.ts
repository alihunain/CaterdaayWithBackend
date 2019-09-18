import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { KitchenService } from '../../Services/kitchen.service'
import { Kitchen } from '../Models/Kitchen';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader, MouseEvent } from '@agm/core';


declare var functionality: any;
declare var srcollEnterance: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
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
  KitchenObject = new Kitchen();
  Kitchen = this.fb.group({
    city:['']
  })
  addressField:boolean;

  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private fb:FormBuilder,public router: Router, public changeDetectorRef: ChangeDetectorRef,public kitchenservice: KitchenService) { }
 
  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.kitchenservice.filterKitchen.lat = place.geometry.location.lat().toString();
          this.kitchenservice.filterKitchen.lng = place.geometry.location.lng().toString();
        
          this.getAddress(Number(this.kitchenservice.filterKitchen.lat),Number(this.kitchenservice.filterKitchen.lng));
        });
      });
    });
  }
  ngAfterViewInit(): void {

  }
 
 
  onFind(){
    this.KitchenObject = this.Kitchen.value;
   this.kitchenservice.SetKitchen(this.KitchenObject);
    // this.kitchenservice.Kitchenfilter(kitchen).subscribe(data=>{
    //   console.log(data);
    // },(error)=>{
    //   console.log(error);
    // })
    this.router.navigate(['/listing']);
  }
  onFoodType(value:string){
    this.kitchenservice.filterKitchen.cousine = new Array<string>();
    this.kitchenservice.filterKitchen.cousine.push(value);
    alert(this.kitchenservice.filterKitchen.cousine);
    this.kitchenservice.SetKitchen(this.KitchenObject);
  }

  get city(){
    return this.Kitchen.get('City');
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.kitchenservice.filterKitchen.lat = position.coords.latitude.toString();
        this.kitchenservice.filterKitchen.lng = position.coords.longitude.toString();
        this.getAddress(Number( this.kitchenservice.filterKitchen.lat), Number(this.kitchenservice.filterKitchen.lng)   );
      });
    }
  }
   getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {

        this.kitchenservice.filterKitchen.country = results[results.length-1].formatted_address.toLowerCase();

        if (results[0]) {

          this.kitchenservice.address = results[0].formatted_address;
        }
      }
 
    });
  }
  AddLocation(){
    if(this.searchElementRef.nativeElement.value === "" || this.searchElementRef.nativeElement.value === null){
      this.addressField = true;
    }else{
      console.log(this.kitchenservice.filterKitchen);
      this.router.navigate(['/listing']);
    }
  }
}
