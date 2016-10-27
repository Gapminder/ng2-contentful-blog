import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { NodePageContent } from '../../../components/contentful/content-type.structures';
import {
  ContentfulNodePage,
  ContentfulTagPage,
  ContentfulProfilePage,
  ContentfulCover
} from '../../../components/contentful/aliases.structures';
import { ContenfulContent } from '../../../components/contentful/contentful-content.service';
import { BreadcrumbsService } from '../../../components/breadcrumbs/breadcrumbs.service';
import { RoutesManagerService } from '../../../components/routes-gateway/routes-manager.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import { CoverService } from '../../../components/cover-image/cover.service';

@Component({
  selector: 'gm-dynamic-page',
  templateUrl: './dynamic-content-details.component.html',
  styleUrls: ['./dynamic-content-details.component.styl']
})

export class DynamicContentDetailsComponent implements OnInit {
  private content: NodePageContent;
  private children: ContentfulNodePage[];
  private urlPath: string;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;
  private breadcrumbsService: BreadcrumbsService;
  private constants: any;
  private profiles: ContentfulProfilePage[];
  private cssClassSmallColumn: boolean = false;
  private projectTagId: string;
  private relatedArticles: ContentfulNodePage[];
  private isHomePage: boolean;
  private coverService: CoverService;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     routesManager: RoutesManagerService,
                     coverService: CoverService,
                     @Inject('Constants') constants: any,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService) {
    this.router = router;
    this.coverService = coverService;
    this.contentfulContentService = contentfulContentService;
    this.breadcrumbsService = breadcrumbsService;
    this.routesManager = routesManager;
    this.activatedRoute = activatedRoute;
    this.constants = constants;
  }

  public ngOnInit(): void {
    this.isHomePage = false;
    this.getProjectTagId().subscribe((projectTagId: ContentfulTagPage) => this.projectTagId = projectTagId.sys.id);

    this.activatedRoute.url
      .subscribe((urls: UrlSegment[]) => {
        this.urlPath = urls.map((value: UrlSegment) => value.path).join('/');
        const currentArticleSlug = this.urlPath.split('/').pop();

        if (!_.isEmpty(currentArticleSlug)) {
          this.getProjectTagId()
            .map((tag: ContentfulTagPage) => tag.sys.id)
            .mergeMap((tagSysId: string) => this.contentfulContentService.getArticleByTagAndSlug(tagSysId, currentArticleSlug))
            .mergeMap((articles: ContentfulNodePage[]) => Observable.from(articles))
            .subscribe((article: ContentfulNodePage) => this.onArticleReceived(article));
        }
        if (_.isEmpty(currentArticleSlug)) {
          this.isHomePage = true;
          this.contentfulContentService
            .getTagsBySlug(this.constants.HOME_TAG).subscribe((tags: ContentfulTagPage[]) => {
            const homeTagSysId = _.get(_.first(tags), 'sys.id') as string;
            this.contentfulContentService.getArticlesByTag(homeTagSysId)
              .subscribe((articles: ContentfulNodePage[])=> {
                const homePage = _.first(_.sortBy(articles, 'sys.createdAt'));
                this.onArticleReceived(homePage);
              });
          });
        }
      });
  }

  private getProjectTagId(): Observable<ContentfulTagPage> {
    return this.contentfulContentService
      .getTagsBySlug(this.constants.PROJECT_TAG)
      .mergeMap((tags: ContentfulTagPage[]) => Observable.from(tags));
  }

  private related(related: ContentfulNodePage[]): Observable<ContentfulNodePage[]> {
    return Observable
      .from(related)
      .filter((article: ContentfulNodePage) => !!_.find(article.fields.tags, (tag: ContentfulTagPage) => tag.sys.id === this.projectTagId))
      .toArray();
  }

  private onArticleReceived(article: ContentfulNodePage): void {
    if (!article) {
      this.router.navigate(['/']);
    }
    this.content = article.fields;
    if (this.isHomePage) {
      const contentAtTheBottom = true;
      this.content.relatedLocation = contentAtTheBottom;
    }
    if (this.content.related) {

      this.related(this.content.related).subscribe((related: ContentfulNodePage[]) => {
        if (!_.isEmpty(related)) {
          this.relatedArticles = related;
        }
      });
    }

    const cover = _.get(this.content, 'coverBlock') as ContentfulCover;
    this.coverService.cover$.next({cover, show: !_.isEmpty(cover)});

    this.breadcrumbsService.breadcrumbs$.next({
      url: this.urlPath,
      name: this.content.title,
      show: !_.isEmpty(this.urlPath)
    });
    this.contentfulContentService.getProfilesByArticleIdAndProjectTag(article.sys.id, this.constants.PROJECT_TAG)
      .subscribe((profiles: ContentfulProfilePage[]) => {
        this.profiles = profiles;
        this.cssClassSmallColumn = this.relatedSectionIsAtRight() || !_.isEmpty(profiles);
      });

    this.contentfulContentService.getChildrenOfArticleByTag(article.sys.id, this.constants.PROJECT_TAG)
      .subscribe((children: ContentfulNodePage[]) => {
        _.forEach(children, (child: ContentfulNodePage) => {
          const currentPagePath: string = _.map(this.activatedRoute.snapshot.url, 'path').join('/');
          child.fields.url = `${currentPagePath}/${child.fields.slug}`;
        });
        this.routesManager.addRoutesFromArticles(... children);
        this.children = children;
      });
  }

  private relatedSectionIsAtRight(): boolean {
    return Boolean(this.rightRelatedLocation() && this.content.related);
  }

  private rightRelatedLocation(): boolean {
    return !Boolean(this.content.relatedLocation);
  }
}
