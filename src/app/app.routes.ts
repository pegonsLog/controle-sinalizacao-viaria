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
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/solicitacoes/solicitacao-lista/solicitacao-lista.component').then(m => m.SolicitacaoListaComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/solicitacoes/solicitacao-form/solicitacao-form.component').then(m => m.SolicitacaoFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/solicitacoes/solicitacao-form/solicitacao-form.component').then(m => m.SolicitacaoFormComponent)
      }
    ]
  },
  {
    path: 'funcionarios',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/funcionarios/funcionario-lista/funcionario-lista.component').then(m => m.FuncionarioListaComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/funcionarios/funcionario-form/funcionario-form.component').then(m => m.FuncionarioFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/funcionarios/funcionario-form/funcionario-form.component').then(m => m.FuncionarioFormComponent)
      }
    ]
  },
  {
    path: 'sinalizacoes',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/sinalizacoes/sinalizacao-lista/sinalizacao-lista.component').then(m => m.SinalizacaoListaComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/sinalizacoes/sinalizacao-form/sinalizacao-form.component').then(m => m.SinalizacaoFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/sinalizacoes/sinalizacao-form/sinalizacao-form.component').then(m => m.SinalizacaoFormComponent)
      }
    ]
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/usuarios/usuario-lista/usuario-lista.component').then(m => m.UsuarioListaComponent)
      },
      {
        path: 'novo',
        loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'solicitacoes'
  }
];
