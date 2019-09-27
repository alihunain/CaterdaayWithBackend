import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userdata:any;
  lng:any;
  lat:any;
  zoom=10;
  checkpassword:boolean=false;
  mapaddress:string;
  Profile = this.fb.group({
    email:['',[Validators.required]],
    lastname:['',[Validators.required]],
    firstname:['',[Validators.required]],
    homephone:['',[Validators.required]],
    dob:['',[Validators.required]],
    cellphone:['',[Validators.required]]
  })
  Card = this.fb.group({
    address: ['',[Validators.required]],
    cardnumber: ['',[Validators.required],[Validators.minLength(15)],[Validators.maxLength(17)]],
    cvv: ['',[Validators.required],[Validators.minLength(2)],[Validators.maxLength(4)]],
    expirymonth: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    expiryyear: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    fname: ['',[Validators.required]],
    lname: ['',[Validators.required]],
    zip:['',[Validators.required]]
  })
  Address= this.fb.group({
    phoneno: ['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    zip:['',[Validators.required]],
    country:['',[Validators.required]]
  })
  ResetPassword = this.fb.group({
    oldpassword:['',[Validators.required]],
    newpassword:['',[Validators.required]],
    confirmpassword:['',[Validators.required]]
  })
  constructor(private mapsAPILoader: MapsAPILoader,private users:UserService,private eleRef: ElementRef,private fb:FormBuilder,private toastr:ToastrService,private ngZone: NgZone) { }
  private geoCoder;
  @ViewChild('address')
  public searchElementRef: ElementRef;
  @ViewChild('city')
  public city: ElementRef;
  @ViewChild('country')
  public country:ElementRef
  ngOnInit() {
    this.userdata ={ accounttype: "customer",
    cardinfo: [],
    customeraddresses: [],
    customerfavrestro: [],
    customerpoints: 15,
    dtype: "Customer",
    email: "ali.hunain@koderlabs.com",
    firstname: "Ali Hunain",
    lastname: "Narsinh",
    password: "123456",
    status: true,
    username: "ali.hunain@koderlabs.com",
    __v: 0,
    _id: "5d8caeb843e7df31d8330208"
    }
    this.Profile.controls['email'].setValue(this.userdata.email);
    this.Profile.controls['lastname'].setValue(this.userdata.lastname);
    this.Profile.controls['firstname'].setValue(this.userdata.firstname);
    this.getOrderDetails();
    this.getCustomerRating();
    this.getCustomer();
    console.log(this.searchElementRef.nativeElement)
    this.mapsAPILoader.load().then(() => {
      console.log("map loaded");
      this.setCurrentLocation();
      console.log("current location done");
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

          console.log(place.geometry);
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat().toString();
          this.lng = place.geometry.location.lng().toString();
        
          this.getAddress(this.lat,this.lng);
        });
      });
    });
  }
  addCard(){
    console.log(this.Card.value);
    this.users.verfityCard(this.Card.value).subscribe((data:any)=>{
      if(!data.error){
        if(data.message.txn != undefined){
          this.toastr.error(data.message.txn.errorMessage)
        }else{
          this.toastr.error("Sucessfully Added");
        }
      }
    },(error)=>{
      console.log(error);
    })
  }
  getCustomer(){
    this.users.getCustomer(this.userdata._id).subscribe((data:any)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })  
  }
  addUserAddress(){
    this.users.addCustomerAdress(this.userdata._id,this.Address).subscribe((data:any)=>{
      console.log(data);
    },(error)=>{
      console.log(error)
    })
  }
  updateProfile(){
  let postProfile = this.Profile.value;
  postProfile._id = this.userdata._id;
  postProfile.username = postProfile.email;

    this.users.UpdateProfile(this.userdata._id,postProfile).subscribe((data:any)=>{
    if(!data.error){
      this.toastr.success("Profile Updated !");
    }else{
      this.toastr.error(data.message);
    }
    },(error)=>{
      this.toastr.success("Unexpected Error");
    });
  }
  getOrderDetails(){
    this.users.getUserOrder(this.userdata._id).subscribe((data:any)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }
  ResetPass(){
    if(this.ResetPassword.get('newpassword').value == this.ResetPassword.get('confirmpassword').value){
      this.checkpassword = false;
      let credentails = this.ResetPassword.value;
      credentails.match = true;
      credentails._id = this.userdata._id;
      this.users.changePassword(this.userdata._id,credentails).subscribe((data:any)=>{
        if(data.error){
          this.toastr.error(data.message);
        }else{
          this.toastr.success("Your Password has been changed sucessfully")
          this.eleRef.nativeElement.querySelector('#closeRP').click();
        }

      },(error)=>{
        console.log(error);
      })
    }else{
      this.checkpassword = true;
    }
    console.log(this.checkpassword);
  }
  getCustomerRating(){
    this.users.getCustomerRating(this.userdata._id).subscribe((data:any)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }
  get cellphone(){
    return this.Profile.get('cellphone');
  }
  get dob(){
    return this.Profile.get('dob');
  }
  get homephone(){
    return this.Profile.get('homephone');
  }
  get firstname(){
    return this.Profile.get('firstname');
  }
  get lastname(){
    return this.Profile.get('lastname');
  }
  get email(){
    return this.Profile.get('email');
  }
  get address(){
    return this.Card.get('address');
  }
  get cardnumber(){
    return this.Card.get('cardnumber');
  }
  get cvv(){
    return this.Card.get('cvv');
  }
  get expirymonth(){
    return this.Card.get('expirymonth');
  }
  get expiryyear(){
    return this.Card.get('expiryyear');
  }
  get fname(){
    return this.Card.get('fname');
  }
  get lname(){
    return this.Card.get('lname');
  }
  get zip(){
    return this.Card.get('zip');
  }
  get oldpassword(){
    return this.ResetPassword.get('oldpassword');
  }
  get newpassword(){
    return this.ResetPassword.get('newpassword');
  }
  get confirmpassword(){
    return this.ResetPassword.get('confirmpassword');
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(this.lat,this.lng)
        this.lat = position.coords.latitude.toString();
        this.lng = position.coords.longitude.toString();
        this.getAddress( this.lat,this.lng );
      });
    }
  }
  getAddress(latitude, longitude) {
    console.log(latitude,longitude)
    this.geoCoder.geocode({ 'location': { lat: Number(latitude), lng: Number(longitude) } }, (results, status) => {
      if (status === 'OK') {
        console.log(status,"status")
        let isCity = false;
        if (results[0]) {
          for(let i = 0 ; i < results.length && isCity == false;i++){
            let routes = results[i].types;
            for(let j = 0 ; j < routes.length;j++){
              let types = routes[j];
              if(types == 'locality'){
                this.Address.get('city').setValue(results[i].address_components[0].short_name.toLowerCase());
                isCity = true;
                break;
              }
            }
          }
      
          this.Address.get('address').setValue(results[0].formatted_address);
          
          this.Address.get('country').setValue(results[results.length-1].formatted_address.toLowerCase());

          
        }
      }
 
    });
  }
  markerDragEnd($event: any) {
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }
  addAddress(){
      this.users.addCustomerAdress(this.userdata._id,this.Address.value).subscribe((data:any)=>{
        console.log(data)
        if(data.error){

          this.toastr.error(data.message)
        }else{
          this.eleRef.nativeElement.querySelector('#closeAdress').click();
          this.toastr.success("Added Sucessfully");
        }
      })
  }
}










