import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { transformResponse } from './response.tools';
import { ContentfulService, ContentfulRequest, SearchItem } from 'ng2-contentful';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import {
  ContentfulNodePagesResponse,
  ContentfulNodePage,
  ContentfulTagPage,
  ContentfulProfilePage,
  ContentfulContributionPage, ContentfulImage, ContentfulFooterHeader
} from './aliases.structures';

/**
 * ContentfulContent works as a replacement for the original ng2-contentful library.
 * It adds next abstraction layer for contenful requests,
 * and any type of custom request and request transformation used in gapminder-org
 * should be implemented here.
 *
 * !! Still in developing !!
 */

@Injectable()
export class ContenfulContent {
  private contentfulService: ContentfulService;
  private contentfulTypeIds: any;

  public constructor(contentfulService: ContentfulService,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.contentfulService = contentfulService;
    this.contentfulTypeIds = contentfulTypeIds;
  }

  /**
   *
   *  @param slug - slug of the current about content
   */
  public getAboutPage(slug: string): Observable<{submenuItems: any[], content: ContentfulNodePage}> {
    return this.getRawNodePageBySlug(slug)
      .map((response: ContentfulNodePagesResponse) => {
        return {
          submenuItems: this.getSubmenuItemsFromResponse(response),
          content: transformResponse<ContentfulNodePage>(response)[0]
        };
      });
  }

