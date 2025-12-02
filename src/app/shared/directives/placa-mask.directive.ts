import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPlacaMask]',
  standalone: true
})
export class PlacaMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    let value = input.value.toUpperCase();
    
    // Remove tudo que não é letra ou número
    value = value.replace(/[^A-Z0-9]/g, '');
    
    // Limita a 7 caracteres (AAA + AAAA)
    value = value.substring(0, 7);
    
    // Adiciona o hífen após os 3 primeiros caracteres
    if (value.length > 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    input.value = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Permite teclas de controle
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Permite apenas letras e números
    const isLetterOrNumber = /^[a-zA-Z0-9]$/.test(event.key);
    if (!isLetterOrNumber) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    let value = pastedText.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 7);
    
    if (value.length > 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    this.el.nativeElement.value = value;
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }
}
