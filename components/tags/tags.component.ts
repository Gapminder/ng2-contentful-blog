import { Component, Input, OnInit, Inject } from '@angular/core';
import { ContentfulTagPage } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-tags',
  templateUrl: './tags.html',
  styleUrls: ['./tags.css']
})
export class TagsComponent implements OnInit {
  /* tslint:disable:no-unused-variable */
  @Input() private taggedContentType: string;
  /* tslint:enable:no-unused-variable */

  @Input() private tags: ContentfulTagPage[] = [];
  private constants: any;
  private visibleTags: ContentfulTagPage[] = [];

  public constructor(@Inject('Constants') constants: any) {
    this.constants = constants;
  }

  public ngOnInit(): any {
    this.visibleTags = _.filter(this.tags, (tag: ContentfulTagPage)=> {
      return !_.includes(this.constants.EXCLUDED_TAGS, tag.fields.slug);
    });
  }
}
