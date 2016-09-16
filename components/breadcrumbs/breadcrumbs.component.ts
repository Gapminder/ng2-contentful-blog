import { Component, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { BreadcrumbsService, BreadcrumbsEvent } from './breadcrumbs.service';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-breadcrumbs',
  template: require('./breadcrumbs.html') as string,
  styles: [require('./breadcrumbs.css') as string]
})
export class BreadcrumbsComponent implements OnInit {
  public type: string = 'Breadcrumbs Component';

  private router: Router;
  private breadcrumbsService: BreadcrumbsService;
  private showBreadcrumbs: boolean = true;
  private urls: string[] = [];
  private breadcrumbFragmentName: string;
  private routesManager: RoutesManagerService;

  public constructor(router: Router,
                     breadcrumbsService: BreadcrumbsService,
                     routesManager: RoutesManagerService) {
    this.router = router;
    this.breadcrumbsService = breadcrumbsService;
    this.routesManager = routesManager;
  }

  public ngOnInit(): any {
    this.breadcrumbsService.breadcrumbs$.subscribe((res: BreadcrumbsEvent)=> {
      this.urls = [];
      this.breadcrumbFragmentName = res.name;
      this.generateBreadcrumbTrail(res.url);
      this.showBreadcrumbs = res.show !== false;
    });
  }

  public generateBreadcrumbTrail(url: string): void {
    this.urls.unshift(url);
    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/')));
    }
  }

  public friendlyName(url: string): string {
    const route: Route = this.routesManager.findRouteByPath(url);
    return route ? this.getRouteName(route) : this.breadcrumbFragmentName;
  }

  private getRouteName(route: Route): string {
    return route.data ? (route.data as RouteData).name : route.path;
  }
}

interface RouteData {
  name?: string;
}
