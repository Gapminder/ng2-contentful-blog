import { ContentfulService } from 'ng2-contentful';
import { HeaderMenuComponent } from './components/menu/header/header-menu.component';
import { FooterMenuComponent } from './components/menu/footer/footer-menu.component';
import { BreadcrumbsService } from './components/breadcrumbs/breadcrumbs.service';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RoutesManagerService } from './components/routes-gateway/routes-manager.service';
import { RoutesGatewayComponent } from './components/routes-gateway/routes-gateway.component';
import { ContenfulContent } from './components/contentful/contentful-content.service';
import { ContentfulImageDirective } from './components/entries-view/contentful-image.directive';
import { EmbeddedEntryComponent } from './components/entries-view/embedded-entry.component';
import { HtmlEntryComponent } from './components/entries-view/html-entry.component';
import { EntriesViewComponent } from './components/entries-view/entries-view.component';
import { VizabiEntryComponent } from './components/entries-view/vizabi-entry.component';
import { VideoEntryComponent } from './components/entries-view/video-entry.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagComponent } from './components/tags/tag.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ContributorsComponent } from './components/contributors/contributors.component';
import { ShareComponent } from './components/share-btn/share.component';
import { ShareFooterLineComponent } from './components/share-btn/share-line-footer.component';
import { MenuService } from './components/menu/menu.service';
import { RelatedComponent } from './components/related/related.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoverImageComponent } from './components/cover-image/cover-image.component';
import { RoutesGatewayGuard } from './components/routes-gateway/routes-gateway.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToDatePipe } from './components/pipes/to-date.pipe';
import { MarkdownPipe } from './components/pipes/markdown.pipe';
import { Angulartics2Module } from 'angulartics2';
import { CollapseModule, DropdownModule } from 'ng2-bootstrap';
import {
  NodePageContent, Menu, TagPage
} from './components/contentful/content-type.structures';
import {
  ContentfulMenu,
  ContentfulNodePage,
  ContentfulTagPage,
  ContentfulImage,
  ContentfulProfilePage
} from './components/contentful/aliases.structures';
import { LatestComponent } from './components/entries-view/latest.component';
import { CoverService } from './components/cover-image/cover.service';

export { HeaderMenuComponent };
export { FooterMenuComponent };
export { BreadcrumbsService };
export { BreadcrumbsComponent };
export { RoutesManagerService };
export { RoutesGatewayComponent };
export { ContenfulContent };
export { ContentfulImageDirective };
export { EmbeddedEntryComponent };
export { VizabiEntryComponent };
export { HtmlEntryComponent };
export { EntriesViewComponent };
export { VideoEntryComponent };
export { TagsComponent };
export { TagComponent };
export { MarkdownPipe };
export { ToDatePipe };
export { ContentfulService };
export { ContributorsComponent };
export { ProfileComponent };
export { RoutesGatewayGuard };
export { ShareFooterLineComponent };
export { ShareComponent };
export { MenuService };
export { RelatedComponent };
export { FooterComponent };
export { CoverImageComponent };
export { LatestComponent };
export { CoverService };
export {
  NodePageContent,
  Menu,
  TagPage
}
export {
  ContentfulMenu,
  ContentfulImage,
  ContentfulNodePage,
  ContentfulTagPage,
  ContentfulProfilePage
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule,
    CollapseModule,
    Angulartics2Module.forRoot()
  ],
  declarations: [
    BreadcrumbsComponent,
    LatestComponent,
    RoutesGatewayComponent,
    ContentfulImageDirective,
    EmbeddedEntryComponent,
    VizabiEntryComponent,
    HtmlEntryComponent,
    EntriesViewComponent,
    VideoEntryComponent,
    TagsComponent,
    TagComponent,
    HeaderMenuComponent,
    FooterMenuComponent,
    ContributorsComponent,
    ProfileComponent,
    ShareFooterLineComponent,
    ShareComponent,
    RelatedComponent,
    FooterComponent,
    CoverImageComponent,
    MarkdownPipe,
    ToDatePipe
  ],
  exports: [
    BreadcrumbsComponent,
    LatestComponent,
    RoutesGatewayComponent,
    ContentfulImageDirective,
    EmbeddedEntryComponent,
    VizabiEntryComponent,
    HtmlEntryComponent,
    EntriesViewComponent,
    VideoEntryComponent,
    TagsComponent,
    TagComponent,
    HeaderMenuComponent,
    FooterMenuComponent,
    ContributorsComponent,
    ProfileComponent,
    ShareFooterLineComponent,
    ShareComponent,
    RelatedComponent,
    FooterComponent,
    CoverImageComponent,
    MarkdownPipe,
    ToDatePipe
  ],
  providers: [
    BreadcrumbsService,
    RoutesManagerService,
    ContenfulContent,
    ContentfulService,
    CoverService,
    RoutesGatewayGuard,
    MenuService
  ]
})

export class Ng2ContentfulBlogModule {
}
