import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { widgets } from '../data/widgets';

@Injectable({
  providedIn: 'root'
})
export class WidgetGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let widgetUrl = next.routeConfig.path;
      return widgets.some((widget) => {
        return widget.isExtended && widget.routerLink === widgetUrl;
      })
  }
  
}
