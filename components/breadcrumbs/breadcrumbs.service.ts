import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbs$: Subject<BreadcrumbsEvent> = new Subject();
}

export interface BreadcrumbsEvent {
  name: string;
  url: string;
}

