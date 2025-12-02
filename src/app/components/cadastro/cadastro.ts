import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CadastroService } from '../../services/cadastro-service';
import { CadastroApi } from '../../models/cadastro-api';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  // objeto que o formulário vai preencher
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

  isSubmitting = false;

  constructor(
    private cadastroService: CadastroService,
    private router: Router
  ) {}

  onRegister(form: NgForm) {
    // se tiver qualquer campo inválido, não deixa enviar
    if (form.invalid) {
      // força todos os campos a ficarem "touched" pra aparecer as mensagens
      form.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.cadastroService.criarCadastro(this.cadastro).subscribe({
      next: (res: CadastroApi) => {
        console.log('Cadastro salvo com sucesso:', res);
        alert('Cadastro realizado com sucesso!');
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (erro: any) => {
        console.error('Erro ao salvar cadastro:', erro);
        alert('Erro ao salvar cadastro.');
        this.isSubmitting = false;
      },
    });
  }
}
