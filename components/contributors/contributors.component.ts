import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import * as _ from 'lodash';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { AsyncPipe } from '@angular/common';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulProfilePage, ContentfulContributionPage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-contributors',
  template: require('./contributors.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./contributors.css') as string],
  pipes: [AsyncPipe]
})

export class ContributorsComponent implements OnInit {
  @Input() private articleSysId: string;
  private profiles: ContentfulProfilePage[];
  private contentfulContentService: ContenfulContent;

  public constructor(contentfulContentService: ContenfulContent) {
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
