import { Component, Input, OnInit } from '@angular/core';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulNodePage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-related',
  template: require('./related.html') as string,
  styles: [require('./related.css') as string]
})
export class RelatedComponent implements OnInit {
  @Input()
  private relatedItems: ContentfulNodePage[] = [];
  /* tslint:disable:no-unused-variable */
  @Input() private relatedLocation: boolean = false;
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
    this.contentfulContentService.getArticleWithFullUrlPopulated(this.relatedItems)
      .subscribe((articlesWithFullUrl: ContentfulNodePage[]) => {
        this.routesManager.addRoutesFromArticles(... articlesWithFullUrl);
        this.related = articlesWithFullUrl;
      });
  }
}
