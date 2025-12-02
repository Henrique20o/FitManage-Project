import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Dashboard } from './components/dashboard/dashboard';
import { Alunos } from './components/alunos/alunos';
import { Planos } from './components/planos/planos';
import { Financeiro } from './components/financeiro/financeiro';
import { Relatorio } from './components/relatorio/relatorio';

import { authGuard } from './services/guards/auth-guard';
import { noAuthGuard } from './services/guards/public-guard';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage,
        canActivate: [noAuthGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate: [noAuthGuard]
    },
    {
        path: 'cadastro',
        component: Cadastro,
        canActivate: [noAuthGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'alunos',
        component: Alunos,
        canActivate: [authGuard]
    },
    {
        path: 'planos',
        component: Planos,
        canActivate: [authGuard]
    },
    {
        path: 'financeiro',
        component: Financeiro,
        canActivate: [authGuard]
    },
    {
        path: 'relatorios',
        component: Relatorio,
        canActivate: [authGuard]
    }
];