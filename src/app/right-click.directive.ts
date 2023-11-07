import { Directive, Input, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRightClickToDelete]'
})
export class RightClickToDeleteDirective {
  @Input() appRightClickToDelete!: (item: any) => void;
  @Input() item: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event) {
    event.preventDefault(); // Prevent the default context menu
    this.appRightClickToDelete(this.item);
  }
}
