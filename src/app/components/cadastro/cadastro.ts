import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {

  academia: any = {
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    nome: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: '',
    planoSelecionado: '',
    usuario: '',
    senha: ''
  };

  erro: string = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  onCadastrar(): void {
    this.erro = '';
    this.usuarioService.buscarPorUsuario(this.academia.usuario).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          this.erro = 'Usuario já existe!';
          alert(this.erro);
          return;
        }
        
          this.usuarioService.cadastrar(this.academia).subscribe({
          next: () => {
            alert('Cadastro realizado com sucesso!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.erro = 'Erro ao cadastrar';
            alert(this.erro);
          }
        });
      },
      error: (err) => {
        this.erro = 'Erro ao buscar usuario';
        alert(this.erro);
      }
    });
  }
}
