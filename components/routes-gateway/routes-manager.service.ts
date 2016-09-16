import { Injectable, Inject } from '@angular/core';
import { Router, Route, Routes } from '@angular/router';
import * as _ from 'lodash';
import { NodePageContent, Menu } from '../contentful/content-type.structures';
import { ContentfulNodePage, ContentfulSubmenu } from '../contentful/aliases.structures';

@Injectable()
export class RoutesManagerService {
  private router: Router;
  private pathToName: Map<string, string>;
  private defaultArticleComponent: any;
  private routes: Routes;

  public constructor(router: Router,
                     @Inject('DefaultArticleComponent') defaultArticleComponent: any,
                     @Inject('Routes') routes: Routes) {
    this.router = router;
    this.routes = routes;
    this.pathToName = new Map<string, string>();
    this.defaultArticleComponent = defaultArticleComponent;
  }

  public getRouteName(path: string): string {
    const registeredPath = this.pathToName.get(path);
    // fakePath is added to support angular2 universal server rendering
    // for some reason routes are requested from pathToName before they were actually registered
    // on the server. So fakePath it is path that would exist as if route was added
    const fakePath = `/${path}`;
    return registeredPath ? registeredPath : fakePath;
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

  public addRoutesFromArticles(... contentfulArticles: ContentfulNodePage[]): void {
    const rawRoutes: RawRoute[] = [];
    _.forEach(contentfulArticles, (contentfulArticle: ContentfulNodePage) => {
      rawRoutes.push(this.convertArticleToRawRoute(contentfulArticle));
    });
    this.addRoutes(rawRoutes);
  }

  public addRoutesFromMenus(... menus: Menu[]): void {
    const rawRoutes: RawRoute[] = [];
    _.forEach(menus, (menu: Menu) => {
      if (menu.entryPoint) {
        rawRoutes.push(this.convertArticleToRawRoute(menu.entryPoint));
      }

      _.forEach(menu.submenus, (submenu: ContentfulSubmenu) => {
        rawRoutes.push(this.convertArticleToRawRoute(submenu.fields.entryPoint));
      });
    });
    this.addRoutes(rawRoutes);
  }

  public containsRoute(path: string): boolean {
    return !!this.findRouteByPath(path);
  }

  public findRouteByPath(path: string): Route {
    return _.find(this.routes, (route: any) => {
      return route.path === path;
    });
  }

  private convertArticleToRawRoute(contentfulArticle: ContentfulNodePage): RawRoute {
    const article: NodePageContent = contentfulArticle.fields;
    const cover = article.cover ? article.cover.sys.id : undefined;
    return {path: article.url || article.slug, data: {name: article.title, cover}};
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
