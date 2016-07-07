import {bootstrap} from '@angular/platform-browser-dynamic';
import {
  Component, Inject, provide, OnInit, ComponentRef, PLATFORM_DIRECTIVES, ViewEncapsulation
} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Router} from '@angular/router-deprecated';
import {Ng2ContentfulConfig} from 'ng2-contentful';
import {Angulartics2} from 'angulartics2/index';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {
  HeaderMenuComponent,
  FooterMenuComponent,
  RoutesGatewayService,
  BreadcrumbsService,
  BreadcrumbsComponent,
  RoutesGatewayComponent,
  ContentfulImageDirective,
  TagComponent,
  GAPMINDER_PROVIDERS
} from '../index';
import {RootDemoComponent} from './components/root/root-demo';
import {appInjector} from '../components/contentfulService/app-injector.tool';
import {DynamicContentDetailsComponent} from './components/dynamic-content/dynamic-content-details.component';

const ContentfulConfig = require('./constIdContentType.json');
declare var CONTENTFUL_ACCESS_TOKEN: string;
declare var CONTENTFUL_SPACE_ID: string    ;
declare var CONTENTFUL_HOST: string;

// contentful config
Ng2ContentfulConfig.config = {
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  space: CONTENTFUL_SPACE_ID,
  host: CONTENTFUL_HOST
};

@Component({
  selector: 'gm-app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./main.styl') as string
  ],
  template: `
    <header>
      <div class="navbar navbar-fixed-top">
        <div class="container">
          <div class="row">
             <gm-header-menu></gm-header-menu>
            </div>
          </div>
        </div>
    </header>
     <div class='container'>
        <gm-breadcrumbs></gm-breadcrumbs>
        <router-outlet></router-outlet>
      </div>
     <div class='container'>
      <gm-footer-menu></gm-footer-menu>
    </div>
    `,
  directives: [...ROUTER_DIRECTIVES, HeaderMenuComponent, FooterMenuComponent, BreadcrumbsComponent]
})
@RouteConfig([
  {path: '/', name: 'Root', component: RootDemoComponent, useAsDefault: true},
  {path: '/tag/:tag', component: TagComponent, name: 'TagComponent'},
  {path: '/**', component: RoutesGatewayComponent}

])
export class DemoComponent implements OnInit {
  private angulartics2: Angulartics2;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private breadcrumbsService: BreadcrumbsService;
  private routesGatewayService: RoutesGatewayService;
  private router: Router;

  public constructor(@Inject(Router) router: Router,
                     @Inject(Angulartics2) angulartics2: Angulartics2,
                     @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     @Inject(BreadcrumbsService) breadcrumbsService: BreadcrumbsService,
                     @Inject(RoutesGatewayService) routesGatewayService: RoutesGatewayService) {
    this.angulartics2 = angulartics2;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.breadcrumbsService = breadcrumbsService;
    this.routesGatewayService = routesGatewayService;
    this.router = router;
  }

  public ngOnInit(): any {
    this.routesGatewayService.setConstructorOfRouterComponentInstance(this.constructor);

    this.router.subscribe(() => {
      this.breadcrumbsService.breadcrumbs$.next({url: '/', name: 'Home'});

    });
  }
}

bootstrap(DemoComponent, [
  ...ROUTER_PROVIDERS,
  ...HTTP_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  Angulartics2,
  Angulartics2GoogleAnalytics,
  GAPMINDER_PROVIDERS,
  provide('ComponentUseDefault', {useValue: DynamicContentDetailsComponent}),
  provide('RootComponent', {useValue: DemoComponent}),
  provide('ContentfulConstantId', {useValue: ContentfulConfig}),
  provide(PLATFORM_DIRECTIVES, {
    useValue: ContentfulImageDirective, multi: true
  })
]).then(
  (appRef: ComponentRef<any>) => {
    appInjector(appRef.injector);
  }
);

