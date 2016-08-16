import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ToDatePipe } from '../pipes/to-date.pipe';
import * as _ from 'lodash';
import { ContentfulNodePage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-related',
  template: require('./related.html') as string,
  styles: [require('./related.css') as string],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ToDatePipe]
})
export class RelatedComponent implements OnInit {
  @Input()
  private relatedItems: ContentfulNodePage[] = [];
  /* tslint:disable:no-unused-variable */
  @Input() private relatedLocation: boolean = false;
  @Input() private contentSlug: string;
  /* tslint:enable:no-unused-variable */

  private routesManager: RoutesManagerService;
  private contentfulContentService: ContenfulContent;
  private related: ContentfulNodePage[];

  public constructor(routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent) {
    this.routesManager = routesManager;
    this.contentfulContentService = contentfulContentService;
  }

  public ngOnInit(): void {
    this.related = _.filter(this.relatedItems, (article: ContentfulNodePage)=> {
      return article.fields;
    });
    _.forEach(this.related, (article: ContentfulNodePage) => {
      this.contentfulContentService.getArticleParentSlug(article.sys.id, (url: string) => {
        const cover = article.fields.cover ? article.fields.cover.sys.id : undefined;
        article.fields.url = this.routesManager.addRoute({path: url, data: {name: article.fields.title, cover}});
      });
    });
  }
}
