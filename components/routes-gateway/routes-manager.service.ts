import { Injectable, Inject, Type } from '@angular/core';
import { Router, Route, RouterConfig } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class RoutesManagerService {
  private router: Router;
  private pathToName: Map<string, string>;
  private defaultArticleComponent: Type;
  private routes: RouterConfig;

  public constructor(router: Router,
                     @Inject('DefaultArticleComponent') defaultArticleComponent: Type,
                     @Inject('Routes') routes: RouterConfig) {
    this.router = router;
    this.routes = routes;
    this.pathToName = new Map<string, string>();
    this.defaultArticleComponent = defaultArticleComponent;
  }

  public getRouteName(path: string): string {
    return this.pathToName.get(path);
  }

  public addRoute(route: RawRoute): string {
    this.addRoutes([route]);
    return this.getRouteName(route.path);
  }

  public addRoutes(routes: RawRoute[]): void {
    const newRoutes: Route[] = _.chain(routes)
      .filter((route: RawRoute) => !this.containsRoute(route.path))
      .map((route: RawRoute) => {
        this.addPath(route.path);
        return {
          path: route.path,
          component: this.defaultArticleComponent,
          data: route.data
        };
      })
      .value();

    this._addRoutes(newRoutes);
  }

  public containsRoute(path: string): boolean {
    return !!this.findRouteByPath(path);
  }

  public findRouteByPath(path: string): Route {
    return _.find(this.routes, (route: any) => {
      return route.path === path;
    });
  }

  private _addRoutes(routes: Route[]): void {
    this.routes.unshift(... routes);
    this.router.resetConfig(this.routes);
  }

  private addPath(path: string): void {
    this.pathToName.set(path, `/${path}`);
  }
}

export interface RawRoute {
  path: string;
  data?: any;
}
