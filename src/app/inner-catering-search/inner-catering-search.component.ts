
import { Component, OnInit, ElementRef } from '@angular/core';
import {ResturantService } from '../../Services/resturant.service'
import { Router } from '@angular/router';
import {menu} from '../Models/menu';
import { menuItem} from '../Models/menu-item';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { CartService } from '../../Services/cart.service'
import { GlobalService } from '../../Services/global.service'
import { ToastrService } from 'ngx-toastr'
import { NgAnimateScrollService } from 'ng-animate-scroll';

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
  filterType:any;
  textarea:boolean=false;
  max :any;
  selectedItem:any;
  min:any;
  dropdown:any[];
  showcart:boolean=false;
  ResturantObj:any;
  AverageRating:String;
  resturantReviews:any;
  customerMap:any[];
  latitude: number;
  longitude: number;
   address:string;
  zoom:number=0;
  popupItem:any;
  private geoCoder;
  menuToDisplay:any[];
  bufferToDisplay:any[];
  location:boolean= true;

  HighteaBuffet:any;
  LunchBuffet:any;
  DinnerBuffet:any;
  constructor(private animateScrollService: NgAnimateScrollService,private toastr:ToastrService,private eleRef: ElementRef,private global:GlobalService,private resturantService:ResturantService,private router:Router,private mapsAPILoader: MapsAPILoader,private cart:CartService) { 

  }

  ngOnInit() {
    this.cart.getCartCount();
    this.cart.getCurrentResturant();
    this.cart.getItemOrder();
    this.resturantService.getResturantid();
    this.global.header = 3;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    })
    this.ResturantObj = new Object();
    this.resturantReviews =  new Object();

    if(this.resturantService.Resturantid == undefined || this.resturantService.Resturantid == null || this.resturantService.Resturantid == ""){
      this.router.navigate(['/listing']);
    }else{
      this.getResturantDetails();
      this.getResturantRating();
      this.getResturantReviews();
      this.getActiveItem();
      // this.getActiveItem();
     this.getActiveCombos();
      // this.resturantService.offerList(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"offerlist")},(error)=>{console.log(error)})
     
      // this.resturantService.menuList(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"menulist")},(error)=>{console.log(error)})
      // this.resturantService.activeMealPackages(this.resturantService.Resturantid).subscribe((data:any)=>{console.log(data,"active mealpackages")},(error)=>{console.log(error)})
      
    }
  }
  switchToAbout(){
    this.location = false;
  }
  switchToLocation(){
    this.location = true;
  }
  changeCartStatus(){
    this.showcart = !this.showcart;
  }
  ResturantPopups(items){
    console.log("working");
    console.log(items,"item");
    if(items.kitchenId != this.cart.currentResturant){
      console.log("in")
      this.dropdown = new Array<Number>();
      let min = Number(items.min);
      let max = Number(items.max);
      for(let i = min ; i <= max;i++){
        this.dropdown.push(i);
      }
      console.log(this.dropdown);
      this.popupItem = items;
      return;
    }
   this.dropdown = new Array<Number>();
   let min = items.min;
   if(min < (this.min-this.cart.getCartCount())){
     min = this.min-this.cart.getCartCount();
   }
   let itemincart = this.cart.isBufferExist(items.name);
   let itemmax;
   if(itemincart != -1){
    min = 1;
    itemmax =items.max-this.cart.getItemOrder().items[itemincart].qty;
  }else{
    itemmax = items.max;
  }
  console.log(itemmax,"yeh item max araha h");
  
  console.log(this.max-this.cart.getCartCount(),"yeh item max araha h");
   for(let i = min ; i <= (this.max-this.cart.getCartCount()) && i <= itemmax;i++){
     this.dropdown.push(i);
   }
    this.popupItem = items;
  }
  getActiveCombos(){
    this.resturantService.activeCombos(this.resturantService.Resturantid).subscribe((data:any)=>{
      console.log(data,"active combos");
      let response =  {max: "80",min:"10",
      Combos: [{name:"Mealone",
        halal:true,
        kitchenid:this.resturantService.Resturantid,
        description:"this is a test data",
        finalcomboprice:"380",
        totalprice:"400",
        image:"file-1564860776723.jpg",
        status:"true",
        discount:"20",
        min:"10",
        max:"20",
        menuId:[{
        cuisine:[],
        image:"file-1564860776723.jpg",
        kitchenId:this.resturantService.Resturantid,
        name:"Biryani"
        },{
        cuisine:[],
        image:"file-1564860776723.jpg",
        kitchenId:this.resturantService.Resturantid,
        name:"Haleem"
        }]},{
          name:"Mealtwo",
          kitchenid:this.resturantService.Resturantid,
          description:"this is a test data",
          finalcomboprice:"450",
          totalprice:"500",
          image:"file-1564860776723.jpg",
          status:"true",
          discount:"50",
          min:"10",
          max:"20",
          menuId:[{
          cuisine:[],
          image:"file-1564860776723.jpg",
          kitchenId:this.resturantService.Resturantid,
          name:"Burger"
          },{
          cuisine:[],
          image:"file-1564860776723.jpg",
          kitchenId:this.resturantService.Resturantid,
          name:"Broast"
          }]
      }]};
     let Buffets = data.message;
     this.bufferToDisplay = new Array();
     this.LunchBuffet = new Array();
     this.HighteaBuffet = new Array();
     this.DinnerBuffet = new Array();
     console.log(Buffets,"buffets")
     for(let i =0;i < Buffets.length;i++){
    
       if(Buffets[i].type == 'Breakfast'){
         this.bufferToDisplay.push(Buffets[i]);
       }else if(Buffets[i].type == 'Hightea'){
         this.HighteaBuffet.push(Buffets[i]);
       }else if(Buffets[i].type == 'Lunch'){
        this.LunchBuffet.push(Buffets[i]);
       }else{
        this.DinnerBuffet.push(Buffets[i]);
       }
     }
     console.log(this.bufferToDisplay,"bufferToDisplay");
     console.log(this.DinnerBuffet,"Dinner");
     console.log(this.LunchBuffet,"lunch");
     console.log(this.HighteaBuffet,"hightea");

      // this.bufferToDisplay = data.message;
      console.log(this.bufferToDisplay);


     },(error)=>{
       console.log(error)
     })
         
  }
  textareaStatus(){
    this.textarea = !this.textarea;
  }
  getResturantDetails (){
       this.resturantService.resturantsDetails(this.resturantService.Resturantid).subscribe((data:any)=>{
         console.log(data.message,"rsg");
         if(!data.error){
         this.ResturantObj=data.message;
         this.min =Number( this.ResturantObj.restaurantMin);
         this.max = Number(this.ResturantObj.restaurantMax);
         this.latitude = this.ResturantObj.lat;
         this.longitude = this.ResturantObj.lng;
    
         this.zoom=1;
   
   
       }else{
         console.log("error");
       }
       },(error)=>{
         console.log(error)
       })
  }
  emptyCart(status,popupItem){
    if(status){
      this.cart.currentResturant = null;
      this.cart.itemsOrder = undefined;
      this.cart.setItemOrder();
      this.cart.setcurrentResturant();
      this.CartCombo(popupItem);
      this.eleRef.nativeElement.querySelector('#closeWarning').click();
    }else{
      this.eleRef.nativeElement.querySelector('#closeWarning').click();
      // /
    }
    this.cart.setcurrentResturant();
    this.cart.setItemOrder();
  }
  CartCombo(popupItem){
    this.selectedItem = popupItem;

    console.log(popupItem,"popupitem")
    console.log(this.cart.getCurrentResturant());
    if(this.cart.getCurrentResturant() == undefined||this.cart.getCurrentResturant() == null || this.cart.getCurrentResturant() == 'undefined'){
 
      this.cart.currentResturant = popupItem.kitchenId;
      this.cart.setcurrentResturant();
    }
    else if(!(this.cart.currentResturant == popupItem.kitchenId)){
     this.eleRef.nativeElement.querySelector('#openWarning').click();
    return;
    }
    let qty = this.eleRef.nativeElement.querySelector('#total-serving').value;
   
   this.eleRef.nativeElement.querySelector('#closePopup').click();
    this.cart.addBufferItem(popupItem,qty,this.ResturantObj.restaurantname);
  
  this.cart.cartCount = this.cart.getCartCount()+Number(qty);
   this.cart.setCartCount();
   
   this.cart.setItemOrder();
  }
  getResturantRating(){
         this.resturantService.resturantRating(this.resturantService.Resturantid).subscribe((data:any)=>{
           if(data.message.pack[0] != undefined){

            this.AverageRating = data.message.pack[0].average;
           }
         },(error)=>{
           console.log(error)
         })
  }
  getResturantReviews(){
       this.resturantService.resturantReviews(this.resturantService.Resturantid).subscribe((data:any)=>{
         this.resturantReviews = data.message;
       
         let customerids = new Array<string>();
         for(let i = 0; i < this.resturantReviews.review.length;i++){
           let id = this.resturantReviews.review[i].customerId;
   
           if(!customerids.includes(this.resturantReviews.review[i].customerId)){
             customerids.push(this.resturantReviews.review[i].customerId);
           }
         }
         this.getReviewCustomerName(customerids);
         
       },(error)=>{
         console.log(error)
       })
  }
  getReviewCustomerName(id){
       var idsobj= {ids:id}
       this.resturantService.customerById(idsobj).subscribe((data:any)=>{
          this.customerMap = data.message;
          let reviewList = this.resturantReviews.review;
          let map=[];
          for(let i = 0; i<this.customerMap.length;i++){
            map[this.customerMap[i]._id] = this.customerMap[i].firstname + " " + this.customerMap[i].lastname;
        
          }
          for(let i = 0;i < reviewList.length;i++){
      
            if(map[reviewList[i].customerId] ===undefined){
              this.resturantReviews.review[i].name = "Anonymous";
            }else{
             this.resturantReviews.review[i].name = map[reviewList[i].customerId];
            }
          }
         },(error)=>{
           console.log(error);
         })
  }
  // AddtoCart(item,name){
  //      this.cart.PlusItem(item,name);
  //      this.cart.CartUpdate(this.cart.itemsOrder);
  // }
  ExitPopup(){
    this.eleRef.nativeElement.querySelector('#closePopup').click();
  }
  getActiveItem(){
      
       this.resturantService.activeItem(this.resturantService.Resturantid).subscribe((data:any)=>{
         console.log(data.message,"items in resturant");
       let itemsInResturant = data.message;
  
   
       let menus = [];
       let items = [];
       for(let i = 0; i < itemsInResturant.length;i++){
         if(menus[itemsInResturant[i].menuId._id] === undefined){
           let menuObj = new menu();
           menuObj.kitchenID = itemsInResturant[i].menuId.kitchenId;
           menuObj.menuID = itemsInResturant[i].menuId._id;
           menuObj.menuImage = itemsInResturant[i].menuId.image;
           menuObj.menuName = itemsInResturant[i].menuId.name;
           menuObj.item = new Array();
           menus[itemsInResturant[i].menuId._id] = menuObj;
         }
           let itemobj = new menuItem();
           itemobj.idmenu = itemsInResturant[i].menuId._id;
           itemobj.itemID = itemsInResturant[i]._id;
           itemobj.Description = itemsInResturant[i].description;
           itemobj.itemImage = itemsInResturant[i].image;
           itemobj.itemName = itemsInResturant[i].name;
           itemobj.itemPrice = itemsInResturant[i].price; 
           itemobj.completeItem = itemsInResturant[i];
           menus[itemsInResturant[i].menuId._id].item.push(itemobj);
       }
       let keys = Object.keys(menus);
       this.menuToDisplay = new Array();
       for(let i = 0; i < keys.length;i++){
         menus[keys[i]].uiId = i+1;
         this.menuToDisplay.push(menus[keys[i]]);
       }
   
   
     })
     
  }
  scroll(id){
    console.log(id);
    this.animateScrollService.scrollToElement(id,1000);
   
  }
 
}
