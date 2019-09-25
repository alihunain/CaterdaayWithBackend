import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../Services/kitchen.service';
import { ResturantService } from '../../Services/resturant.service';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.css']
})
export class ChefComponent implements OnInit {
  currentchefs:any[];
  constructor(private kitchen:KitchenService,private resturant:ResturantService) { }

  ngOnInit() {
    this.getKitchens();
  }
  getKitchens(){
    this.kitchen.allKitchen().subscribe((data:any)=>{
     let chefs = data.message;
     console.log(this.kitchen.filterKitchen.country);
     if(this.kitchen.filterKitchen.country != undefined && this.kitchen.filterKitchen.country != "")
     {
      for(let i = 0 ; i <  chefs.length;i++){
        if(chefs[i].country === this.kitchen.filterKitchen.country){
          this.currentchefs.push(chefs[i]);
        }
      }
     }else{
       console.log("working")
       this.currentchefs = chefs;
     }
    //  for(let i = 0 ; i < this.currentchefs.length;i++){
    //    this.resturant.resturantReviews(this.currentchefs[i]._id).subscribe(this.)
    //  } 
    },(error)=>{
      console.log(error);
    })
  }
}
