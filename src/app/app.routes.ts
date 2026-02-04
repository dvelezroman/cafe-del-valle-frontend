import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoginComponent } from './components/admin/login/login';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { CafeInfo } from './components/admin/cafe-info/cafe-info';
import { MenuManagement } from './components/admin/menu-management/menu-management';
import { BlogManagement } from './components/admin/blog-management/blog-management';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admin/login', component: LoginComponent },
    {
        path: 'admin/dashboard',
        component: Dashboard,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            { path: 'info', component: CafeInfo },
            { path: 'menu', component: MenuManagement },
            { path: 'blog', component: BlogManagement }
        ]
    },
    { path: '**', redirectTo: '' }
];
