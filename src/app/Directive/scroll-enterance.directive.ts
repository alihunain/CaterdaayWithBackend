import { Directive, ElementRef, Input, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appScrollEnterance]'
})
export class ScrollEnteranceDirective implements OnInit, OnChanges {
  constructor(private elRef: ElementRef) {
    this.element = this.elRef.nativeElement;
  }
  @Input() anim: string;
  @Input() delay: number;
  public element: HTMLInputElement;
  private heightOffset = 200;
  private distance = 200;
  private duration = 500;
  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }
  ngOnInit(): void {
    this.init();
  }
  @HostListener('window:scroll', []) scrolling() {
    this.viewportChange();
  }
  @HostListener('resize', []) resizing() {
    this.viewportChange();
  }
  isElemInView(): boolean {
    const rect: any = this.element.getBoundingClientRect();
    return (
      // The top is in view: the top is more than 0 and less than the window height (the top of the element is in view)
      ((rect.top + this.heightOffset) >= 0 && (rect.top + this.heightOffset) <= window.innerHeight) ||
      // The bottom is in view: bottom position is greater than 0 and greater than the window height
      ((rect.bottom + this.heightOffset) >= 0 && (rect.bottom + this.heightOffset) <= window.innerHeight) ||
      // The top is above the viewport and the bottom is below the viewport
      ((rect.top + this.heightOffset) < 0 && (rect.bottom + this.heightOffset) > window.innerHeight)
    );
  }
  setInitialStyles() {
    this.element.style.transition = `all  ${(this.duration / 1000)}s ease`;
    // Add a delay is required
    if (this.delay) {
      this.element.style.transitionDelay = `${(this.delay / 1000)} 's'`;
    }
    // Set up transition types
    switch (this.anim) {
      case 'fade':
        this.element.style.opacity = '0';
        break;
      case 'from-left':
          this.element.style.transform = `translate(-${this.distance}px, 0)`;
        this.element.style.opacity = '0';
        
        break;
      case 'from-right':
        this.element.style.opacity = '0';
        this.element.style.transform = `translate(${this.distance}px, 0)`;
        
        break;
      case 'from-top':
        this.element.style.opacity = '0';
        this.element.style.transform = `translate(0,-${this.distance}px)`;
        break;
      case 'from-bottom':
        this.element.style.opacity = '0';
        this.element.style.transform = `translate(0,${this.distance}px)`;
        break;
    }
  }
  enter() {
    this.element.style.visibility = 'visible';
    this.element.style.opacity = '1';
    this.element.style.transform = 'translate(0, 0)';
    this.element.className += ' has-entered';
  }
  init() {
    // Set up the initial styles on each element, and check if they schould be visible
    this.setInitialStyles();
    if (this.isElemInView()) {
      // If the elements are in view when loaded, animate in after load
      this.enter();
    }
  }
  viewportChange() {
    if (this.isElemInView()) {
      const hasEntered = this.element.classList.contains('has-entered');
      if (!hasEntered) {
        this.enter();
      }

    }
  }
}