  public getOverviewPages(): Observable<ContentfulNodePage[]> {
    return this.getRawNodePagesByParams({
      param: 'fields.showInMainPageSlider',
      value: '1'
    })
      .include(2)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getLatestArticlesByTag(tagSysId: string, limit: number): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'fields.tags.sys.id',
        value: tagSysId
      })
      .include(3)
      .limit(limit)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getNodePagesByType(type: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(
        this.contentfulTypeIds.NODE_PAGE_TYPE_ID,
        {param: 'fields.type', value: type}
      )
      .commit()
      .map((response: Response) => response.json().items);
  }

  /**
   *
   * @param slug
   * @returns {any}
   */
  public getNodePage(slug: string): Observable<ContentfulNodePage[]> {
    return this.getRawNodePageBySlug(slug)
      .map((response: ContentfulNodePagesResponse) => transformResponse<ContentfulNodePage>(response));
    // .map(response => _.get(response, '[0].fields', null));
  }

  /**
   *
   * @param tagId
   * @param slug
   * @returns {ContentfulNodePage}
   */
  public getArticleByTagAndSlug(tagId: string, slug: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'fields.tags.sys.id',
        value: tagId
      })
      .getEntryBySlug(
        this.contentfulTypeIds.NODE_PAGE_TYPE_ID,
        slug
      )
      .include(1)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getTagsBySlug(slug: string): Observable<ContentfulTagPage[]> {
    return this.contentfulService
      .create()
      .getEntryBySlug(
        this.contentfulTypeIds.TAG_TYPE_ID,
        slug
      )
      .include(2)
      .commit()
      .map((response: Response) => response.json())
      .map((response: any) => transformResponse<ContentfulTagPage>(response));
  }

  public getImagesByTitle(title: string): Observable<ContentfulImage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.IMAGE_TYPE_ID, {
        param: 'fields.title',
        value: title
      })
      .include(1)
      .commit()
      .map((response: Response) =>response.json())
      .map((response: any) => transformResponse<ContentfulImage>(response));
  }

  public getProfilesByUsername(username: string): Observable<ContentfulProfilePage[]> {
    return this.getProfileByUsername(username)
      .map((response: any) => transformResponse<ContentfulProfilePage>(response));
  }

  public getProfilesByArticleIdAndProjectTag(id: string, projectTag: string): Observable<ContentfulProfilePage[]> {
    return this.getContributionsByArticle(id)
      .map((contributions: ContentfulContributionPage[]) => _.map(contributions, 'sys.id'))
      .mergeMap((contributionSysIds: string[]) => this.getProfilesByContributions(contributionSysIds))
      .mergeMap((profiles: ContentfulProfilePage[]) => Observable.from(profiles))
      .filter((profile: ContentfulProfilePage) => !!_.find(_.get(profile, 'fields.tags') as ContentfulTagPage[], (tag: ContentfulTagPage) => tag.fields.slug === projectTag))
      .toArray();
  }

  public getProfilesByTag(tagSysId: string): Observable<ContentfulProfilePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.PROFILE_TYPE_ID, {
        param: 'fields.tags.sys.id',
        value: tagSysId
      })
      .commit()
      .map((response: Response) => transformResponse<ContentfulProfilePage>(response.json()));
  }

  public getProfilesByTags(tagSysIds: string[]): Observable<ContentfulProfilePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.PROFILE_TYPE_ID, {
        param: 'fields.tags.sys.id[all]',
        value: _.join(tagSysIds)
      })
      .commit()
      .map((response: Response) => transformResponse<ContentfulProfilePage>(response.json()));
  }

  public getChildrenOfArticle(articleSysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'fields.parent.sys.id',
        value: articleSysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getChildrenOfArticleByTag(articleSysId: string, projectTag: string): Observable<ContentfulNodePage[]> {
    return this.getChildrenOfArticle(articleSysId)
      .mergeMap((children: ContentfulNodePage[]) => Observable.from(children))
      .filter((child: ContentfulNodePage) => !!_.find(_.get(child, 'fields.tags') as ContentfulTagPage[], (tag: ContentfulTagPage) => tag.fields.slug === projectTag))
      .toArray();
  }

  public getArticlesByTag(tagSysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'fields.tags.sys.id',
        value: tagSysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getArticlesByTags(tagSysIds: string[]): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'fields.tags.sys.id[all]',
        value: _.join(tagSysIds)
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getArticleBySysId(sysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.NODE_PAGE_TYPE_ID, {
        param: 'sys.id',
        value: sysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getContributionsByArticle(articleSysId: string): Observable<ContentfulContributionPage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.CONTRIBUTION_TYPE_ID, {
        param: 'fields.article.sys.id',
        value: articleSysId
      })
      .commit()
      .map((response: Response) => transformResponse<ContentfulContributionPage>(response.json(), 2));
  }

  public getProfilesByContributions(contributionSysIds: string[]): Observable<ContentfulProfilePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.PROFILE_TYPE_ID, {
        param: 'fields.contributions.sys.id[in]',
        value: _.join(contributionSysIds)
      })
      .include(1)
      .commit()
      .map((response: Response) => transformResponse<ContentfulProfilePage>(response.json(), 2));
  }

  public getMenuByTag(menuType: string, tagSysId: string): Observable<ContentfulFooterHeader[]> {
    return this.contentfulService
      .create()
      .searchEntries(menuType, {
        param: 'fields.tag.sys.id',
        value: tagSysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulFooterHeader>(response.json(), 3));
  }

  public getArticleParentSlug(id: string, onSlugFound: (path: string) => void): void {
    this.getArticleBySysId(id).subscribe(
      (res: any) => {
        const slug = res[0].fields.slug;
        if (!res[0].fields.parent) {
          return onSlugFound(slug);
        }
        let parentId = res[0].fields.parent.sys.id;
        this.getArticleParentSlug(parentId, (parentUrl: string) => {
          return onSlugFound(`${parentUrl}/${slug}`);
        });
      });
  }

  public getArticleWithFullUrlPopulated(articles: ContentfulNodePage[]): Observable<ContentfulNodePage[]> {
    if (!articles) {
      return Observable.empty() as Observable<ContentfulNodePage[]>;
    }

    return Observable
      .from(articles)
      .filter((article: ContentfulNodePage) => !!article)
      .mergeMap((article: ContentfulNodePage) => {
        const onFound: OnArticleWithFullUrlFound = this.getArticleWithFullUrl.bind(this);
        return Observable.bindCallback(onFound)(article);
      })
      .do((articleWithFullUrl: ArticleWithFullUrl) => {
        articleWithFullUrl.article.fields.url = articleWithFullUrl.url;
      })
      .map((articleWithFullUrl: ArticleWithFullUrl) => articleWithFullUrl.article)
      .toArray();
  }

  private getArticleWithFullUrl(article: ContentfulNodePage, onSlugFound: (articleWithFullUrl: ArticleWithFullUrl) => void): void {
    if (!article.fields.parent) {
      return onSlugFound({article, url: article.fields.slug});
    }

    this.getArticleBySysId(article.fields.parent.sys.id).subscribe((res: any[]) => {
      const parentArticle: ContentfulNodePage = _.first(res) as ContentfulNodePage;
      if (!parentArticle) {
        return onSlugFound({article, url: article.fields.slug});
      }

      this.getArticleWithFullUrl(parentArticle, (articleWithFullUrl: ArticleWithFullUrl) => {
        return onSlugFound({article, url: `${articleWithFullUrl.url}/${article.fields.slug}`});
      });
    });
  }

  private getRawNodePageBySlug(slug: string): Observable<ContentfulNodePagesResponse> {
    return this.contentfulService
      .create()
      .getEntryBySlug(
        this.contentfulTypeIds.NODE_PAGE_TYPE_ID,
        slug
      )
      .include(2)
      .commit()
      .map((response: Response) => response.json());
  }

  private getProfileByUsername(userName: string): Observable<ContentfulProfilePage> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulTypeIds.PROFILE_TYPE_ID, {
        param: 'fields.userName',
        value: userName
      })
      .include(2)
      .commit()
      .map((response: Response) => response.json());
  }

  /**
   *
   * @param searchItems
   * @returns {ContentfulRequest}
   */
  private getRawNodePagesByParams(...searchItems: SearchItem[]): ContentfulRequest {
    return this.contentfulService
      .create()
      .searchEntries(
        this.contentfulTypeIds.NODE_PAGE_TYPE_ID, ...searchItems);
  }

  private getSubmenuItemsFromResponse(response: ContentfulNodePagesResponse): any[] {
    let includes: any = {};
    let submenuItems: any = [];
    for (let entry of response.includes.Entry) {
      includes[entry.sys.id] = entry.fields;
    }
    // about subsection menu
    let item: any = response.items[0];
    includes[item.sys.id] = item.fields;
    let subsectionSysId = item.fields.subsections.sys.id;
    // collect subsections
    for (let subsection of includes[subsectionSysId].nodes) {
      submenuItems.push(
        includes[subsection.sys.id]
      );
    }
    return submenuItems;
  }
}

export interface ArticleWithFullUrl {
  url: string;
  article: ContentfulNodePage;
}

type OnArticleWithFullUrlFound = (article: ContentfulNodePage, done: (articleWithFullUrl: ArticleWithFullUrl) => void) => void;
