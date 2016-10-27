import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ContentfulProfilePage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import * as _ from 'lodash';
import { CoverService } from '../cover-image/cover.service';

@Component({
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
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
  private coverService: CoverService;

  public constructor(router: Router,
                     coverService: CoverService,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.coverService = coverService;
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.breadcrumbsService = breadcrumbsService;
    this.taggedContentType = contentfulTypeIds.PROFILE_TYPE_ID;
  }

  public ngOnInit(): void {
    this.coverService.cover$.next({show: false});
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.username = (params as ProfileRouteParams).userName;
        this.contentfulContentService
          .getProfilesByUsername(this.username).subscribe((profiles: ContentfulProfilePage[]) => {
          this.breadcrumbsService.breadcrumbs$.next({url: this.username, name: profiles[0].fields.userName, show: false});
          if (_.isEmpty(profiles)) {
            this.router.navigate(['/']);
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
