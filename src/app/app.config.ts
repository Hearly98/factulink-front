import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { SidebarModule } from '@coreui/angular';
import { authInterceptor } from './core/auth/interceptor/auth.interceptor';
import { errorInterceptor } from './core/auth/interceptor/error.interceptor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppInitializerService } from './core/services/app-initializer.service';

/**
 * Factory function para inicializar la aplicación
 * Carga los permisos del usuario si hay una sesión activa
 */
export function initializeApp(appInitializer: AppInitializerService) {
  return () => appInitializer.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      SidebarModule,
      NgxPermissionsModule.forRoot()
    ),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializerService],
      multi: true
    }
  ]
};
