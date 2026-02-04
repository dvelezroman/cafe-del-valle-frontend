import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoginComponent } from './components/admin/login/login';
import { Dashboard as AdminDashboard } from './components/admin/dashboard/dashboard';
import { CafeInfo } from './components/admin/cafe-info/cafe-info';
import { MenuManagement } from './components/admin/menu-management/menu-management';
import { BlogManagement } from './components/admin/blog-management/blog-management';
import { PartnerManagement } from './components/admin/partner-management/partner-management';
import { PromotionManagement } from './components/admin/promotion-management/promotion-management';
import { RegistrationComponent } from './components/club/registration/registration';
import { Layout as PartnerLayout } from './components/partner/layout/layout';
import { Dashboard as PartnerDashboard } from './components/partner/dashboard/dashboard';
import { History as PartnerHistory } from './components/partner/history/history';
import { adminGuard } from './guards/admin.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

// Simple partner guard
const partnerGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return (auth.isAuthenticated() && auth.hasRole('PARTNER')) ? true : router.parseUrl('/admin/login');
};

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'club/join', component: RegistrationComponent },
    { path: 'admin/login', component: LoginComponent },
    {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            { path: 'info', component: CafeInfo },
            { path: 'menu', component: MenuManagement },
            { path: 'blog', component: BlogManagement },
            { path: 'partners', component: PartnerManagement },
            { path: 'club', component: PromotionManagement }
        ]
    },
    {
        path: 'partner',
        component: PartnerLayout,
        canActivate: [partnerGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: PartnerDashboard },
            { path: 'history', component: PartnerHistory }
        ]
    },
    { path: '**', redirectTo: '' }
];
