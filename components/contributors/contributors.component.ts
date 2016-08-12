import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { AsyncPipe } from '@angular/common';
import { ContentfulProfilePage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-contributors',
  template: require('./contributors.html') as string,
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./contributors.css') as string],
  pipes: [AsyncPipe]
})

export class ContributorsComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private profiles: ContentfulProfilePage[];
  /* tslint:enable:no-unused-variable */

}
