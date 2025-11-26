import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Dashboard } from './components/dashboard/dashboard';
import { Alunos } from './components/alunos/alunos';

export const routes: Routes = [
    {path: "", component: LandingPage},
    {path: "login", component: Login},
    {path: "cadastro", component: Cadastro},
    {path: "dashboard-inicio", component: Dashboard},
    {path: "alunos" , component: Alunos}
];
 