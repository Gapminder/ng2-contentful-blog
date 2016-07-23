import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, Route } from '@angular/router';
import { BreadcrumbsService, BreadcrumbsEvent } from './breadcrumbs.service';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Angulartics2On } from 'angulartics2';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-breadcrumbs',
  template: require('./breadcrumbs.html') as string,
  styles: [require('./breadcrumbs.css') as string],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, Angulartics2On]
})
export class BreadcrumbsComponent implements OnInit {
  public type: string = 'Breadcrumbs Component';

  private router: Router;
  private breadcrumbsService: BreadcrumbsService;
  private isOnRootView: boolean;
  private hideItem: boolean = false;
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
      this.isOnRootView = res.url === '/' || res.url === '';
    });
  }

  public generateBreadcrumbTrail(url: string): void {
    this.urls.unshift(url);
    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/')));
    }
  }

  public friendlyName(url: string): string {
    if (url === 'profile' || url === 'tag') {
      this.hideItem = true;
    }

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
