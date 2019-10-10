import { Component, OnInit, ElementRef } from '@angular/core';
import { UserService } from 'src/Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { KitchenService } from '../../../Services/kitchen.service'
import { GlobalService } from '../../../Services/global.service'
import { CartService } from '../../../Services/cart.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  User: any = null;
  Countrys: any;
  Signin: boolean = true;
  Show = false;
  Countryname: string = "Select Country";
  constructor(public router: Router, private eleRef: ElementRef, public global: GlobalService, public userService: UserService, private toastr: ToastrService, private kitchenservice: KitchenService, private cart: CartService) { }
  showCart = false;
  ngOnInit() {
    this.getCountries();
    this.Signin = true;
    this.userService.checkCurrentUser.subscribe(res => {

      if (this.userService.user != undefined && this.userService.user != null) {
        this.Signin = false;
      } else {
        this.Signin = true;
      }

    });
    this.userService.getLoginElement.subscribe(res => {
      if (res) {
        this.eleRef.nativeElement.querySelector("#loginn").click();
      }
    })

    this.userService.getUser();
    this.userService.UserUpdate(true);

  }
  // Profile(data) {
  //   this.router.navigate(['/profile'], { queryParams: { value: data } });
  // }
  onSignout() {
    this.userService.removeUser();
    this.userService.UserUpdate(false);
    this.toastr.success("Sign Out")
  }
  cartBoxAction(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.showCart = !this.showCart;
  }
  checkUser() {
    this.User = this.userService.getUser();
    if (!this.User === null) {
      this.Signin = false;
    }
  }
  getCountries() {
    this.userService.GetCountryList().subscribe((data: any) => {
      this.Countrys = data.message;

    }, error => {
      console.log(error)
    })
  }
  ShowCountry() {

    this.Show = !this.Show;
  }
  Change(selectedCountry: string) {

    this.Countryname = selectedCountry;
    this.kitchenservice.filterKitchen.city = "";
    this.kitchenservice.filterKitchen.country = "";
    this.kitchenservice.address = "";
    this.kitchenservice.filterKitchen.country = this.Countryname;
  }

}
