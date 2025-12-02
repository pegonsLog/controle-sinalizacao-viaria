import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  
  private usuarioLogado = signal<Usuario | null>(null);
  
  readonly usuario = this.usuarioLogado.asReadonly();

  constructor() {
    this.carregarUsuarioSalvo();
  }

  private carregarUsuarioSalvo(): void {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      this.usuarioLogado.set(JSON.parse(usuarioSalvo));
    }
  }

  async login(matricula: string, senha: string): Promise<boolean> {
    const usuario = await this.usuarioService.buscarPorMatricula(matricula);
    
    if (usuario && usuario.senha === senha) {
      this.usuarioLogado.set(usuario);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.usuarioLogado.set(null);
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.usuarioLogado() !== null;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioLogado();
    return usuario?.perfil === 'Administrador';
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogado();
  }

  getPerfil(): string | null {
    return this.usuarioLogado()?.perfil || null;
  }
}
