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
import { MapsAPILoader, MouseEvent, GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import * as moment from 'moment';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private fb:FormBuilder,private ngZone: NgZone,private mapsAPILoader: MapsAPILoader,private user:UserService, private eleRef:ElementRef,private toastr:ToastrService,private resturant:ResturantService,private router: Router,private cart:CartService,private global:GlobalService,private kitchen:KitchenService) { }
  orders:any;
  // @ViewChild('dayPicker') datePicker: DatePickerComponent; 
  @ViewChild('address')
  public searchElementRef: ElementRef;
  closedate:boolean=false;
  delivery:any;
  zoom=10;
  mymap;
  mindate:any;
  datetouch:boolean=false;
  maxdate:any;
  taxpercentage:any;
  currentUserId:any;
  coupon:any;
  saveCard:any;
  CardStatus:boolean=true;
  customerAddress:any;
  lat:any=0;
  lng:any=0;
  confirm:boolean=false;
  resturantMin: Number;
  resturantMax:Number;
  paycard:boolean=true;
  currentUserObj:any;
  dateValidation:boolean= false;
  resturantDetail:any;
  @ViewChild('map') agmMap: AgmMap;
  caterdaaycharge
  deliveryAddress = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    phone:['',[Validators.required]]
  })
  deliveryTime =this.fb.group({
    ddate:['',Validators.required],
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
  Dateee: Date = new Date();
  settings = {
      bigBanner: true,
      timePicker: true,
      format: 'dd-MMM-yyyy hh:mm a',
      defaultOpen: false
  }
  

 


  ngAfterViewInit() {
 
    this.fitbo().then(()=>{
      
      
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
    
  });
  }



  ngOnInit() {
    
    this.resturant.getResturantid();
    this.user.getUser();
    this.getCaterdaayCharges();
    this.cart.getItemOrder();
    this.cart.getCurrentResturant();
    this.cart.getCartCount();
    this.user.getUser();
    this.getResturantMinimum();
    this.getres();
    if(this.cart.cartCount < Number( this.resturant))
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
   
    
    this.getTaxResturant(this.resturant.Resturantid).then((res)=>{
      
     
      that.orders.delivery = that.delivery.toFixed(2);
      that.orders.taxAmount =((that.orders.total/100)*that.taxpercentage).toFixed(2);
      that.orders.taxpercentage = that.taxpercentage.toFixed(2);
      that.orders.totalAmount = (Number(that.orders.total)+Number(that.orders.taxAmount)+Number(that.orders.delivery)).toFixed(2);
      that.orders.totalqty = that.cart.getCartCount();
      that.orders.perhead = (Number(that.orders.total)+Number(that.orders.taxAmount)+Number(that.orders.delivery))
      that.orders.perhead = Number(that.orders.perhead)/Number(that.orders.totalqty);
      that.orders.perhead = that.orders.perhead.toFixed(2);


    });

  }
  fitbo() {

    return Promise((resolve,reject)=>{
     
      
      this.agmMap.mapReady.subscribe(map => {
        this.mymap = map;
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(this.lat, this.lng));
        this.mymap.fitBounds(bounds);
        this.zoom = 10;
        resolve(true);
      });
    });
  }


 getres(){
  this.resturant.resturantsDetails(this.cart.getCurrentResturant()).subscribe((data:any)=>{

    this.resturantDetail = data.message;

  });
 }
  getDeliveryCharges(){
    return Promise((resolve, reject) => {
    this.kitchen.getDeliveryCharges().subscribe((data:any)=>{
    
      this.delivery = data.message[0].itemcharge;
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
  
        this.delivery = data.message.DeliveryCharges;
        this.taxpercentage = data.message.tax.value;
        this.mindate = moment().add(data.message.preorderforlatertodays,'d');
        this.maxdate = moment().add(data.message.preorderforlaterafterdays,'d');

     
        resolve(true);
      },(error)=>{
        console.log(error);
        reject(false);
      })
     
    });
   

  }
  EditOrder(id){
    this.resturant.Resturantid = id;
    this.router.navigate(['/detail'])
  }
  getResturantMinimum(){
    this.resturant.resturantsDetails(this.resturant.getResturantid()).subscribe((data:any) =>{
      this.resturantDetail = data.message;
      this.resturantMax = Number(data.message.restaurantMax);
      this.resturantMin = Number(data.message.restaurantMin);
      this.Check();
    })
  }
  getCaterdaayCharges(){
    return Promise((resolve,reject)=>{
      this.resturant.CaterdaayCharges().subscribe((data:any)=>{

        this.caterdaaycharge = data.message[0].combocharge;
    

      })
    });
  }
  Check(){
    if(this.cart.getCartCount() < this.resturantMin){
      this.toastr.warning("Resturant Minimum Serving Limit is " + this.resturantMin);
      this.router.navigate(['/detail']);
    }
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
  this.Check();
})
  }
  getUser(){
    this.user.getCustomer(this.currentUserId).subscribe((data:any)=>{
      this.currentUserObj = data.message;
     
  
    },(error)=>{
      console.log(error);
    })
  }
  ConfirmOrder(res){
    if(res == false){
      this.eleRef.nativeElement.querySelector("#closeWarning").click();
    }else{
      this.confirm = true;
      this.eleRef.nativeElement.querySelector("#closeWarning").click();
      this.PlaceOrder();
    }
  }
  PlaceOrder(){
    

    let deliverytype =   this.eleRef.nativeElement.querySelector('input[name="delivery-method"]:checked').value;
    let payment = "Card";
    if(this.confirm == false){
      this.eleRef.nativeElement.querySelector("#confirm").click();
      return;
    }
    let amount =this.orders.totalAmount;
    //CurrentDate
    let delivery = this.deliveryTime.get('ddate').value + " " + this.deliveryTime.get('time').value;
    let devdate = moment(this.Dateee).format('LLLL');
    let nowDate = moment().format('LLLL');

  
   if(this.orders.totalAmount == 0){
    this.orders.totalAmount  = 1;
   }



    if(this.paycard == false){
      let order = {
        currency:"CAD", //User selected country currency
        customerid:this.currentUserId,
        deliveryCharges:this.orders.delivery,
        addOnitem:[],
        addOnTotal:[],
        combo: this.orders.items,
        coupon:this.coupon,
        delvierySlot:{},
        delvierySlotsWeek:{},
        discount:0,
        fulladdress:this.currentUserObj.customeraddresses[0],
        items:[],
        mealpackageDeliveryType:false,
        name:this.currentUserObj.firstname,
        note:"",
        ordertiming:{
          type:"later",
          datetime:devdate,
          create: nowDate ,
        },
        caterdaaycharges:this.caterdaaycharge,
        kitchenDetail:this.resturantDetail,
        ordertype:"",
        package:[],
        paymenttype: payment, 
        restaurantid:this.resturant.Resturantid,
        subtax:this.orders.taxAmount,
        subtotal:this.orders.total,
        tax: this.orders.taxAmount,
        taxpercentage:this.taxpercentage,
        timezone:"America/Los_Angeles", //User selected country flow
        total:this.orders.totalAmount
      }
      let orderEmail = {
        customeremail:this.currentUserObj.email,
        order:order,
        restaurantid:this.resturant.Resturantid
      }
      this.Order(order).then((res:any)=>{
    
          orderEmail.order = res.message;
          this.kitchen.OrderEmail(orderEmail).subscribe((data:any)=>{
            this.cart.removeItemOrders();
            this.cart.currentResturant = null;
            this.cart.setcurrentResturant();
            this.cart.cartCount = 0;
            this.cart.setCartCount();
            this.router.navigate(['/thankyou']);
            
          },(error)=>{
            console.log(error);
          })
       
  
      })
    }else{
      let amount = Math.floor( this.orders.total+this.orders.taxAmount+this.orders.delivery);
     if(amount == 0){
       amount  = 1;
     }
    
  
      if(this.saveCard == undefined || this.saveCard == null){
        this.toastr.error("Card Not Found Kindly Add Card Or Try Again");
        return;
      }else{
        let payment ={
          amount:this.orders.totalAmount,
          custid:this.currentUserObj._id,
          token:this.saveCard.token
        }
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
          caterdaaycharges:this.caterdaaycharge,
          ordertiming:{
            type:"later",
            datetime:devdate,
            create: nowDate ,
          },
          kitchenDetail:this.resturantDetail,
          ordertype:"",
          package:[],
          paymenttype: "card",
          cardPaidStatus:{}, 
          restaurantid:this.resturant.Resturantid,
          subtax:this.orders.taxAmount,
          subtotal:this.orders.total,
          tax: this.orders.taxAmount,
          timezone:"America/Los_Angeles", //User selected country flow
          total:this.orders.totalAmount
        }
        let orderEmail = {
          customeremail:this.currentUserObj.email,
          order:order,
          restaurantid:this.resturant.Resturantid
        }
        this.CollectPaymentByCard(payment).then((response)=>{
          
          if(response == false){
            return;
          }else{
            order.cardPaidStatus = response; 
          }
          this.Order(order).then((res:any)=>{
        
               orderEmail.order = res.message;
               this.kitchen.OrderEmail(orderEmail).subscribe((data:any)=>{
                
                 this.cart.removeItemOrders();
                 this.cart.currentResturant = null;
                 this.cart.setcurrentResturant();
                 this.cart.cartCount = 0;
                 this.cart.setCartCount();
              this.router.navigate(['/thankyou']);
                 
               },(error)=>{
                 console.log(error);
               })
            
       
           })
        })
      }
    }
  }



  CollectPaymentByCard(token){
    return  Promise((resolve,reject)=>{
    this.user.collectPaymentbyToken(token).subscribe((data:any)=>{
  
      if(data.message.txn.ssl_token_response != "SUCCESS"){
     
        this.toastr.show("Something Went Wrong , Cannot Charge Your Card");
        reject(false);
      }else{
       
        resolve(data.message.txn);
      }
    })
  })

  }
  Order(order){
    return Promise((resolve,reject)=>{
    this.kitchen.Order(order).subscribe((data:any)=>{

            if(!data.error){
        this.toastr.success('Your Order has been placed');
        resolve(data);
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
  get ddate(){
    this.dateValid();

    return this.deliveryTime.get('ddate');
  }
  get time(){
    return this.deliveryTime.get('time');
  }
 
  dateValid(){
    this.datetouch = true

    if(this.resturantDetail == undefined){
      this.dateValidation = false;
      return;
    }

    let mindate = new Date(Date.now());
    let maxdate = new Date(Date.now());
    let date = new Date(this.Dateee);
    let min =Number(this.resturantDetail.preorderforlaterafterdays);
    let max = Number(this.resturantDetail.preorderforlatertodays);
    mindate.setDate(mindate.getDate()+min);
    maxdate.setDate(maxdate.getDate()+max);

     if(date >= mindate && date <= maxdate){
       this.dateValidation = true; 
     }else{
     this.dateValidation = false;
     }
  }
    // Address From  Google Map Function <-- Start -->
    getAddress(latitude, longitude) {
      
      this.geoCoder.geocode({ 'location': { lat: Number(latitude), lng: Number(longitude) } }, (results, status) => {
        const LatLngBounds = new google.maps.LatLngBounds();
      LatLngBounds.extend(new google.maps.LatLng(latitude, longitude));
      this.mymap.fitBounds(LatLngBounds);
      this.zoom = 5;
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
    
      this.paycard = status;
      if(!status){
        this.saveCard = null;
      }
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
      if(this.address.value.length > 30){
        this.Card.controls['address'].setValue(this.address.value.substring(1,30));
      }
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
      this.saveCard = card.cardinfo[0];
      this.toastr.success("Card Saved Sucessfully");
  }else{
    this.saveCard = card.cardinfo[0];
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
        }else{
          this.toastr.error(data.message);
        }
      })
    }
    WannaSave(status){

      this.CardStatus =status;
    }
    deleteCard(){
  
      let update = {
        cardinfo:[]
      }
      this.user.UpdateProfile(this.currentUserObj._id,update).subscribe((data:any)=>{
        if(!data.error){
          this.saveCard = null;
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

