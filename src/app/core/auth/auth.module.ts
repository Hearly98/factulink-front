/*
// Angular
import { NgModule } from '@angular/core';
// Auth
import { AuthGuard } from './guards/auth.guard';
// OAuthModule
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';
import { UsersService } from 'src/app/users/core/services/users.service';
import { PermissionService } from '@base/permissions/services/permission.service';

// https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/configure-custom-oauthstorage.html
// We need a factory, since localStorage is not available during AOT build time.
export function storageFactory(): OAuthStorage {
  return localStorage
}

@NgModule({
  declarations: [],
  imports: [
    OAuthModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AuthService,
    UsersService,
    PermissionService,
    {
      provide: OAuthStorage,
      useFactory: storageFactory
    }
  ]
})
export class AuthModule {

}
*/