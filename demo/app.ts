import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationStart } from '@angular/router';
import { Ng2ContentfulConfig } from 'ng2-contentful';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BreadcrumbsService, BreadcrumbsComponent } from '../index';
import { HeaderMenuComponent } from '../components/menu/header/header-menu.component';
import { ShareFooterLineComponent } from '../components/share-btn/share-line-footer.component';
import { FooterComponent } from '../components/footer/footer.component';

declare var CONTENTFUL_ACCESS_TOKEN: string;
declare var CONTENTFUL_SPACE_ID: string;
declare var CONTENTFUL_HOST: string;

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
      <div class='container'>
        <gm-breadcrumbs></gm-breadcrumbs>
        <router-outlet></router-outlet>
      </div>
      <gm-footer></gm-footer>
      <gm-share-line-footer *ngIf="showShareLine"></gm-share-line-footer>
    </div>
    `,
  directives: [ROUTER_DIRECTIVES, ShareFooterLineComponent, HeaderMenuComponent, FooterComponent, BreadcrumbsComponent]
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
