import { Routes, RouterModule } from '@angular/router';
import { RoutesGatewayGuard } from '../components/routes-gateway/routes-gateway.guard';
import { TagComponent } from '../components/tags/tag.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { RoutesGatewayComponent } from '../components/routes-gateway/routes-gateway.component';
import { ModuleWithProviders } from '@angular/core';
import { DynamicContentDetailsComponent } from './components/dynamic-content/dynamic-content-details.component';

export const routes: Routes = [
  {path: '', component: DynamicContentDetailsComponent},
  {path: 'tag/:tag', component: TagComponent},
  {path: 'profile/:userName', component: ProfileComponent},
  {path: '**', component: RoutesGatewayComponent, canActivate: [RoutesGatewayGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
