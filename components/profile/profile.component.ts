import {Component, Input, Inject} from '@angular/core';
import {RouterLink, OnActivate, ComponentInstruction, Router} from '@angular/router-deprecated';
import {Angulartics2On} from 'angulartics2/index';
import {BreadcrumbsService} from '../breadcrumbs/breadcrumbs.service';
import {ToDatePipe} from '../pipes/to-date.pipe';
import {ContentfulProfilePage} from '../contentfulService/aliases.structures';
import {ContenfulContent} from '../contentfulService/contentful-content.service';
import * as _ from 'lodash';

@Component({
  template: require('./profile.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./profile.css') as string],
  pipes: [ToDatePipe]
})
export class ProfileComponent implements OnActivate {
  @Input()
  private username: string;
  private profiles: ContentfulProfilePage[];
  private contentfulContentService: ContenfulContent;
  private router: Router;
  private breadcrumbsService: BreadcrumbsService;

  public constructor(@Inject(Router) router: Router,
                     @Inject(ContenfulContent) contentfulContentService: ContenfulContent,
                     @Inject(BreadcrumbsService) breadcrumbsService: BreadcrumbsService) {
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.breadcrumbsService = breadcrumbsService;
  }

  public routerOnActivate(next: ComponentInstruction): void {
    this.username = (next.params as ProfileRouteParams).userName;
    this.contentfulContentService
      .getProfilesByUsername(this.username).subscribe((profiles: ContentfulProfilePage[]) => {
      this.breadcrumbsService.breadcrumbs$.next({url: next.urlPath, name: profiles[0].fields.userName});
      if (_.isEmpty(profiles)) {
        this.router.navigate(['Root']);
      } else {
        this.profiles = profiles;
      }
    });
  }
}

export interface ProfileRouteParams {
  userName?: string;
}
