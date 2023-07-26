import { ChangeDetectorRef, Component } from '@angular/core';
import { NavItem } from './nav-item';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  header:string = 'La Jatata'
  menu: NavItem [] = [
    {
      displayName: 'Inicio',
      iconName: 'home',
      route: '/home'
    },        
    {
      displayName: 'Reservas',
      iconName: 'restaurant',
      route: '/reservas',
    },
    {
      displayName: 'Cocina',
      iconName: 'kitchen',
      route: '/cocina',
    },
    {
      displayName: 'Menu',
      iconName: 'menu_book',
      route: '/menu',
    },
    {
      displayName: 'Productos',
      iconName: 'brunch_dining',
      route: '/productos',
    },
    {
      displayName: 'Ventas',
      iconName: 'assessment',
      route: '/ventas',
    },
    {
      displayName: 'Meseros',
      iconName: 'face',
      route: '/waiters',
    }
  ];
  mobileQuery: MediaQueryList;
  selectedIndex: number =-1;
  title = 'La-Jatata';
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
