import { ChangeDetectorRef, Component } from '@angular/core';
import { NavItem } from './nav-item';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  header:string = ''
  menu: NavItem [] = [
    {
      displayName: 'Nuevo Horario',
      iconName: 'edit_calendar',
      route: 'crearHorario'
    },
    {
      displayName: 'Horarios Definidos',
      iconName: 'list_alt',
      route: 'opciones',
    },
    {
      displayName: 'Planes de Estudio',
      iconName: 'summarize',
      route: 'cocina',
    },
    {
      displayName: 'Cupos Materias',
      iconName: 'query_stats',
      route: 'cupos-materias',
    },
    {
      displayName: 'Cupos Opciones',
      iconName: 'query_stats',
      route: 'cupos-opciones',
    },
    {
      displayName: 'Reporte Power BI',
      iconName: 'analytics',
      route: 'reportes',
    },/*
    {
      displayName: 'Simulador',
      iconName: 'payments',
      route: 'simulador-pagos',
      disabled: true
    },
    {
      displayName: 'Revisar pagos',
      iconName: 'payments',
      route: 'settings',
      disabled: true
    },
    {
      displayName: 'Configuración',
      iconName: 'settings',
      route: 'settings',
      disabled: true
    }*/
  ];
  mobileQuery: MediaQueryList;
  selectedIndex: number =-1;
  title = 'UCB';
  message:any = null;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  changeTitle(title:string){
    this.header = title;
  }
  select(index: number) {
    this.selectedIndex = index;
  }
  ngOnInit(): void {
    //this.requestPermission();
    //this.listen();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
