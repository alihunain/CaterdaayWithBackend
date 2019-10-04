import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../Services/kitchen.service';
import { GlobalService } from '../../Services/global.service'
import { ResturantService } from '../../Services/resturant.service';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.css']
})
export class ChefComponent implements OnInit {
  currentchefs: any[];
  displatchefs = new Array<any>();
  endpoint = 0;
  rating = 0;
  loadmore = true;
  allCuisines = new Map();
  constructor(private global:GlobalService,private kitchen: KitchenService, private resturant: ResturantService) { }

  ngOnInit() {
    this.kitchen.getfilterKitchen();
    this.global.header = 2;
    this.getCuisines().then((data)=>{
      this.getKitchens();
    })
 
  
  }
  getKitchens() {
    this.kitchen.allKitchen().subscribe((data: any) => {
      let chefs = data.message;
      if (this.kitchen.filterKitchen.country != undefined && this.kitchen.filterKitchen.country != "") {
        for (let i = 0; i < chefs.length; i++) {
          if (chefs[i].country === this.kitchen.filterKitchen.country) {
            this.currentchefs.push(chefs[i]);
          }
        }
      } else {
        this.currentchefs = chefs;
      }
      this.setKichenRating();
      this.addCuisineNameToView();
      this.SetMenuList();
      this.push4Loadmore();
    }, (error) => {
      console.log(error);
    })
  }
  getKitchenRating(kitchenid) {
    return new Promise((resolve, reject) => {
      this.resturant.resturantRating(kitchenid).subscribe((data: any) => {

        resolve(this.CountRating(data.message))
      }, (error) => {
        reject(error);
      })
    })
  }
  setKichenRating() {
    for (let i = 0; i < this.currentchefs.length; i++) {
      this.getKitchenRating(this.currentchefs[i]._id).then((data:number) => {
        if (!Number.isNaN(data)) {

          this.currentchefs[i].rating = data;
        } else {
          this.currentchefs[i].rating = 0;
        }
      }, (err) => {
        console.log(err);
      });
      this.GetReviewCount(this.currentchefs[i]._id).then((data)=>{
        this.currentchefs[i].reviews = data;

      },(err)=>{
     
        this.currentchefs[i].reviews = 0;
      })
    }
  }
  CountRating(rating) {
    let count = 0;
    let rate = 0;
    let items = rating.items;
    let combos = rating.combos;
    let pack = rating.pack;
    if (items != undefined) {
      for (var i = 0; i < items.length; i++) {
        count += items[i].count;
        rate += items[i].average;
      }
    }
    if (pack != undefined) {
      for (var i = 0; i < pack.length; i++) {
        count += pack[i].count;
        rate += pack[i].average;
      }
    }
    if (combos != undefined) {
      for (var i = 0; i < combos.length; i++) {
        count += combos[i].count;
        rate += combos[i].average;
      }

    }
    let final = rate/count;
    if (Number.isNaN(final)) {
      return 0;
    } else {
      return rate / count;
    }
  }
  GetReviewCount(resturantid) {
    return new Promise((resolve, reject) => {
      this.resturant.resturantReviews(resturantid).subscribe((data: any) => {
        resolve(data.message.review.length);
      }, (error) => {
        reject(0);
      })
    })
  }
  getCuisines(){
    return new Promise((resolve,reject)=>{
      
    this.kitchen.Cuisines().subscribe((data:any)=>{
    let cuisineData = data.message;
    this.SetCuisine(cuisineData).then((data)=>{
      resolve(data);
    })
    })
   })
  }
  SetCuisine(cuisineData){
    return new Promise((resolve,reject)=>{
    this.allCuisines = new Map();
    for(let i = 0 ; i < cuisineData.length;i++){
      this.allCuisines[cuisineData[i]._id] = cuisineData[i].name; 
    }
    resolve(true);
  });
  }
  addCuisineNameToView(){
     for(let i = 0; i < this.currentchefs.length;i++){
       let cuisineNames = [];
       for(let j = 0; j < this.currentchefs[i].cuisines.length;j++){
         cuisineNames.push(this.allCuisines[this.currentchefs[i].cuisines[j]]);
       }
       this.currentchefs[i].cuisineNames = cuisineNames;
     }
     console.log(this.currentchefs);
  }
  GetMenuList(resturantid){
    return new Promise((resolve,reject)=>{
    this.resturant.menuList(resturantid).subscribe((data:any)=>{
      resolve(data.message);
    },(error)=>{
      reject(error);
    })
  })
  }
  SetMenuList(){
    for(let i = 0; i < this.currentchefs.length;i++){
       this.GetMenuList(this.currentchefs[i]._id).then((data)=>{
        this.currentchefs[i].menus = data;
       })
      
    }
    console.log(this.currentchefs,"i am in set menulist");
  }
  push4Loadmore(){
    if(this.endpoint+1 >= this.currentchefs.length){
      return;
    }
    let start = this.endpoint;
    this.endpoint+=4;
    for(let i = start; i < this.endpoint && i < this.currentchefs.length;i++ ){
      this.displatchefs.push(this.currentchefs[i]);
    }
    if(this.endpoint+1 >= this.currentchefs.length){
      this.loadmore = false;
    }
  }
  menuPage(resturantid:string){
    this.resturant.Resturantid = resturantid;
    this.resturant.setResturantid();
  }
}
