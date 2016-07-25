import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbs$: Subject<BreadcrumbsEvent> = new Subject<BreadcrumbsEvent>();
}

export interface BreadcrumbsEvent {
  name: string;
  url: string;
  show?: boolean;
}

