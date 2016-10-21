import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ContentfulCover } from '../contentful/aliases.structures';

@Injectable()
export class CoverService {
  public cover$: Subject<CoverEvent> = new Subject<CoverEvent>();
}

export interface CoverEvent {
  cover?: ContentfulCover;
  show: boolean;
}
