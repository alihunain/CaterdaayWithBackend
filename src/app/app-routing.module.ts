import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InnerSearchComponent } from './inner-search/inner-search.component';
import { InnerCateringSearchComponent } from './inner-catering-search/inner-catering-search.component';
import { CartComponent } from './shareComponents/cart/cart.component';
import { ContactusComponent} from './contactus/contactus.component';
import { AboutUsComponent} from './about-us/about-us.component';
import {DriverSignupComponent} from './driver-signup/driver-signup.component';
import { EarnComponent} from './earn/earn.component';
import { BuyerIntroComponent} from './buyer-intro/buyer-intro.component';
import { BuyerMenuComponent } from  './buyer-menu/buyer-menu.component';
import { CheckoutComponent} from './checkout/checkout.component';
import { ChefComponent } from './chef/chef.component';
import {ChefIntroComponent} from './chef-intro/chef-intro.component';
import {FaqComponent} from './faq/faq.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component'
const routes: Routes = [
  {
    path: 'detail/:id ',
    component: InnerCateringSearchComponent
  },
  {
    path: 'listing',
    component: InnerSearchComponent
  },
  {
    path: 'card',
    component: CartComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'contactus',
    component: ContactusComponent
    
  },
  
  {
    path:'aboutus',
    component: AboutUsComponent
  },
  {
    path:'driver-signup',
    component:DriverSignupComponent
  }, { 
    path: 'earn',
    component: EarnComponent
  }
  , {path: 'buyer-intro',
  component: BuyerIntroComponent

  }, {
    path: 'buyer-menu',
    component: BuyerMenuComponent
  }, {
    path: 'checkout',
    component: CheckoutComponent
  }
  , {
    path: 'chef',
    component: ChefComponent
  }, {
    path: 'chef-intro',
    component: ChefIntroComponent
  }, {
    path: 'faq',
    component: FaqComponent
  }, {
    path: 'term-conditions',
    component: TermsConditionsComponent
  }
  ,
  {
    path: '**', component: DashboardComponent

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration:'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
