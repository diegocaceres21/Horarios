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
  @Input() esMedicina: boolean = false;
  @Input() esDescuentoProntoPago: boolean = false;

  numeroDeCuotas : number = 4;
  descuentoProntoPago: number = 0.06;
  valorCredito!: number;
  pagoInicial!: number;
  saldoSemestre!: number;
  montoTotalSemestre!: number;
  pagoMensual!: number;

  ngOnInit(): void  {
    this.obtenerValorCredito()
    this.obtenerPagoInicial()
    this.obtenerPagoTotal()
    if(this.esDescuentoProntoPago){
      this.obtenerPagoTotalProntoPago()
      this.obtenerSaldoSemestre()
    }
    else{
      this.obtenerSaldoSemestre()
      this.obtenerPagoMensual() 
    }
  }
//TODO REFACTORIZAR ESTA FUNCION
  obtenerValorCredito(){
    if(this.esMedicina){
      this.valorCredito = 405;
    }
    else{
      this.valorCredito = 357;
    }
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

  obtenerPagoMensual(){
    this.pagoMensual = this.saldoSemestre / this.numeroDeCuotas;
  }
  

  obtenerPagoTotal(){
    this.montoTotalSemestre = (this.creditos * this.valorCredito) + this.valorCredito;
  }

  obtenerPagoTotalProntoPago(){
    this.montoTotalSemestre = ((this.montoTotalSemestre - this.valorCredito) * (1 - this.descuentoProntoPago)) + this.valorCredito;
  }
  obtenerSaldoSemestre(){
    this.saldoSemestre = this.montoTotalSemestre - this.pagoInicial - this.valorCredito;
  }

  obtenerSaldoProntoPago(){
    //this.saldoSemestre = this.montoTotalSemestre
  }
}
