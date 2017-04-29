import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards/index';

import { PerformanceComponent } from './performance/performance.component';
import { LatencyComponent } from './latency/latency.component';
import { ErrorsComponent } from './errors/errors.component';
import { CustomComponent } from './custom/custom.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'performance', component: PerformanceComponent },
    { path: 'latency', component: LatencyComponent },
    { path: 'errors', component: ErrorsComponent },
    { path: 'custom', component: CustomComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
