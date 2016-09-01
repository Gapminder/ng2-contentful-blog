import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ToDatePipe } from '../pipes/to-date.pipe';
import { ContentfulNodePage, ContentfulTagPage, ContentfulProfilePage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import * as _ from 'lodash';
import { appInjector } from '../contentful/app-injector.tool';
import { Observable } from 'rxjs';

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
  protected taggedContent: TaggedContent[];
  protected contentfulContentService: ContenfulContent;
  protected router: Router;
  protected routesManager: RoutesManagerService;
  protected breadcrumbsService: BreadcrumbsService;
  protected activatedRoute: ActivatedRoute;
  private contentfulTypeIds: any;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.contentfulTypeIds = contentfulTypeIds;
    // FIXME: Using appInjector because of some kind of cyclic dependency in which RoutesManagerService is involved
    this.routesManager = appInjector().get(RoutesManagerService);
    this.breadcrumbsService = breadcrumbsService;
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.tag = (param as TagRouteParams).tag;

      this.contentfulContentService.getTagsBySlug(this.tag)
        .map((contentTags: ContentfulTagPage[]) => _.first(contentTags))
        .zip(this.router.routerState.queryParams)
        .subscribe((contentTagWithTaggedContentType: any[]) => {
          const contentTag: ContentfulTagPage = _.first(contentTagWithTaggedContentType);
          const taggedContentType: string = _.get(_.last(contentTagWithTaggedContentType), 'contentType') as string;

          this.breadcrumbsService.breadcrumbs$.next({url: this.tag, name: contentTag.fields.title, show: false});

          if (!contentTag) {
            return this.router.navigate(['/']);
          }

          this.retrieveTaggedContentByType(taggedContentType, contentTag.sys.id)
            .subscribe((taggedContent: TaggedContent[]) => {
              this.taggedContent = taggedContent;
            });
        });
    });
  }

  private retrieveTaggedContentByType(taggedContentType: string, tagSysId: string): Observable<TaggedContent[]> {
    if (this.contentfulTypeIds.PROFILE_TYPE_ID === taggedContentType) {
      return this.retrieveTaggedProfiles(tagSysId);
    }
    return this.retrieveTaggedArticles(tagSysId);
  }

  private retrieveTaggedArticles(tagSysId: string): Observable<TaggedContent[]> {
    return this.contentfulContentService.getArticlesByTag(tagSysId)
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

  private retrieveTaggedProfiles(tagSysId: string): Observable<TaggedContent[]> {
    return this.contentfulContentService.getProfilesByTag(tagSysId)
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
