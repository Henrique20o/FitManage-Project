import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CadastroService } from '../../services/cadastro-service';
import { CadastroApi } from '../../models/cadastro-api';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule,CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  cadastro: CadastroApi = {
    nomePessoal: '',
    cpf: '',
    telefone: '',
    email: '',
    nomeAcademia: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    uf: '',
    complemento: '',
    cidade: '',
    plano: '',
    login: '',
    senha: '',
  };

  constructor(private cadastroService: CadastroService, private router: Router) {}

  onRegister(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched(); // força mostrar os erros
      return;
    }

    this.cadastroService.criarCadastro(this.cadastro).subscribe({
      next: (res: CadastroApi) => {
        console.log('Cadastro salvo com sucesso:', res);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (erro: any) => {
        console.error('Erro ao salvar cadastro:', erro);
        alert('Erro ao salvar cadastro.');
      },
    });
  }
}
