import { Component, OnInit,ElementRef, ViewChild , NgZone } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
import { KitchenService } from '../../Services/kitchen.service'
import {CartService} from '../../Services/cart.service'
import { Router } from '@angular/router';
import { ResturantService } from '../../Services/resturant.service'
import { ToastrService } from 'ngx-toastr'
import { Promise, reject } from 'q';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Stats } from 'fs';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private fb:FormBuilder,private ngZone: NgZone,private mapsAPILoader: MapsAPILoader,private user:UserService, private eleRef:ElementRef,private toastr:ToastrService,private resturant:ResturantService,private router: Router,private cart:CartService,private global:GlobalService,private kitchen:KitchenService) { }
  orders:any;
  @ViewChild('address')
  public searchElementRef: ElementRef;
  delivery:any;
  taxpercentage:any;
  currentUserId:any;
  coupon:any;
  saveCard:any;
  CardStatus:boolean=true;
  customerAddress:any;
  lat:any;
  lng:any;

  paycard:boolean=false;
  currentUserObj:any;
  dateValidation:boolean= false;
  deliveryAddress = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    phone:['',[Validators.required]]
  })
  deliveryTime =this.fb.group({
    date:['',[Validators.required]],
    time:['',[Validators.required]]
  })
  Address= this.fb.group({
    phoneno: ['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    zip:['',[Validators.required]],
    country:['',[Validators.required]]
  })
  Card = this.fb.group({
    address: ['',[Validators.required]],
    cardnumber: ['',[Validators.required]],
    cvv: ['',[Validators.required]],
    expirymonth: ['',[Validators.required]],
    expiryyear: ['',[Validators.required]],
    fname: ['',[Validators.required]],
    lname: ['',[Validators.required]],
    zip:['',[Validators.required]]
  })
  private geoCoder;
  validCvv:boolean=true;
  validCn:boolean=true;
  validM:boolean=true;
  validY:boolean=true;
  










  ngOnInit() {
    this.resturant.getResturantid();
    this.user.getUser();
    this.cart.getItemOrder();
    this.cart.getCurrentResturant();
    this.cart.getCartCount();
    this.user.getUser();
  
    if(this.user.user == null || this.user.user == undefined){
     this.router.navigate(['/detail']);
   }
    this.global.header = 3;
    this.currentUserId =this.user.user._id;
    this.orders = this.cart.itemsOrder;

    if(this.orders == null || this.orders == undefined){
      this.router.navigate(['/listing']);
    }
    this.cart.checkCart.subscribe(res =>{
      this.orders = res;
     
    });
    let that = this;
    this.getUser();
    this.getDeliveryCharges().then(()=>{
   
    this.getTaxResturant(this.resturant.Resturantid).then((res)=>{
      
      that.orders.delivery = that.delivery;
      that.orders.taxpercentage = that.taxpercentage;
    
      that.orders.taxAmount =((that.orders.total/100)*that.taxpercentage);
      that.orders.totalqty = that.cart.getCartCount(); 

    });
  });
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
        this.lat = place.geometry.location.lat().toString();
        this.lng = place.geometry.location.lng().toString();
      
        this.getAddress(this.lat,this.lng);
      });
    });
  });
  }
  getDeliveryCharges(){
    return Promise((resolve, reject) => {
    this.kitchen.getDeliveryCharges().subscribe((data:any)=>{
      console.log(data);
      this.delivery = data.message[0].mealpackagecharge;
      resolve(true);
    },(error)=>{
      console.log(error);
      reject(false);
    })
  });
  }
   getTaxResturant(id){
    return Promise((resolve, reject) => {
      this.resturant.resturantsDetails(id).subscribe((data:any)=>{
   
        this.taxpercentage = data.message.tax.value;
   

        resolve(true);
      },(error)=>{
        console.log(error);
        reject(false);
      })
    });
   

  }
  EditOrder(id){
    this.resturant.Resturantid = id;
  }
  Reedem(){
  
   let coup = this.eleRef.nativeElement.querySelector('#coupon').value;
   if(coup==""){
     return;
   }
    let voucher={
      couponcode:coup,
      kitchenId:this.resturant.Resturantid
    }
    this.kitchen.Coupon(voucher).subscribe((data:any)=>{
      if(data.error){
        this.toastr.error(data.message);
      }else{
        this.coupon = voucher.couponcode;
        this.toastr.success("Coupon Offer Redeem Sucessfully");
      }
    })
  }
  RemoveItem(item){
this.cart.RemoveCombo(item).then(()=>{
  if(this.cart.getItemOrder() == null || this.cart.getItemOrder() == undefined){
    this.toastr.warning("Your Cart is empty select item you want to order")
    this.router.navigate(['/detail']);
  }
})
  }
  getUser(){
    this.user.getCustomer(this.currentUserId).subscribe((data:any)=>{
      this.currentUserObj = data.message;
  
    },(error)=>{
      console.log(error);
    })
  }
  PlaceOrder(){


    let deliverytype =   this.eleRef.nativeElement.querySelector('input[name="delivery-method"]:checked').value;
    let payment = this.eleRef.nativeElement.querySelector('input[name="pay-meth"]:checked').value;
    if(this.paycard == false){
      let order = {
        currency:"CAD", //User selected country currency
        customerid:this.currentUserId,
        deliveryCharges:this.orders.delivery,
        addOnitem:[],
        addOnTotal:[],
        combo:this.orders.items,
        coupon:this.coupon,
        delvierySlot:{},
        delvierySlotsWeek:{},
        discount:0,
        fulladdress:this.currentUserObj.customeraddresses[0],
        items:[],
        mealpackageDeliveryType:false,
        name:this.currentUserObj.name,
        note:"",
        ordertiming:{
          type:"later",
          datetime:this.deliveryTime.get('date').value + " " + this.deliveryTime.get('time').value,
        },
        ordertype:"",
        package:[],
        paymenttype: payment, 
        restaurantid:this.resturant.Resturantid,
        subtax:this.orders.taxAmount,
        subtotal:this.orders.total,
        tax: this.orders.taxAmount,
        timezone:"America/Los_Angeles", //User selected country flow
        total:this.orders.total+this.orders.taxAmount+this.orders.delivery
      }
      let orderEmail = {
        customeremail:this.currentUserObj.email,
        order:order,
        restaurantid:this.resturant.Resturantid
      }
      this.Order(order).then((res)=>{
        if(res){
    
        this.kitchen.OrderEmail(orderEmail).subscribe((data:any)=>{
    
          this.router.navigate(['/thankyou']);
          
        },(error)=>{
          console.log(error,"error in order email");
        })
      }
      })
    }else{
      if(this.saveCard == undefined || this.saveCard == null){
        this.toastr.error("Card Not Found Kindly Add Card Or Try Again");
        return;
      }else{
        let order = {
          currency:"CAD", //User selected country currency
          customerid:this.currentUserId,
          deliveryCharges:this.orders.delivery,
          addOnitem:[],
          addOnTotal:[],
          combo:this.orders.items,
          coupon:this.coupon,
          delvierySlot:{},
          delvierySlotsWeek:{},
          discount:0,
          fulladdress:this.currentUserObj.customeraddresses[0],
          items:[],
          mealpackageDeliveryType:false,
          name:this.currentUserObj.name,
          note:"",
          ordertiming:{
            type:"later",
            datetime:this.deliveryTime.get('date').value + " " + this.deliveryTime.get('time').value,
          },
          ordertype:"",
          package:[],
          paymenttype: "card",
          cardinfo:this.saveCard, 
          restaurantid:this.resturant.Resturantid,
          subtax:this.orders.taxAmount,
          subtotal:this.orders.total,
          tax: this.orders.taxAmount,
          timezone:"America/Los_Angeles", //User selected country flow
          total:this.orders.total+this.orders.taxAmount+this.orders.delivery
        }
        let orderEmail = {
          customeremail:this.currentUserObj.email,
          order:order,
          restaurantid:this.resturant.Resturantid
        }
      }
    }
    
 
    
  }
  Order(order){
    return Promise((resolve,reject)=>{
    this.kitchen.Order(order).subscribe((data:any)=>{

            if(!data.error){
        this.toastr.success('Your Order has been placed');
        resolve(true);
      }else{
        this.toastr.error(data.message);
        reject(false);
      }
      },(error)=>{
        this.toastr.error(error)
        reject(false);
      })
    });
  }
  get name(){
    return this.deliveryAddress.get('name');
  }
  get email(){
    return this.deliveryAddress.get('email');
  }
  get phone(){
    return this.deliveryAddress.get('phone');
  }
  get date(){
    this.dateValid();
    return this.deliveryTime.get('date');
  }
  get time(){
    return this.deliveryTime.get('time');
  }
  dateValid(){
    let date = new Date(this.deliveryTime.get('date').value);
    let today = new Date();
    if(date > today){
      this.dateValidation = true;
    }else{
      this.dateValidation = false;
    }
  }
    // Address From  Google Map Function <-- Start -->
    getAddress(latitude, longitude) {

      this.geoCoder.geocode({ 'location': { lat: Number(latitude), lng: Number(longitude) } }, (results, status) => {
        if (status === 'OK') {
  
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
  
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
      this.getAddress(this.lat, this.lng);
    }
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
   
          
          this.lat = position.coords.latitude.toString();
          this.lng = position.coords.longitude.toString();
          this.getAddress( this.lat,this.lng );
        });
      }
    }
     // Address From  Google Map Function <-- End -->
     addAddress(){
      this.user.addCustomerAdress(this.currentUserId,this.Address.value).subscribe((data:any)=>{
   
        
        if(data.error == true){

          this.toastr.error(data.message)
        }else{
          
        this.customerAddress = data.message.customeraddresses[0];

        this.getUser();
          this.eleRef.nativeElement.querySelector('#closeAdress').click();
          this.toastr.success("Added Sucessfully");
        }
      },(error)=>{
  
      })
    }



    selectCard(card){
      this.saveCard = card;
    }
    UnselectCard(){
      this.saveCard = null;
    }
    paystatus(status){
      console.log(status);
      this.paycard = status;
    }



    
    formatCn(number){
      let currentcurrent= "";
      for(let i = 0 ; i < number.length;i++){
        if(number[i] == '-'){
          continue;
        }else{
          currentcurrent+=number[i];
        }
      }
      if(currentcurrent.length != 16){
        this.validCn =false;
      }else{
        this.validCn = true;
      }
      let final = "";
      for(let i = 0; i < currentcurrent.length;i++){
 
        if((i) % 4 == 0 && i != 0){
        
          final+= '-' + currentcurrent[i];
        }else{
          final+= currentcurrent[i];
        }
      }
      return final;
    }
    verifyCard(){
    
      this.user.verfityCard(this.Card.value).subscribe((data:any)=>{
        if(!data.error){
          // if(data.message.txn != undefined){
          //   this.toastr.error(data.message.txn.errorMessage)
          // }else{
          //   this.toastr.error("Sucessfully Added");
          // }
          if(data.message.txn.errorCode == undefined && data.message.txn.ssl_result_message != "INVALID CARD"){
          let card = this.Card.value;
          card.email = this.currentUserObj.email;
     
          this.generateCardToken(card);
         }else{
           this.toastr.error(data.message.txn.errorMessage || data.message.txn.ssl_result_message);
         }
        }
      },(error)=>{
        console.log(error);
      })
    }
    generateCardToken(credentials){
      this.user.generateToken(credentials).subscribe((data:any)=>{
        if(data.message.txn.errorCode != undefined){
          this.toastr.error(data.message.txn.errorName);
          return;
        }
        let res = data.message.txn;
      let card = {
        cardinfo: [{
        cardnumber:res.ssl_card_number,
        cardtype:res.ssl_card_short_description,
        default:true,
        token:res.ssl_token,
      }],_id:this.currentUserObj._id
    }

    if(this.CardStatus){

    this.addCard(card);
  }else{
    this.saveCard = card;
    this.toastr.success("Sucessfully Added For This Order");
    this.eleRef.nativeElement.querySelector("#closeCardForm").click();
  }
      },(error)=>{
        console.log(error);
      })
    }
    addCard(cardinfo){
    
  
      this.user.UpdateProfile(this.currentUserObj._id,cardinfo).subscribe((data:any)=>{
        if(!data.error){

          this.getUser();

          this.eleRef.nativeElement.querySelector("#closeCardForm").click();
          this.saveCard = cardinfo;
        }else{
          this.toastr.error(data.message);
        }
      })
    }
    WannaSave(status){
 
      this.saveCard =status;
    }
    deleteCard(){
  
      let update = {
        cardinfo:[]
      }
      this.user.UpdateProfile(this.currentUserObj._id,update).subscribe((data:any)=>{
        if(!data.error){
          this.getUser();
          this.toastr.success("Sucessfully Deleted");
        }
      })
      }


















    get address(){
      return this.Card.get('address');
    }
    get cardnumber(){
      let card = this.Card.get('cardnumber').value;
      this.Card.get('cardnumber').setValue(this.formatCn(card)); 
      return this.Card.get('cardnumber');
    }
    get cvv(){
  
      if(this.Card.get('cvv').value.length != 3){
        this.validCvv = false;
      }else{
        this.validCvv = true;
      }
      return this.Card.get('cvv');
    }
    get expirymonth(){
      if(this.Card.get('expirymonth').value.length != 2){
        this.validM = false;
      }else{
        this.validM = true;
      }
      return this.Card.get('expirymonth');
     
    }
    get expiryyear(){
      if(this.Card.get('expiryyear').value.length != 2){
        this.validY = false;
      }else{
        this.validY = true;
      }
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
}
