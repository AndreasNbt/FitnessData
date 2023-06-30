import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardsComponent } from './dashboards/dashboards.component';


const routes: Routes = [
  { path: '', component: AboutComponent},
  { path: 'dashboards', component: DashboardsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
