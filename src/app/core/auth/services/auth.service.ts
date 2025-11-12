/*
import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { User } from "../../../users/core/models/user";
import { UsersService } from "../../../users/core/services/users.service";
import { ResponseBaseDto } from "../../../base/models/api/response-base.dto";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
  user$: Subject<User>;
  access_token_key = `access_token_${environment.application.code}`;

  constructor(private router: Router, private usersService: UsersService) {
    this.user$ = new Subject<User>();
  }

  public loadUserProfile() {
    const claims = this.getUserClaims();
    if (claims) {
      const user = new User();

      user.id = claims.UserId;
      user.email = claims.Email == "no_information" ? "" : claims.Email;
      user.username = claims.UserName;
      user.fullname = claims.DisplayName;
      user.roles = claims.role;
      user.empresaId = claims.IdEmpresa;
      localStorage.setItem(
        `sucursal_${environment.application.code}`,
        claims.Sucursales
      );
      this.user$.next(user);

      return user;
    }
    return null;
  }

  public getUserClaims(): any {
    const access_token = this.getToken();
    if (access_token) return jwt_decode(access_token);
    return null;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.access_token_key);
  }

  public isAuthenticated(): boolean {
    const claims = this.getUserClaims();
    const isValid = claims != null && claims != undefined;
    if (isValid && claims.ApplicationCode == environment.application.code) {
      return isValid;
    } else {
      return false;
    }
  }

  public logIn(accessToken: any): void {
    if (accessToken) {
      if (accessToken.access_token) {
        localStorage.setItem(this.access_token_key, accessToken.access_token);
        this.loadUserProfile();
      }
    }
  }

  public logOut(): Observable<ResponseBaseDto> {
    return this.usersService.logout().pipe(
      map((result) => {
        if (result.isValid) {
          this.cleanAndRedirect();
        }
        return result;
      })
    );
  }

  public logoutSession(): void {
    const userClaims = this.getUserClaims();
    if (userClaims) {
      const logId = userClaims.LogId ?? userClaims.logId;
      if (logId) {
        this.usersService.logoutSession(logId).subscribe(
          (_) => {},
          (_) => {},
          () => {
            this.cleanAndRedirect();
          }
        );
      } else {
        this.cleanAndRedirect();
      }
    } else {
      this.cleanAndRedirect();
    }
  }

  public cleanAndRedirect() {
    localStorage.removeItem("menuConfigV1");
    localStorage.removeItem(this.access_token_key);
    sessionStorage.clear();
    this.router.navigate(["user/login"]);
  }

  public getUserClaim(claimName: string): any {
    return null;
  }

  public getRoles(): string[] {
    const claims = this.getUserClaims();
    return Array.isArray(claims.role)
      ? claims.role
      : claims.role
      ? [claims.role]
      : [];
  }

  public hasRole(roleName: string) {
    const role = this.getRoles().find((x) => x === roleName);
    return role !== null && role !== undefined && role !== "";
  }

  public saveCredentials(processId: string, password: string) {
    sessionStorage.setItem(processId, password);
  }

  public getCredentials(processId: string): string | null {
    return sessionStorage.getItem(processId);
  }

  public getRemoveCredentials(_: string) {
    sessionStorage.clear();
  }

  public keepAlive() {
    const access_token = this.getToken();
    if (access_token) {
      const tokeninfo = JSON.parse(atob(access_token.split(".")[1]));
      const exp = parseInt(tokeninfo.exp);

      const actual = new Date();
      const expiration = new Date(exp * 1000);
      const seconds_between = (+expiration - +actual) / 1000;

      if (seconds_between <= 300) {
        //5 minutes before session expires
        this.usersService.renewSession().subscribe((response) => {
          if (response) {
            if (response.data) {
              if (response.data.access_token) {
                localStorage.setItem(
                  this.access_token_key,
                  response.data.access_token
                );
                this.loadUserProfile();
              }
            }
          }
        });
      }
    }
  }
}


*/
