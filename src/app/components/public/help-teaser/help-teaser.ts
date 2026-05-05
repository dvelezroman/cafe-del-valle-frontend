import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-help-teaser',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help-teaser.html',
  styleUrl: './help-teaser.scss',
})
export class HelpTeaserComponent {
  private translation = inject(TranslationService);

  t(key: string, params?: { [k: string]: string }): string {
    return this.translation.translate(key, params);
  }
}
