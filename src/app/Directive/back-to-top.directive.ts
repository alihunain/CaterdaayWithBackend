import { HostListener, Renderer2, Inject, Component, HostBinding, ViewChild, ElementRef, Input } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgAnimateScrollService } from 'ng-animate-scroll';
@Component({
  selector: '[appBackToTop]',
  host: {
   'fa':'display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale',
   'fa-arrow-circle-up:before':'content:"/f0aa"'
  },
  animations: [
    trigger('fadeIn', [
      // ...
      state('open', style({
        opacity: 1,
        color: 'rgba(91, 160, 44, 0.34)'

      })),
      state('close', style({
        opacity: 0,
        color: 'rgba(91, 160, 44, 0.34)'
      })),
      transition('open => close', [
        animate('1s')
      ]),
      transition('close => open', [
        animate('1s')
      ]),
    ]),
  ],
  template: `<ng-content></ng-content>`
})
export class BackToTopDirective {

  public offset = 900;
  public duration = 800;
  public display = false;
  public state: String = 'active';
  @HostListener('click') onClick() {
    this.animateScrollService.scrollToElement('top', 1000);
  }
  @ViewChild('#arrow-up') arrow: ElementRef;
  @HostBinding('@fadeIn') trigger = '';
  @HostListener('window:scroll', []) scrolling() {
    this.viewportChange();
  }

  viewportChange() {


    if (this.document.documentElement.scrollTop > this.offset) {

      this.trigger = 'open';
    }
    else {
 
      this.trigger = 'close';
    }
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.el.nativeElement.style.color = "rgba(91, 160, 44, 1)";
  }
  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.color = "rgba(91, 160, 44, 0.34)";
  }
  constructor(@Inject(DOCUMENT) private document, private animateScrollService: NgAnimateScrollService, private el: ElementRef, private renderer2: Renderer2) {
    el.nativeElement.style.margin = '0';
    el.nativeElement.style.position = 'fixed';
    el.nativeElement.style.bottom = '30px';
    el.nativeElement.style.right = '30px';
    el.nativeElement.style.width = 'auto';
    el.nativeElement.style.height = 'auto';
    el.nativeElement.style.zindex = '30px';
    el.nativeElement.style.textdecoration = 'none';
    el.nativeElement.style.color = "rgba(91, 160, 44, 0.34)";
    const li = this.renderer2.createElement('li');
    li.className = "fa fa-arrow-circle-up";
    li.style = "font-size:40px";
    this.renderer2.appendChild(this.el.nativeElement, li);

  }

}
