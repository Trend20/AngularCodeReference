import { Directive, ElementRef, HostListener, Renderer2, forwardRef, OnInit, OnDestroy } from '@angular/core';
// import * as textMask from 'vanilla-text-mask/dist/vanilla';

@Directive({
  selector: '[appCustomDateFormater]'
})
export class CustomDateFormaterDirective implements OnDestroy {



  constructor(private elRef: ElementRef,private renderer: Renderer2) {

   }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {

  }
}
