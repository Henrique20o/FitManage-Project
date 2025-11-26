import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-plano',
  imports: [],
  templateUrl: './card-plano.html',
  styleUrl: './card-plano.css',
})
export class CardPlano {
  @Input() titulo = '';
  @Input() descricao = '';
  @Input() valor = '';
}
