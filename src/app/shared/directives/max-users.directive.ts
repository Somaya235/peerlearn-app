import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMaxUsers]',
  standalone: true
})
export class MaxUsersDirective {
  @Input() appMaxUsers: number = 1;
  @Input() currentUsers: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateAppearance();
  }

  @Input() set appMaxUsersValue(value: number) {
    this.appMaxUsers = value;
    this.updateAppearance();
  }

  @Input() set appCurrentUsers(value: number) {
    this.currentUsers = value;
    this.updateAppearance();
  }

  private updateAppearance() {
    if (this.currentUsers >= this.appMaxUsers) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.6');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.currentUsers >= this.appMaxUsers) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
