import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { ToDatePipe } from '../pipes/to-date.pipe';
import { ContentfulProfilePage } from '../contentful/aliases.structures';
import { ContenfulContent } from '../contentful/contentful-content.service';
import * as _ from 'lodash';

@Component({
  template: require('./profile.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./profile.css') as string],
  pipes: [ToDatePipe]
})
export class ProfileComponent implements OnInit {
  @Input()
  private username: string;
  private profiles: ContentfulProfilePage[];
  private contentfulContentService: ContenfulContent;
  private router: Router;
  private breadcrumbsService: BreadcrumbsService;
  private activatedRoute: ActivatedRoute;

  public constructor(router: Router,
                     activatedRoute: ActivatedRoute,
                     contentfulContentService: ContenfulContent,
                     breadcrumbsService: BreadcrumbsService) {
    this.activatedRoute = activatedRoute;
    this.contentfulContentService = contentfulContentService;
    this.router = router;
    this.breadcrumbsService = breadcrumbsService;
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
            this.profiles = profiles;
          }
        });
      });
  }
}

export interface ProfileRouteParams {
  userName?: string;
}
