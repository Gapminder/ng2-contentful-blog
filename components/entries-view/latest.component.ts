import { Component, OnInit, Input, Inject } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { ContentfulNodePage, ContentfulTagPage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-latest',
  template: require('./latest.html') as string,
  styles: [require('./latest.styl') as string]
})
export class LatestComponent implements OnInit {
  @Input()
  private limit: number = 3;

  @Input()
  private tag: string = '';

  /* tslint:disable */
  @Input()
  private title: string = '';
  /* tslint:enable */
  private constants: any;
  private articles: ContentfulNodePage[];
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('Constants') constants: any,
                     routesManager: RoutesManagerService) {
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
    this.constants = constants;

  }

  public ngOnInit(): void {
    this.contentfulContentService
      .getTagsBySlug(this.tag).subscribe((tags: any[]) => {
      if (!_.isEmpty(tags)) {
        const tagId = _.get(_.first(tags), 'sys.id') as string;
        this.getProjectTagId().subscribe((projectTagId: string) => {
          this.contentfulContentService.getArticlesByTags([tagId, projectTagId], this.limit)
            .mergeMap((articles: ContentfulNodePage[]) => this.contentfulContentService.getArticleWithFullUrlPopulated(articles))
            .subscribe((articles: ContentfulNodePage[]) => {
              this.routesManager.addRoutesFromArticles(... articles);
              this.articles = articles;
            });
        });
      }
    });
  }

  private getProjectTagId(): Observable<string> {
    return this.contentfulContentService
      .getTagsBySlug(this.constants.PROJECT_TAG)
      .mergeMap((tags: ContentfulTagPage[]) => Observable.from(tags))
      .map((tag: ContentfulTagPage) => tag.sys.id);
  }
}
