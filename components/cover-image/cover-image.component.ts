import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { CoverService, CoverEvent } from './cover.service';

@Component({
  selector: 'gm-cover',
  template: require('./cover-image.html') as string,
  styles: [require('./cover-image.css') as string]
})
export class CoverImageComponent implements OnInit {

  private router: Router;
  private cover: string;
  private routesManager: RoutesManagerService;
  private coverService: CoverService;

  public constructor(router: Router,
                     coverService: CoverService,
                     routesManager: RoutesManagerService) {
    this.router = router;
    this.coverService = coverService;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {
    this.coverService.cover$.subscribe((res: CoverEvent)=> {
      this.cover = res.cover;
    });
  }
}

interface RouteData {
  name?: string;
  cover?: string;
}
