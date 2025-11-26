import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {
        path: "",
        component: LandingPage
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "cadastro",
        component: Cadastro
    }
];
 