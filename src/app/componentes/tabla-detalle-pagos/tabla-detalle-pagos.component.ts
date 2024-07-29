import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tabla-detalle-pagos',
  templateUrl: './tabla-detalle-pagos.component.html',
  styleUrls: ['./tabla-detalle-pagos.component.scss']
})
export class TablaDetallePagosComponent implements OnInit {
  @Input() plan!: string;
  @Input() titulo! : string;
  @Input() creditos!: number;
  @Input() valorCredito!: number
  @Input() esMedicina: boolean = false;
  pagoInicial!: number

  ngOnInit(): void  {
    this.obtenerPagoInicial()
  }

  obtenerPagoInicial(){
    //PARA MEDICINA EL PLAN ESTANDAR SON 5 CREDITOS
    if(this.plan == "ESTANDAR"){
      this.pagoInicial = 4 * this.valorCredito
    }
    else if(this.plan == "AHORRO"){
      this.pagoInicial = 9 * this.valorCredito
    }
    else if(this.plan == "PLUS"){
      this.pagoInicial = 12 * this.valorCredito
    }
  }
}
