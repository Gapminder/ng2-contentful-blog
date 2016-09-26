import { Routes, RouterModule } from '@angular/router';
import { RoutesGatewayGuard } from '../components/routes-gateway/routes-gateway.guard';
import { TagComponent } from '../components/tags/tag.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { RoutesGatewayComponent } from '../components/routes-gateway/routes-gateway.component';
import { RootDemoComponent } from './components/root/root-demo';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {path: '', component: RootDemoComponent},
  {path: 'tag/:tag', component: TagComponent},
  {path: 'profile/:userName', component: ProfileComponent},
  {path: '**', component: RoutesGatewayComponent, canActivate: [RoutesGatewayGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
