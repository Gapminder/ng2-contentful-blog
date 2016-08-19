import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationStart, Route } from '@angular/router';
import { CORE_DIRECTIVES } from '@angular/common';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-cover',
  template: require('./cover-image.html') as string,
  styles: [require('./cover-image.css') as string],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class CoverImageComponent implements OnInit {

  private router: Router;
  private cover: string;
  private routesManager: RoutesManagerService;

  public constructor(router: Router,
                     routesManager: RoutesManagerService) {
    this.router = router;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {

    this.router.events.filter((value: any) => value instanceof NavigationStart)
      .map((value: NavigationStart)=>this.routesManager.findRouteByPath(value.url.replace('/', '')))
      .filter((route: Route)=> !!route)
      .map((route: Route)=> route.data)
      .filter((data: RouteData)=> !!data)
      .subscribe((data: RouteData) => {
        this.cover = data.cover;
      });
  }
}

interface RouteData {
  name?: string;
  cover?: string;
}
