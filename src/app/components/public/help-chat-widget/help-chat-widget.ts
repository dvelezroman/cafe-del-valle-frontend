import { Component, inject, signal, computed, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService, Language } from '../../../services/translation.service';
import { AuthService } from '../../../services/auth.service';
import {
  getArticlesForUser,
  getArticleById,
  type HelpArticle,
} from '../../../data/help-articles';

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
  articleId?: string;
}

@Component({
  selector: 'app-help-chat-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help-chat-widget.html',
  styleUrl: './help-chat-widget.scss',
})
export class HelpChatWidgetComponent {
  private auth = inject(AuthService);
  readonly translation = inject(TranslationService);

  readonly scrollAnchor = viewChild<ElementRef<HTMLElement>>('scrollAnchor');

  open = signal(false);
  lang = signal<Language>('es');
  conversation = signal<ChatTurn[]>([]);

  topics = computed(() => {
    this.auth.currentUser();
    this.lang();
    return getArticlesForUser(this.auth.getCurrentUser());
  });

  constructor() {
    this.lang.set(this.translation.getCurrentLanguageValue());
    this.translation.getCurrentLanguage().subscribe((l) => this.lang.set(l));

    effect(() => {
      this.conversation();
      if (!this.open()) return;
      const el = this.scrollAnchor()?.nativeElement;
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'end' }));
      }
    });
  }

  t(key: string, params?: { [k: string]: string }): string {
    return this.translation.translate(key, params);
  }

  text(article: HelpArticle, field: 'title' | 'body' | 'topicLabel'): string {
    const l = this.lang();
    return article[field][l] || article[field]['es'];
  }

  linkLabel(link: { label: Record<Language, string> }): string {
    const l = this.lang();
    return link.label[l] || link.label['es'];
  }

  toggle() {
    this.open.update((v) => !v);
    if (!this.open()) return;
    if (this.conversation().length === 0) {
      this.resetWelcome();
    }
  }

  close() {
    this.open.set(false);
  }

  private resetWelcome() {
    this.conversation.set([]);
  }

  selectTopic(article: HelpArticle) {
    const label = this.text(article, 'topicLabel');
    const body = this.text(article, 'body');
    this.conversation.update((prev) => [
      ...prev,
      { role: 'user', text: label, articleId: article.id },
      { role: 'assistant', text: body, articleId: article.id },
    ]);
  }

  clearChat() {
    this.resetWelcome();
  }

  linksForArticle(articleId: string | undefined) {
    if (!articleId) return [];
    return getArticleById(articleId)?.links ?? [];
  }
}
