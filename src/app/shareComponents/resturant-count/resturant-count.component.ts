import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service'
import {ResturantService} from '../../../Services/resturant.service'
import { KitchenService } from '../../../Services/kitchen.service'
import { reject } from 'q';
import { resolve } from 'url';

@Component({
  selector: 'app-resturant-count',
  templateUrl: './resturant-count.component.html',
  styleUrls: ['./resturant-count.component.css']
})
export class ResturantCountComponent implements OnInit {
  OnBoardCaters:any=0;
  SatisfiedCustomer:any=0;
  ServedLocation:any=0;
  Reviews:any=0;
  Resturants:any;
  constructor(public kitchenservice:KitchenService,public resturantservice:ResturantService,public userservice:UserService) { }

 async ngOnInit() {
  await this.GetAllResturant();
     this.GetServedLocation();

     this.GetAllCustomers();
     this.AllReviews();

  }
  GetServedLocation(){
    return new Promise((resolve,reject)=>{
      this.userservice.GetCountryList().subscribe((data:any)=>{
    
       this.ServedLocation= data.message.length;

       resolve();
      },(error)=>{
        console.log(error);
      })
    });
  }
  GetAllResturant(){
    return new Promise((resolve,reject)=>{
    this.kitchenservice.allKitchen().subscribe((data:any)=>{    
      this.OnBoardCaters = data.message.length;
      this.Resturants = data.message;
   
      resolve();
    });
    });
  }
  GetAllCustomers(){
    return new Promise((resolve,reject)=>{
      this.userservice.getAllCustomer().subscribe((data:any)=>{
        this.SatisfiedCustomer = data.message.length;
      
        resolve();
      })
    })
  }
  AllReviews(){
  return new Promise((resolve,reject)=>{
    this.Reviews = 0;
    for(let i = 0; i < this.Resturants.length;i++){
     this.PerReivew(this.Resturants[i]._id).then((reviewcount)=>{
        this.Reviews += reviewcount;
     },(error)=>{
       console.log(error,"fetching reviews");
     })
     if(i+1== this.Resturants.length){
       resolve();
     }
    }
   })
    
   
    
  }
  PerReivew(id){
    return new Promise((resolve,reject)=>{
    let review = 0;
    this.resturantservice.resturantReviews(id).subscribe((data:any)=>{
    
      if(!data.error){
      review = data.message.review.length;
   
      resolve(review);
    }else{
      reject(data.message);
    }
    });

   
  });
  }
}
