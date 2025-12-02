import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'solicitacoes',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'solicitacoes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/solicitacoes/solicitacao-lista/solicitacao-lista.component').then(m => m.SolicitacaoListaComponent)
  },
  {
    path: 'solicitacoes/novo',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/solicitacoes/solicitacao-form/solicitacao-form.component').then(m => m.SolicitacaoFormComponent)
  },
  {
    path: 'solicitacoes/editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/solicitacoes/solicitacao-form/solicitacao-form.component').then(m => m.SolicitacaoFormComponent)
  },
  {
    path: 'funcionarios',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/funcionarios/funcionario-lista/funcionario-lista.component').then(m => m.FuncionarioListaComponent)
  },
  {
    path: 'funcionarios/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/funcionarios/funcionario-form/funcionario-form.component').then(m => m.FuncionarioFormComponent)
  },
  {
    path: 'funcionarios/editar/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/funcionarios/funcionario-form/funcionario-form.component').then(m => m.FuncionarioFormComponent)
  },
  {
    path: 'sinalizacoes',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/sinalizacoes/sinalizacao-lista/sinalizacao-lista.component').then(m => m.SinalizacaoListaComponent)
  },
  {
    path: 'sinalizacoes/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/sinalizacoes/sinalizacao-form/sinalizacao-form.component').then(m => m.SinalizacaoFormComponent)
  },
  {
    path: 'sinalizacoes/editar/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/sinalizacoes/sinalizacao-form/sinalizacao-form.component').then(m => m.SinalizacaoFormComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/usuarios/usuario-lista/usuario-lista.component').then(m => m.UsuarioListaComponent)
  },
  {
    path: 'usuarios/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  },
  {
    path: 'usuarios/editar/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  },
  {
    path: '**',
    redirectTo: 'solicitacoes'
  }
];
