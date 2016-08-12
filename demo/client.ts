import 'angular2-universal/polyfills';
import { enableProdMode, ComponentRef, PLATFORM_DIRECTIVES } from '@angular/core';
import { prebootComplete } from 'angular2-universal';
import { DemoComponent } from './app';
import {Angulartics2, Angulartics2On} from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { HTTP_PROVIDERS } from '@angular/http';
import { APP_ROUTER_PROVIDER, appRoutes } from './routes';
import { GAPMINDER_PROVIDERS, ContentfulImageDirective, appInjector } from '../index';
import { APP_BASE_HREF } from '@angular/common';
import { DynamicContentDetailsComponent } from './components/dynamic-content/dynamic-content-details.component';
import { bootstrap } from '@angular/platform-browser-dynamic';

const ContentfulConfig = require('./contentTypeIds.json');
const Constants = require('./constants.json');

enableProdMode();

export function ngApp(): Promise<ComponentRef<any>> {
  return bootstrap(DemoComponent, [
    Angulartics2,
    Angulartics2GoogleAnalytics,
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDER,
    GAPMINDER_PROVIDERS,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: 'Routes', useValue: appRoutes},
    {provide: 'DefaultArticleComponent', useValue: DynamicContentDetailsComponent},
    {provide: 'ContentfulTypeIds', useValue: ContentfulConfig},
    {provide: 'Constants', useValue: Constants},
    {provide: PLATFORM_DIRECTIVES, useValue: ContentfulImageDirective, multi: true},
    {provide: PLATFORM_DIRECTIVES, useValue: Angulartics2On, multi: true}
  ]).then(
    (appRef:ComponentRef<any>) => {
      appInjector(appRef.injector);
      return appRef;
    }
  );
}

document.addEventListener('DOMContentLoaded', () => ngApp().then(prebootComplete));
