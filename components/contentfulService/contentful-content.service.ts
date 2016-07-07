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
  ContentfulTagPage
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
  private contentfulConstantId: any;

  public constructor(@Inject(ContentfulService) contentfulService: ContentfulService,
                     @Inject('ContentfulConstantId') contentfulConstantId: any) {
    this.contentfulService = contentfulService;
    this.contentfulConstantId = contentfulConstantId;
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

  public getLatestPosts(limit: number): Observable<ContentfulNodePage[]> {
    return this.getLatestItems(
      this.getRawNodePagesByParams({
        param: 'fields.type',
        value: 'blogpost'
      }), limit
    )
      .map((response: ContentfulNodePagesResponse) => response.items);
  }

  public getOverviewPages(): Observable<ContentfulNodePage[]> {
    return this.getRawNodePagesByParams({
      param: 'fields.showInMainPageSlider',
      value: '1'
    })
      .commit()
      .map((response: Response) => response.json().items);
  }

  public getLatestVideo(limit: number): Observable<ContentfulNodePage[]> {
    return this.getLatestItems(
      this.getRawNodePagesByParams({
        param: 'fields.type',
        value: 'video'
      }), limit
    )
      .map((response: ContentfulNodePagesResponse) => response.items);
  }

  public getNodePagesByType(type: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(
        this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID,
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

  public getTagPage(slug: string): Observable<ContentfulTagPage[]> {
    return this.getTagPageSlug(slug)
    // TODO: fix any
      .map((response: any) => transformResponse<ContentfulTagPage>(response));
  }

  public getChildrenOf(sysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID, {
        param: 'fields.parent.sys.id',
        value: sysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getTag(sysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID, {
        param: 'fields.tags.sys.id',
        value: sysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
  }

  public getParentOf(sysId: string): Observable<ContentfulNodePage[]> {
    return this.contentfulService
      .create()
      .searchEntries(this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID, {
        param: 'sys.id',
        value: sysId
      })
      .include(3)
      .commit()
      .map((response: Response) => transformResponse<ContentfulNodePage>(response.json(), 2));
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
        this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID,
        slug
      )
      .include(2)
      .commit()
      .map((response: Response) => response.json());
  }

  private getTagPageSlug(slug: string): Observable<ContentfulTagPage> {
    return this.contentfulService
      .create()
      .getEntryBySlug(
        this.contentfulConstantId.CONTENTFUL_TAG_TYPE_ID,
        slug
      )
      .include(2)
      .commit()
      .map((response: Response) => response.json());
  }

  private getLatestItems(request: ContentfulRequest, limit: number, order: string = '-sys.createdAt', include: number = 0): Observable<ContentfulNodePagesResponse> {
    return request
      .limit(limit)
      .order(order)
      .include(include)
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
        this.contentfulConstantId.CONTENTFUL_NODE_PAGE_TYPE_ID, ...searchItems);
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
