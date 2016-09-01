import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ToDatePipe } from '../pipes/to-date.pipe';
import { ContentfulProfilePage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import * as _ from 'lodash';
import { TagsComponent } from '../tags/tags.component';

@Component({
  template: require('./profile.html') as string,
  directives: [ROUTER_DIRECTIVES, TagsComponent],
  styles: [require('./profile.css') as string],
  pipes: [ToDatePipe]
})
export class ProfileComponent implements OnInit {
  @Input()
  private username: string;
  private profile: ContentfulProfilePage;
  private contentfulContentService: ContenfulContent;
  private router: Router;
  private breadcrumbsService: BreadcrumbsService;
  private activatedRoute: ActivatedRoute;
  private taggedContentType: string;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.breadcrumbsService = breadcrumbsService;
    this.taggedContentType = contentfulTypeIds.PROFILE_TYPE_ID;
  }

  public ngOnInit(): void {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.username = (params as ProfileRouteParams).userName;
        this.contentfulContentService
          .getProfilesByUsername(this.username).subscribe((profiles: ContentfulProfilePage[]) => {
          this.breadcrumbsService.breadcrumbs$.next({url: this.username, name: profiles[0].fields.userName, show: false});
          if (_.isEmpty(profiles)) {
            this.router.navigate(['Root']);
          } else {
            this.profile = _.first(profiles);
          }
        });
      });
  }
}

export interface ProfileRouteParams {
  userName?: string;
}
