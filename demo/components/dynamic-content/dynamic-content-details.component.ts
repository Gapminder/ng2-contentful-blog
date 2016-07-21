import {Component, Inject} from '@angular/core';
import {OnActivate, ComponentInstruction, Router, RouterLink, CanReuse} from '@angular/router-deprecated';
import {ToDatePipe} from '../../../components/pipes/to-date.pipe';
import {NodePageContent} from '../../../components/contentfulService/content-type.structures';
import {ContentfulNodePage} from '../../../components/contentfulService/aliases.structures';
import {ContenfulContent} from '../../../components/contentfulService/contentful-content.service';
import {BreadcrumbsService} from '../../../components/breadcrumbs/breadcrumbs.service';
import {RoutesGatewayService} from '../../../components/routesGateway/routes-gateway.service';
import {EntriesViewComponent} from '../../../components/entries-view/entries-view.component';
import {TagsComponent} from '../../../components/tags/list-tags.component';
import {Angulartics2On} from 'angulartics2/index';
import {ContributorsComponent} from '../../../components/contributors/contributors.component';
// import {LineSocialComponent} from '../line-social/line-social.component';

@Component({
  selector: 'gm-dynamic-page',
  template: require('./dynamic-content-details.component.html') as string,
  directives: [EntriesViewComponent, RouterLink, TagsComponent, ContributorsComponent, Angulartics2On],
  styles: [require('./dynamic-content-details.component.styl') as string],
  pipes: [ToDatePipe]
})
export class DynamicContentDetailsComponent implements OnActivate, CanReuse {
  private content: NodePageContent;
  private childrenList: ContentfulNodePage[];
  private urlPath: string;
  private contentSlug: string;
  private articleSysId: string;
  private router: Router;
  private contentfulContentService: ContenfulContent;
  private routesGatewayService: RoutesGatewayService;
  private breadcrumbsService: BreadcrumbsService;

  public constructor(@Inject(Router) router: Router,
                     @Inject(RoutesGatewayService) routesGatewayService: RoutesGatewayService,
                     @Inject(ContenfulContent) contentfulContentService: ContenfulContent,
                     @Inject(BreadcrumbsService) breadcrumbsService: BreadcrumbsService) {
    this.router = router;
    this.contentfulContentService = contentfulContentService;
    this.breadcrumbsService = breadcrumbsService;
    this.routesGatewayService = routesGatewayService;
  }

  public routerOnActivate(next: ComponentInstruction): any {
    this.urlPath = next.urlPath;
    this.contentSlug = next.urlPath.split('/').pop();
    this.contentfulContentService
      .getNodePage(this.contentSlug)
      .subscribe(
        (content: ContentfulNodePage[]) => {
          if (!content) {
            this.router.navigate(['Root']);
          }
          this.articleSysId = content[0].sys.id;
          this.content = content[0].fields;
          this.breadcrumbsService.breadcrumbs$.next({url: next.urlPath, name: this.content.title});
          this.contentfulContentService
            .getChildrenOfArticle(content[0].sys.id)
            .subscribe(
              (children: ContentfulNodePage[]) => {
                this.childrenList = children;
                for (let item of children) {
                  if (item.fields) {
                    this.routesGatewayService.addRoute(`${this.urlPath}/${item.fields.slug}`, {name: item.fields.title});
                  }
                }
              });
        });
  }

  // noinspection TsLint
  public routerCanReuse(): boolean {
    return false;
  }
}

