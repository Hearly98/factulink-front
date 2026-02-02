// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Routing
import { MenuOptionsRoutingModule } from './menu-options-routing.module';
// Services - Ya están provistos en 'root', no es necesario declararlos aquí
// import { MenuOptionsService } from './services/menu-options.service';
// import { MenuOptionsNavService } from './services/menu-options-nav.service';

/**
 * @deprecated Este módulo se mantiene por compatibilidad.
 * Los servicios MenuOptionsService y MenuOptionsNavService están provistos en 'root'
 * y se pueden inyectar directamente sin necesidad de importar este módulo.
 */
@NgModule({
  imports: [
    CommonModule,
    MenuOptionsRoutingModule,
  ],
  providers: [
    // Los servicios ya están provistos en 'root'
  ],
  declarations: []
})
export class MenuOptionsModule {

}
