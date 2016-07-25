import {ContentfulService} from 'ng2-contentful';
import {HeaderMenuComponent} from './components/menu/header/header.component';
import {FooterMenuComponent} from './components/menu/footer/footer.component';
import {BreadcrumbsService, BreadcrumbsEvent} from './components/breadcrumbs/breadcrumbs.service';
import {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
import {RoutesManagerService} from './components/routes-gateway/routes-manager.service';
import {RoutesGatewayComponent} from './components/routes-gateway/routes-gateway.component';
import {ContenfulContent} from './components/contentful/contentful-content.service';
import {ContentfulImageDirective} from './components/entries-view/contentful-image.directive';
import {EmbeddedEntryComponent} from './components/entries-view/embedded-entry.component';
import {HtmlEntryComponent} from './components/entries-view/html-entry.component';
import {EntriesViewComponent} from './components/entries-view/entries-view.component';
import {VideoEntryComponent} from './components/entries-view/video-entry.component';
import {TagsComponent} from './components/tags/list-tags.component';
import {TagComponent} from './components/tags/tag.component';
import {MarkdownPipe} from './components/pipes/markdown.pipe';
import {ToDatePipe} from './components/pipes/to-date.pipe';
import {appInjector} from './components/contentful/app-injector.tool';
import {NodePageContent, Menu, TagPage} from './components/contentful/content-type.structures';
import {ProfileComponent} from './components/profile/profile.component';
import {ContributorsComponent} from './components/contributors/contributors.component';

import {
  ContentfulMenu,
  ContentfulNodePagesResponse,
  ContentfulNodePage,
  ContentfulTagPage
} from './components/contentful/aliases.structures';
import { RoutesGatewayGuard } from './components/routes-gateway/routes-gateway.guard';

export {HeaderMenuComponent};
export {FooterMenuComponent};
export {BreadcrumbsService, BreadcrumbsEvent};
export {BreadcrumbsComponent};
export {RoutesManagerService};
export {RoutesGatewayComponent};
export {ContenfulContent};
export {ContentfulImageDirective};
export {EmbeddedEntryComponent};
export {HtmlEntryComponent};
export {EntriesViewComponent};
export {VideoEntryComponent};
export {TagsComponent};
export {TagComponent};
export {MarkdownPipe};
export {ToDatePipe};
export {appInjector};
export {NodePageContent, Menu, TagPage};
export {ContentfulService};
export {ContributorsComponent};
export {ProfileComponent};
export {RoutesGatewayGuard};
export {
  ContentfulMenu,
  ContentfulNodePagesResponse,
  ContentfulNodePage,
  ContentfulTagPage
};

export const GAPMINDER_PROVIDERS: any[] = [
  {provide: BreadcrumbsService, useClass: BreadcrumbsService},
  {provide: RoutesManagerService, useClass: RoutesManagerService},
  {provide: ContenfulContent, useClass: ContenfulContent},
  {provide: ContentfulService, useClass: ContentfulService},
  {provide: RoutesGatewayGuard, useClass: RoutesGatewayGuard}
];
