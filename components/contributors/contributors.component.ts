import { Component, Input } from '@angular/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { ContentfulProfilePage } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-contributors',
  template: require('./contributors.html') as string,
  styles: [require('./contributors.css') as string]
})

export class ContributorsComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private profiles: ContentfulProfilePage[];
  /* tslint:enable:no-unused-variable */

}
