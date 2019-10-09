import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { KitchenService } from '../../Services/kitchen.service'
import { Kitchen } from '../Models/Kitchen';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { GlobalService } from '../../Services/global.service'

declare var functionality: any;
declare var srcollEnterance: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent implements OnInit, AfterViewInit {
  update:any;
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
  cuisines:Array<any>;

  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private global:GlobalService,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private fb:FormBuilder,public router: Router, public changeDetectorRef: ChangeDetectorRef,public kitchenservice: KitchenService) { }
 
  ngOnInit() {
    this.kitchenservice.getAddress();
    this.kitchenservice.getfilterKitchen();
    this.kitchenservice.getresturant();
    this.global.header = 2;
    this.GetCuisine();
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

          // console.log(place.geometry);
          //set latitude, longitude and zoom
          this.kitchenservice.filterKitchen.lat = place.geometry.location.lat().toString();
          this.kitchenservice.filterKitchen.lng = place.geometry.location.lng().toString();
        
          this.getAddress(Number(this.kitchenservice.filterKitchen.lat),Number(this.kitchenservice.filterKitchen.lng));
        });
      });
    });
    this.kitchenservice.setfilterKitchen();
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
    // console.log(this.kitchenservice.filterKitchen.cousine,"On Food Type");
    this.kitchenservice.filterKitchen.cousine.push(value);
    this.kitchenservice.setfilterKitchen();
    // console.log(this.kitchenservice.filterKitchen.cousine,"On Food Type");
    

  }

  get city(){
    return this.Kitchen.get('City');
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.kitchenservice.filterKitchen.lat = position.coords.latitude.toString();
        this.kitchenservice.filterKitchen.lng = position.coords.longitude.toString();
        this.kitchenservice.setfilterKitchen();
        this.getAddress(Number( this.kitchenservice.filterKitchen.lat), Number(this.kitchenservice.filterKitchen.lng)   );
      });
    }
  }
   getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        let isCity = false;
        for(let i = 0 ; i < results.length && isCity == false;i++){
          let routes = results[i].types;
          for(let j = 0 ; j < routes.length;j++){
            let types = routes[j];
            if(types == 'locality'){
              this.kitchenservice.filterKitchen.city =results[i].address_components[0].short_name;
              isCity = true;
              break;
            }
          }
        }
      
        this.kitchenservice.filterKitchen.country = results[results.length-1].formatted_address.toLowerCase();

        if (results[0]) {

          this.kitchenservice.address = results[0].formatted_address;
          this.update = this.searchElementRef.nativeElement.value
        }
        this.kitchenservice.setfilterKitchen();
      }
 
    });
  }
  CLocation(){
    this.setCurrentLocation();
    this.searchElementRef.nativeElement.value = "";
 this.searchElementRef.nativeElement.value = this.kitchenservice.address;
  }
  AddLocation(){
    if(this.searchElementRef.nativeElement.value === "" || this.searchElementRef.nativeElement.value === null){
      this.addressField = true;
    }else if(this.update == null || this.update == undefined || this.update != this.searchElementRef.nativeElement.value){
      alert("Kindly Select Address from dropdown");
      return;
    }else{
  
      this.kitchenservice.setfilterKitchen();
      this.kitchenservice.setaddress();
      this.router.navigate(['/listing']);
    }
  }
  GetCuisine(){
    this.cuisines = new Array<any>();
  this.kitchenservice.Cuisines().subscribe((data:any)=>{

    for(let i = 0; i < data.message.length && i < 10;i++){
      this.cuisines.push(data.message[i]);
    }
  },(error)=>{
    console.log(error);
  })
  }
}
