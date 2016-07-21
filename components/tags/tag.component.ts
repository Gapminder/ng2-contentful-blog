import {Component, Input, Inject} from '@angular/core';
import {RouterLink, OnActivate, ComponentInstruction, Router} from '@angular/router-deprecated';
import {Angulartics2On} from 'angulartics2/index';
import {BreadcrumbsService} from '../breadcrumbs/breadcrumbs.service';
import {ToDatePipe} from '../pipes/to-date.pipe';
import {ContentfulNodePage, ContentfulTagPage} from '../contentfulService/aliases.structures';
import {ContenfulContent} from '../contentfulService/contentful-content.service';
import {RoutesGatewayService} from '../routesGateway/routes-gateway.service';

import * as _ from 'lodash';

@Component({
  template: require('./tag.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./tags.css') as string],
  pipes: [ToDatePipe]
})
export class TagComponent implements OnActivate {
  @Input()
  private tag: string;
  private listNodePage: ContentfulNodePage[];
  private contentfulContentService: ContenfulContent;
  private tagId: string;
  private router: Router;
  private routesGatewayService: RoutesGatewayService;
  private breadcrumbsService: BreadcrumbsService;

  public constructor(@Inject(Router) router: Router,
                     @Inject(ContenfulContent) contentfulContentService: ContenfulContent,
                     @Inject(RoutesGatewayService) routesGatewayService: RoutesGatewayService,
                     @Inject(BreadcrumbsService) breadcrumbsService: BreadcrumbsService) {
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.routesGatewayService = routesGatewayService;
    this.breadcrumbsService = breadcrumbsService;
  }

  public routerOnActivate(next: ComponentInstruction): void {
    this.tag = (next.params as TagRouteParams).tag;
    this.contentfulContentService
      .getTagsBySlug(this.tag).subscribe((contentTag: ContentfulTagPage[]) => {
      this.breadcrumbsService.breadcrumbs$.next({url: next.urlPath, name: contentTag[0].fields.title});
      if (_.isEmpty(contentTag)) {
        this.router.navigate(['Root']);
      } else {
        this.tagId = contentTag[0].sys.id;
        this.contentfulContentService
          .getArticlesByTag(this.tagId)
          .subscribe(
            (res: ContentfulNodePage[]) => {
              this.listNodePage = res;
              for (let item of this.listNodePage) {
                this.routesGatewayService.getArticleParentSlug(item.sys.id, (url: string) => {
                  item.fields.url = this.routesGatewayService.addRoute(url, {name: item.fields.title});
                });
              }
            });
      }
    });

  }
}

export interface TagRouteParams {
  tag?: string;
  name?: string;
}
