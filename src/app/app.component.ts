import { ChangeDetectorRef, Component } from '@angular/core';
import { NavItem } from './nav-item';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  header: string = '';
  menu: NavItem[] = [
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
    },
    {
      displayName: 'Simulador de pagos',
      iconName: 'payments',
      route: '',
    }
  ];
  mobileQuery: MediaQueryList;
  selectedIndex: number = -1;
  title = 'UCB';
  message: any = null;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  changeTitle(title: string) {
    this.header = title;
  }

  select(index: number) {
    this.selectedIndex = index;
    if (this.menu[index].displayName === 'Simulador de pagos') {
      window.open('https://cba.ucb.edu.bo/simulador-pagos/login', '_blank');
    }
  }

  ngOnInit(): void {
    // this.requestPermission();
    // this.listen();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
