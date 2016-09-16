import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewEncapsulation, HostListener, NgModule, NgModuleRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Ng2ContentfulConfig, ContentfulService } from 'ng2-contentful';
import { Angulartics2, Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Ng2ContentfulBlogModule } from '../index';
import { HttpModule } from '@angular/http';
import { routing, routes } from './routes';
import { appInjector } from '../components/contentful/app-injector.tool';
import { DynamicContentDetailsComponent } from './components/dynamic-content/dynamic-content-details.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BreadcrumbsService } from '../components/breadcrumbs/breadcrumbs.service';
import { RootDemoComponent } from './components/root/root-demo';

declare var CONTENTFUL_ACCESS_TOKEN: string;
declare var CONTENTFUL_SPACE_ID: string;
declare var CONTENTFUL_HOST: string;

Ng2ContentfulConfig.config = {
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  space: CONTENTFUL_SPACE_ID,
  host: CONTENTFUL_HOST
};

const ContentfulConfig = require('./contentTypeIds.json');
const Constants = require('./constants');

@Component({
  selector: 'gm-app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./main.styl') as string
  ],
  template: `
   <div class="page-wrap">
      <header>
        <div id="goTo" class="navbar navbar-fixed-top">
          <div class="container">
            <div class="row">
              <gm-header-menu></gm-header-menu>
            </div>
          </div>
        </div>
      </header>
      <gm-cover></gm-cover>
      <div class='container'>
        <gm-breadcrumbs></gm-breadcrumbs>
       <router-outlet></router-outlet>
      </div>
      <gm-footer></gm-footer>
      <gm-share-line-footer [hidden]="!showShareLine"></gm-share-line-footer>
    </div>
    `
})
export class DemoComponent implements OnInit {
  private angulartics2: Angulartics2;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private breadcrumbsService: BreadcrumbsService;
  private router: Router;
  private showShareLine: boolean;

  @HostListener('window:scroll', ['$event'])
  public onScroll(): any {
    const pageYOffset: number = this.getPageYOffset();
    const pageHasScrollToBottom: boolean = pageYOffset >= 50;
    this.showShareLine = pageHasScrollToBottom;
  }

  public constructor(router: Router,
                     angulartics2: Angulartics2,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     breadcrumbsService: BreadcrumbsService) {
    this.angulartics2 = angulartics2;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.breadcrumbsService = breadcrumbsService;
    this.router = router;
  }

  public ngOnInit(): any {
    this.router.events.filter((value: any) => value instanceof NavigationStart && value.url === '/')
      .subscribe((value: NavigationStart) => {
        this.breadcrumbsService.breadcrumbs$.next({url: value.url, name: 'Home', show: false});
      });
  }

  private  getPageYOffset(): number {
    return typeof window !== 'undefined' ? window.pageYOffset : 0;
  }
}

@NgModule({
  declarations: [
    DemoComponent,
    DynamicContentDetailsComponent,
    RootDemoComponent
  ],
  imports: [
    BrowserModule,
    Ng2ContentfulBlogModule,
    Angulartics2Module.forRoot(),
    HttpModule,
    routing
  ],
  entryComponents: [DynamicContentDetailsComponent],
  providers: [
    ContentfulService,
    Angulartics2GoogleAnalytics,
    {provide: 'Routes', useValue: routes},
    {provide: 'DefaultArticleComponent', useValue: DynamicContentDetailsComponent},
    {provide: 'ContentfulTypeIds', useValue: ContentfulConfig},
    {provide: 'Constants', useValue: Constants}
  ],
  bootstrap: [DemoComponent]
})

export class DemoModule {
}

platformBrowserDynamic().bootstrapModule(DemoModule).then(
  (appRef: NgModuleRef<any>) => {
    // (appRef: ComponentRef<any>) => {
    appInjector(appRef.injector);
    return appRef;
  });
