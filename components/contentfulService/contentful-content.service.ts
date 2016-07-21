import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {transformResponse} from './response.tools';
import {ContentfulService, ContentfulRequest, SearchItem} from 'ng2-contentful';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {
  ContentfulNodePagesResponse,
  ContentfulNodePage,
  ContentfulMenu,
  ContentfulTagPage, ContentfulProfilePage, ContentfulContributionPage
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

  public constructor(@Inject(ContentfulService) contentfulService: ContentfulService,
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
      .commit()
      .map((response: Response) => response.json().items);
  }

  public getLatestArticlesByTag(tagSysId: string, limit:number): Observable<ContentfulNodePage[]> {
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

  public getTagsBySlug(slug: string): Observable<ContentfulTagPage[]> {
    return this.getTagBySlug(slug)
    // TODO: fix any
      .map((response: any) => transformResponse<ContentfulTagPage>(response));
  }

  public getProfilesByUsername(username: string): Observable<ContentfulProfilePage[]> {
    return this.getProfileByUsername(username)
      .map((response: any) => transformResponse<ContentfulProfilePage>(response));
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

  public getParentOf(sysId: string): Observable<ContentfulNodePage[]> {
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
        value: contributionSysIds.join()
      })
      .include(1)
      .commit()
      .map((response: Response) => transformResponse<ContentfulProfilePage>(response.json(), 2));
  }

  public getMenu(typeMenu: string): Observable<ContentfulMenu[]> {
    return this.contentfulService
      .create()
      .searchEntries(typeMenu)
      .include(4)
      .commit()
      .map((response: Response) => transformResponse<ContentfulMenu>(response.json(), 3));
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

  private getTagBySlug(slug: string): Observable<ContentfulTagPage> {
    return this.contentfulService
      .create()
      .getEntryBySlug(
        this.contentfulTypeIds.TAG_TYPE_ID,
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

  /*private getLatestItems(request: ContentfulRequest, limit: number, order: string = '-sys.createdAt', include: number = 0): Observable<ContentfulNodePagesResponse> {
    return request
      .limit(limit)
      .order(order)
      .include(include)
      .commit()
      .map((response: Response) => response.json());
  }*/

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
