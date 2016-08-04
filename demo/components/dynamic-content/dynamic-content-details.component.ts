import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlPathWithParams, ROUTER_DIRECTIVES } from '@angular/router';
import { ToDatePipe } from '../../../components/pipes/to-date.pipe';
import { NodePageContent } from '../../../components/contentful/content-type.structures';
import { ContentfulNodePage } from '../../../components/contentful/aliases.structures';
import { ContenfulContent } from '../../../components/contentful/contentful-content.service';
import { BreadcrumbsService } from '../../../components/breadcrumbs/breadcrumbs.service';
import { EntriesViewComponent } from '../../../components/entries-view/entries-view.component';
import { TagsComponent } from '../../../components/tags/list-tags.component';
import { Angulartics2On } from 'angulartics2';
import { ContributorsComponent } from '../../../components/contributors/contributors.component';
import { RoutesManagerService } from '../../../components/routes-gateway/routes-manager.service';
import { ShareFooterLineComponent } from '../../../components/share-btn/share-line-footer.component';

@Component({
  selector: 'gm-dynamic-page',
  template: require('./dynamic-content-details.component.html') as string,
  directives: [EntriesViewComponent, ROUTER_DIRECTIVES, ShareFooterLineComponent, TagsComponent, ContributorsComponent, Angulartics2On],
  styles: [require('./dynamic-content-details.component.styl') as string],
  pipes: [ToDatePipe]
})
export class DynamicContentDetailsComponent implements OnInit {
  private content: NodePageContent;
  private childrenList: ContentfulNodePage[];
  private urlPath: string;
  private contentSlug: string;
  private articleSysId: string;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;
  private breadcrumbsService: BreadcrumbsService;
  /* tslint:disable:no-unused-variable */
  private logoId: string = '2zHwKKRhnqe4GiOs6842QM';
  /* tslint:enable:no-unused-variable */

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService) {
    this.router = router;
    this.contentfulContentService = contentfulContentService;
    this.breadcrumbsService = breadcrumbsService;
    this.routesManager = routesManager;
    this.activatedRoute = activatedRoute;
  }

  public ngOnInit(): void {
    this.activatedRoute.url
      .subscribe((urls: UrlPathWithParams[]) => {
        const url: string = urls.map((value: UrlPathWithParams) => value.path).join('/');
        this.urlPath = url;
        this.contentSlug = url.split('/').pop();
        this.contentfulContentService.getNodePage(this.contentSlug)
          .subscribe((content: ContentfulNodePage[]) => {
            if (!content) {
              this.router.navigate(['/']);
            }
            this.articleSysId = content[0].sys.id;
            this.content = content[0].fields;
            this.breadcrumbsService.breadcrumbs$.next({url: url, name: this.content.title});
            this.contentfulContentService.getChildrenOfArticle(content[0].sys.id)
              .subscribe((children: ContentfulNodePage[]) => {
                this.childrenList = children;
                for (let item of children) {
                  if (item.fields) {
                    this.routesManager.addRoute({
                      path: `${this.urlPath}/${item.fields.slug}`,
                      data: {name: item.fields.title}
                    });
                  }
                }
              });
          });
      });
  }
}

