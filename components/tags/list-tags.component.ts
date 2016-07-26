import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { ContentfulTagPage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-tags',
  template: require('./list-tags.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./tags.css') as string]
})
export class TagsComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private tagList: ContentfulTagPage[] = [];
  /* tslint:enable:no-unused-variable */

}

