import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Dashboard } from './components/dashboard/dashboard';
import { Alunos } from './components/alunos/alunos';
import { Planos } from './components/planos/planos';
import { Financeiro } from './components/financeiro/financeiro';
import { Relatorio } from './components/relatorio/relatorio';

export const routes: Routes = [
    {path: "", component: LandingPage},
    {path: "login", component: Login},
    {path: "cadastro", component: Cadastro},
    {path: "dashboard", component: Dashboard},
    {path: "alunos" , component: Alunos},
    {path: "planos", component: Planos},
    {path: "financeiro", component: Financeiro},
    {path: "relatorios", component: Relatorio}
];
 