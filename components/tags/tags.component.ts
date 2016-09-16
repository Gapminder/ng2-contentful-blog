import { Component, Input, OnInit, Inject } from '@angular/core';
import { ContentfulTagPage } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-tags',
  template: require('./tags.html') as string,
  styles: [require('./tags.css') as string]
})
export class TagsComponent implements OnInit {
  /* tslint:disable:no-unused-variable */
  @Input() private taggedContentType: string;
  /* tslint:enable:no-unused-variable */

  @Input() private tags: ContentfulTagPage[] = [];
  private constants: any;

  public constructor(@Inject('Constants') constants: any) {
    this.constants = constants;
  }

  public ngOnInit(): any {
    this.tags = _.filter(this.tags, (tag: ContentfulTagPage)=> {
      return !_.includes(this.constants.EXCLUDED_TAGS, tag.fields.slug);
    });
  }
}
