import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  /**
   * Formata data para dd/mm/yyyy
   * Suporta: Date, string, number, Firestore Timestamp
   */
  transform(value: any): string {
    if (!value) return '';

    let date: Date;

    // Verifica se é um Timestamp do Firestore (tem método toDate)
    if (value && typeof value.toDate === 'function') {
      date = value.toDate();
    }
    // Verifica se é um objeto com seconds (Timestamp serializado)
    else if (value && typeof value.seconds === 'number') {
      date = new Date(value.seconds * 1000);
    }
    // Se já é Date
    else if (value instanceof Date) {
      date = value;
    }
    // String ou number
    else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
