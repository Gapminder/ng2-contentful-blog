import {Component, OnInit, Inject, Type} from '@angular/core';
import {RouterLink, Router, RouteDefinition, Instruction} from '@angular/router-deprecated';
import {BreadcrumbsService} from './breadcrumbs.service';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {RoutesGatewayService} from '../routesGateway/routes-gateway.service';
import {Angulartics2On} from 'angulartics2/index';

@Component({
  selector: 'gm-breadcrumbs',
  template: require('./breadcrumbs.html') as string,
  styles: [require('./breadcrumbs.css') as string],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, RouterLink, Angulartics2On]
})
export class BreadcrumbsComponent implements OnInit {
  public type: string = 'Breadcrumbs Component';

  private router: Router;
  private rootComponent: Type;
  private breadcrumbsService: BreadcrumbsService;
  private routesGatewayService: RoutesGatewayService;
  private routeDefinition: RouteDefinition[];
  private isOnRootView: boolean;
  private urls: string[] = [];
  private breadcrumbFragmentName: string;

  public constructor(@Inject(Router) router: Router,
                     @Inject('RootComponent') rootComponent: Type,
                     @Inject(BreadcrumbsService)  breadcrumbsService: BreadcrumbsService,
                     @Inject(RoutesGatewayService)  routesGatewayService: RoutesGatewayService) {
    this.router = router;
    this.rootComponent = rootComponent;
    this.breadcrumbsService = breadcrumbsService;
    this.routesGatewayService = routesGatewayService;
    this.routeDefinition = this.routesGatewayService.getRouteDefinitions(this.rootComponent);
  }

  public ngOnInit(): any {

    this.breadcrumbsService.breadcrumbs$.subscribe((res: any)=> {
      this.router.recognize(res.url).then((instruction: Instruction) => {
        this.urls = [];
        this.breadcrumbFragmentName = res.name;
        this.generateBreadcrumbTrail(res.url);
        // this.isOnRootView = instruction.component.componentType === RootComponent;
        this.isOnRootView = instruction.component.routeName === 'Root';
      });
    });
  }

  public generateBreadcrumbTrail(url: string): void {
    this.urls.unshift(url);
    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/')));
    }
  }

  public friendlyName(url: string): string {
    if (this.routeDefinition && url) {
      let route: RouteDefinition;
      for (let item of this.routeDefinition) {
        route = item;
        if (url === route.path) {
          return route.data ? route.data.name : route.path;
        }
      }
    }
    return this.breadcrumbFragmentName;
  }

}
