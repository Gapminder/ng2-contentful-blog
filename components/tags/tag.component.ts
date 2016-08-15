import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ToDatePipe } from '../pipes/to-date.pipe';
import { ContentfulNodePage, ContentfulTagPage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import * as _ from 'lodash';
import { appInjector } from '../contentful/app-injector.tool';

@Component({
  selector: 'gm-tagged-articles',
  template: require('./tag.html') as string,
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./tags.css') as string],
  pipes: [ToDatePipe]
})
export class TagComponent implements OnInit {
  @Input()
  protected tag: string;
  protected listNodePage: ContentfulNodePage[];
  protected contentfulContentService: ContenfulContent;
  protected tagId: string;
  protected router: Router;
  protected routesManager: RoutesManagerService;
  protected breadcrumbsService: BreadcrumbsService;
  protected activatedRoute: ActivatedRoute;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService) {
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    // FIXME: Using appInjector because of some kind of cyclic dependency in which RoutesManagerService is involved
    this.routesManager = appInjector().get(RoutesManagerService);
    this.breadcrumbsService = breadcrumbsService;
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.tag = (param as TagRouteParams).tag;

      this.contentfulContentService.getTagsBySlug(this.tag)
        .subscribe((contentTag: ContentfulTagPage[]) => {
          this.breadcrumbsService.breadcrumbs$.next({url: this.tag, name: contentTag[0].fields.title, show: false});
          if (_.isEmpty(contentTag)) {
            this.router.navigate(['/']);
          } else {
            this.tagId = contentTag[0].sys.id;
            this.contentfulContentService.getArticlesByTag(this.tagId)
              .subscribe((res: ContentfulNodePage[]) => {
                this.listNodePage = res;
                for (let item of this.listNodePage) {
                  this.contentfulContentService.getArticleParentSlug(item.sys.id, (url: string) => {
                    item.fields.url = this.routesManager.addRoute({path: url, data: {name: item.fields.title}});
                  });
                }
              });
          }
        });
    });
  }
}

export interface TagRouteParams {
  tag?: string;
  name?: string;
}
