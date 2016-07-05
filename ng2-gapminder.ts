import {BreadcrumbsService} from './components/breadcrumbs/breadcrumbs.service';
import {DynamicRouteConfigurator} from './components/routesGateway/dynamic-route-configurator.service';
import {ContenfulContent} from './components/contentfulService/contentful-content.service';
import {RoutesGatewayService} from './components/routesGateway/routes-gateway.service';
import {ContentfulService} from 'ng2-contentful/src';

export {HeaderMenuComponent} from './components/menu/header/header.component';
export {FooterMenuComponent} from './components/menu/footer/footer.component';
export {BreadcrumbsService, BreadcrumbsEvent} from './components/breadcrumbs/breadcrumbs.service';
export {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
export {DynamicRouteConfigurator} from './components/routesGateway/dynamic-route-configurator.service';
export {RoutesGatewayService} from './components/routesGateway/routes-gateway.service';
export {RoutesGatewayComponent} from './components/routesGateway/routes-gateway.component';
export {ContenfulContent} from './components/contentfulService/contentful-content.service';
export {ContentfulImageDirective} from './components/entries-view/contentful-image.directive';
export {EmbeddedEntryComponent} from './components/entries-view/embedded-entry.component';
export {HtmlEntryComponent} from './components/entries-view/html-entry.component';
export {EntriesViewComponent} from './components/entries-view/entries-view.component';
export {VideoEntryComponent} from './components/entries-view/video-entry.component';
export {TagsComponent} from './components/tags/list-tags.component';
export {TagComponent} from './components/tags/tag.component';
export {MarkdownPipe} from './components/pipes/markdown.pipe';
export {ToDatePipe} from './components/pipes/to-date.pipe';
export {appInjector} from './components/contentfulService/app-injector.tool';
export {NodePageContent, Menu, TagPage} from './components/contentfulService/content-type.structures';
export {
  ContentfulMenu,
  ContentfulNodePagesResponse,
  ContentfulNodePage,
  ContentfulTagPage
} from './components/contentfulService/aliases.structures';
export {ContentfulService} from 'ng2-contentful/src';

export const GAPMINDER_PROVIDERS: any[] = [
  {provide: BreadcrumbsService, useClass: BreadcrumbsService},
  {provide: DynamicRouteConfigurator, useClass: DynamicRouteConfigurator},
  {provide: RoutesGatewayService, useClass: RoutesGatewayService},
  {provide: ContenfulContent, useClass: ContenfulContent},
  {provide: ContentfulService, useClass: ContentfulService}
];
