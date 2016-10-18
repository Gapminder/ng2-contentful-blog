import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CoverService {
  public cover$: Subject<CoverEvent> = new Subject<CoverEvent>();
}

export interface CoverEvent {
  cover: string;
}
