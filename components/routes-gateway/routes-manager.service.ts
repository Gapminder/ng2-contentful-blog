import { Injectable, Inject, Type } from '@angular/core';
import { Router, Route, provideRouter, RouterConfig } from '@angular/router';
import { RootDemoComponent } from '../../demo/components/root/root-demo';
import { TagComponent } from '../tags/tag.component';
import { ProfileComponent } from '../profile/profile.component';
import { RoutesGatewayComponent } from './routes-gateway.component';
import * as _ from 'lodash';
import { RoutesGatewayGuard } from './routes-gateway.guard';

const appRoutes: RouterConfig = [
  {path: '', component: RootDemoComponent},
  {path: 'tag/:tag', component: TagComponent},
  {path: 'profile/:userName', component: ProfileComponent},
  {path: '**', component: RoutesGatewayComponent, canActivate: [RoutesGatewayGuard]}
];

export const APP_ROUTER_PROVIDER = provideRouter(appRoutes);

@Injectable()
export class RoutesManagerService {
  private router: Router;
  private pathToName: Map<string, string>;
  private defaultArticleComponent: Type;

  public constructor(router: Router,
                     @Inject('DefaultArticleComponent') defaultArticleComponent: Type) {
    this.router = router;
    this.pathToName = new Map<string, string>();
    this.defaultArticleComponent = defaultArticleComponent;
  }

  public getRouteName(path: string): string {
    return this.pathToName.get(path);
  }

  public addRoute(path: string, data?: any): string {
    if (!this.containsRoute(path)) {
      this._addRoute({
        path: path,
        component: this.defaultArticleComponent,
        data: data
      });

      this.pathToName.set(path, `/${path}`);
    }
    return this.getRouteName(path);
  }

  public containsRoute(path: string): boolean {
    return !!this.findRouteByPath(path);
  }

  public findRouteByPath(path: string): Route {
    return _.find(appRoutes, (route: any) => {
      return route.path === path;
    });
  }

  private _addRoute(route: Route): void {
    appRoutes.unshift(route);
    this.router.resetConfig(appRoutes);
  }
}
