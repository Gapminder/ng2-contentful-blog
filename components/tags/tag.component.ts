import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ContentfulNodePage, ContentfulTagPage, ContentfulProfilePage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'gm-tagged-articles',
  template: require('./tag.html') as string,
  styles: [require('./tags.css') as string]
})
export class TagComponent implements OnInit {
  @Input()
  protected tag: string;
  protected taggedContent: TaggedContent[];
  protected contentfulContentService: ContenfulContent;
  protected router: Router;
  protected routesManager: RoutesManagerService;
  protected breadcrumbsService: BreadcrumbsService;
  protected activatedRoute: ActivatedRoute;
  private contentfulTypeIds: any;
  private constants: any;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService,
                     @Inject('Constants') constants: any,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.contentfulTypeIds = contentfulTypeIds;
    this.routesManager = routesManager;
    this.breadcrumbsService = breadcrumbsService;
    this.constants = constants;
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.tag = (param as TagRouteParams).tag;

      this.contentfulContentService.getTagsBySlug(this.tag)
        .map((contentTags: ContentfulTagPage[]) => _.first(contentTags))
        .zip(this.router.routerState.root.queryParams)
        .subscribe((contentTagWithTaggedContentType: any[]) => {
          const contentTag: ContentfulTagPage = _.first(contentTagWithTaggedContentType);
          const taggedContentType: string = _.get(_.last(contentTagWithTaggedContentType), 'contentType') as string;

          this.breadcrumbsService.breadcrumbs$.next({url: this.tag, name: contentTag.fields.title, show: false});

          if (!contentTag) {
            return this.router.navigate(['/']);
          }
          this.getProjectTagId().subscribe((projectTagId: string) => {
            this.retrieveTaggedContentByType(taggedContentType, [contentTag.sys.id, projectTagId])
              .subscribe((taggedContent: TaggedContent[]) => this.taggedContent = taggedContent);
          });
        });
    });
  }

  private retrieveTaggedContentByType(taggedContentType: string, tagSysIds: string[]): Observable<TaggedContent[]> {
    if (this.contentfulTypeIds.PROFILE_TYPE_ID === taggedContentType) {
      return this.retrieveTaggedProfiles(tagSysIds);
    }
    return this.retrieveTaggedArticles(tagSysIds);
  }

  private retrieveTaggedArticles(tagSysIds: string[]): Observable<TaggedContent[]> {
    return this.contentfulContentService.getArticlesByTags(tagSysIds)
      .mergeMap((articlesWithFullUrl: ContentfulNodePage[]) => this.contentfulContentService.getArticleWithFullUrlPopulated(articlesWithFullUrl))
      .do((articlesWithFullUrl: ContentfulNodePage[]) => {
        this.routesManager.addRoutesFromArticles(... articlesWithFullUrl);
      })
      .map((articlesWithFullUrl: ContentfulNodePage[]) => {
        return _.map(articlesWithFullUrl, (article: ContentfulNodePage) => {
          return {
            thumbnail: article.fields.thumbnail && article.fields.thumbnail.sys.id,
            url: this.routesManager.getRouteName(article.fields.url),
            title: article.fields.title,
            description: article.fields.description,
            createdAt: article.fields.createdAt
          } as TaggedContent;
        });
      });
  }

  private retrieveTaggedProfiles(tagSysIds: string[]): Observable<TaggedContent[]> {
    return this.contentfulContentService.getProfilesByTags(tagSysIds)
      .map((contentfulProfiles: ContentfulProfilePage[]) => {
        return _.map(contentfulProfiles, (profile: ContentfulProfilePage) => {
          return {
            thumbnail: profile.fields.avatar && profile.fields.avatar.sys.id,
            url: `/profile/${profile.fields.userName}`,
            title: `${profile.fields.firstName} ${profile.fields.lastName}`,
            description: profile.fields.aboutMe
          } as TaggedContent;
        });
      });
  }

  private getProjectTagId(): Observable<string> {
    return this.contentfulContentService
      .getTagsBySlug(this.constants.PROJECT_TAG)
      .mergeMap((tags: ContentfulTagPage[]) => Observable.from(tags))
      .map((tag: ContentfulTagPage) => tag.sys.id);
  }

}

export interface TagRouteParams {
  tag?: string;
  name?: string;
}

export interface TaggedContent {
  thumbnail: string;
  url: string;
  title: string;
  description: string;
  createdAt?: string;
}
