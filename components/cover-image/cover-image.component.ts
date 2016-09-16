import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Route } from '@angular/router';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-cover',
  template: require('./cover-image.html') as string,
  styles: [require('./cover-image.css') as string]
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
    this.router.events
      .filter((value: any) => value instanceof NavigationStart)
      .map((value: NavigationStart) => this.routesManager.findRouteByPath(value.url.replace('/', '')))
      .subscribe((route: Route) => {
        this.cover = route && route.data && (route.data as RouteData).cover;
      });
  }
}

interface RouteData {
  name?: string;
  cover?: string;
}
