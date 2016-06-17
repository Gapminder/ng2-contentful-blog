import {Injectable, Inject} from '@angular/core';
import {RouteRegistry, RouteDefinition} from '@angular/router-deprecated';
import * as _ from 'lodash/index';
import * as Reflect from 'es7-reflect-metadata';

@Injectable()
export class DynamicRouteConfigurator {
  private registry: RouteRegistry;

  public constructor(@Inject(RouteRegistry) registry: RouteRegistry) {
    this.registry = registry;
  }

  // TODO: change type `component: Type`
  public addRoute(component: any, route: RouteDefinition): void {
    let routeConfig: any = this.getRoutes(component);
    routeConfig.configs.push(route);
    this.updateRouteConfig(component, routeConfig);
    this.registry.config(component, route);
  }

  public getRoutes(component: any): RouteDefinition[] {
    return Reflect.getMetadata('annotations', component)
      .filter((annotation: any) => {
        return annotation.constructor.name === 'RouteConfig';
      }).pop();
  }

  public containsRoute(component: any, path: string): boolean {
    const routes: any = this.getRoutes(component);
    const result = _.find(routes.configs, (route: any) => {
      return route.path === path;
    });

    return !!result;
  }

  private updateRouteConfig(component: any, routeConfig: RouteDefinition[]): void {
    let annotations = Reflect.getMetadata('annotations', component);
    let routeConfigIndex = -1;
    for (let i = 0; i < annotations.length; i += 1) {
      if (annotations[i].constructor.name === 'RouteConfig') {
        routeConfigIndex = i;
        break;
      }
    }
    if (routeConfigIndex < 0) {
      throw new Error('No route metadata attached to the component');
    }
    annotations[routeConfigIndex] = routeConfig;
    Reflect.defineMetadata('annotations', annotations, component);
  }
}
