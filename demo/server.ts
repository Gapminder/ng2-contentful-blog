// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';
import * as path from 'path';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { enableProdMode, PLATFORM_DIRECTIVES } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import {
  expressEngine,
  ORIGIN_URL,
  REQUEST_URL,
  NODE_HTTP_PROVIDERS,
  NODE_LOCATION_PROVIDERS,
  ExpressEngineConfig
} from 'angular2-universal';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { DemoComponent } from './app';
import { appRoutes, APP_ROUTER_PROVIDER } from './routes';
import { DynamicContentDetailsComponent } from './components/dynamic-content/dynamic-content-details.component';
import { GAPMINDER_PROVIDERS, ContentfulImageDirective } from '../index';

const ContentfulConfig = require('./contentTypeIds.json');

// enable prod for faster renders
enableProdMode();

const app: Application = express();

const ROOT = path.join(path.resolve(__dirname, '..'));
const pathToStaticContent = path.join(ROOT, '/dist/client');

app.engine('.html', expressEngine);
app.set('views', pathToStaticContent);
app.set('view engine', 'html');

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
app.use(express.static(pathToStaticContent, {index: false}));

// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/**', ngApp);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

function ngApp(req: Request, res: Response): void {
  const baseUrl = '/';
  const url = req.originalUrl || baseUrl;

  const config: ExpressEngineConfig = {
    directives: [
      DemoComponent
    ],
    platformProviders: [
      {provide: ORIGIN_URL, useValue: 'http://localhost:3000'},
      {provide: APP_BASE_HREF, useValue: baseUrl}
    ],
    providers: [
      Angulartics2,
      Angulartics2GoogleAnalytics,
      GAPMINDER_PROVIDERS,
      {provide: 'ContentfulTypeIds', useValue: ContentfulConfig},
      {provide: 'Routes', useValue: appRoutes},
      {provide: 'DefaultArticleComponent', useValue: DynamicContentDetailsComponent},
      {provide: REQUEST_URL, useValue: url},
      NODE_HTTP_PROVIDERS,
      APP_ROUTER_PROVIDER,
      NODE_LOCATION_PROVIDERS,
      {provide: PLATFORM_DIRECTIVES, useValue: ContentfulImageDirective, multi: true}
    ],
    async: true,
    preboot: false
  };

  res.render('index', config);
}
