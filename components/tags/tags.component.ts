import { Component, Input, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { ContentfulTagPage } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-tags',
  template: require('./tags.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./tags.css') as string]
})
export class TagsComponent implements OnInit {
  /* tslint:disable:no-unused-variable */
  @Input() private tags: ContentfulTagPage[] = [];
  /* tslint:enable:no-unused-variable */
  private constants: any;

  public constructor(@Inject('Constants') constants: any) {
    this.constants = constants;
  }

  public ngOnInit(): any {

    this.tags = _.filter(this.tags, (tag: ContentfulTagPage)=> {
      return tag.fields.slug !== this.constants.PROJECT_TAG;
    });

  }
}

