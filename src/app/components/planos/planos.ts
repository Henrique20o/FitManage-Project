import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CardPlano } from './card-plano/card-plano';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const API_PLANOS = 'http://localhost:3000/planos';

@Component({
  selector: 'app-planos',
  imports: [Sidebar, CardPlano, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './planos.html',
  styleUrl: './planos.css',
})
export class Planos {
  private http = inject(HttpClient);

  planos: Array<{ titulo: string; descricao: string; valor: string }> = [];

  // controla se o modal de "Criar novo plano" está aberto
  modalPlanoAberto = false;

  // objeto que recebe os dados do formulário
  novoPlano = {
    titulo: '',
    descricao: '',
    valor: ''
  };

  constructor() {
    this.loadPlanos();
  }

  loadPlanos(): void {
    this.http.get<any[]>(API_PLANOS).subscribe({
      next: (data) => {
        this.planos = data || [];
      },
      error: (err) => {
        console.error('Erro ao carregar planos:', err);
        this.planos = [];
      }
    });
  }

  abrirModalPlano() {
    this.modalPlanoAberto = true;
  }

  fecharModalPlano() {
    this.modalPlanoAberto = false;
    this.novoPlano = { titulo: '', descricao: '', valor: '' };
  }

  salvarPlano() {
    const payload = {
      titulo: this.novoPlano.titulo,
      descricao: this.novoPlano.descricao,
      valor: this.novoPlano.valor
    };

    // Persiste o novo plano na API e recarrega a lista
    this.http.post(API_PLANOS, payload).subscribe({
      next: () => {
        this.loadPlanos();
        this.fecharModalPlano();
      },
      error: (err) => {
        console.error('Erro ao salvar plano:', err);
        // Fecha o modal mesmo em caso de erro localmente
        this.fecharModalPlano();
      }
    });
  }
}
