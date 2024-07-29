import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-plan-pago',
  templateUrl: './tabla-plan-pago.component.html',
  styleUrls: ['./tabla-plan-pago.component.scss']
})
export class TablaPlanPagoComponent {
  @Input() plan: string = "";
  @Input() creditos: number = 0;
}
