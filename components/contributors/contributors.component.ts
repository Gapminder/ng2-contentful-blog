import { Component, OnInit, Input, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { Angulartics2On } from 'angulartics2/index';
import * as _ from 'lodash';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { AsyncPipe } from '@angular/common';
import { ContenfulContent } from '../contentfulService/contentful-content.service';
import { ContentfulProfilePage, ContentfulContributionPage } from '../contentfulService/aliases.structures';

@Component({
  selector: 'gm-contributors',
  template: require('./contributors.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./contributors.css') as string],
  pipes: [AsyncPipe]
})

export class ContributorsComponent implements OnInit {
  @Input() private articleSysId: string;
  private profiles: ContentfulProfilePage[];
  private contentfulContentService: ContenfulContent;

  public constructor(@Inject(ContenfulContent) contentfulContentService: ContenfulContent) {
    this.contentfulContentService = contentfulContentService;
  }

  public ngOnInit(): any {
    this.contentfulContentService
      .getContributionsByArticle(this.articleSysId)
      .map((contributions: ContentfulContributionPage[]) => _.map(contributions, 'sys.id'))
      .mergeMap((contributionSysIds: string[]) => this.contentfulContentService.getProfilesByContributions(contributionSysIds))
      .subscribe((profiles: ContentfulProfilePage[]) => this.profiles = profiles);
  }
}
