import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslationService, Language } from '../../../services/translation.service';
import { AuthService } from '../../../services/auth.service';
import { getArticlesForUser, type HelpArticle } from '../../../data/help-articles';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help-center.html',
  styleUrl: './help-center.scss',
})
export class HelpCenterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  readonly translation = inject(TranslationService);

  lang = signal<Language>('es');
  expandedId = signal<string | null>(null);

  articles = computed<HelpArticle[]>(() => {
    this.auth.currentUser();
    return getArticlesForUser(this.auth.getCurrentUser());
  });

  ngOnInit() {
    this.lang.set(this.translation.getCurrentLanguageValue());
    this.translation.getCurrentLanguage().subscribe((l) => this.lang.set(l));

    this.route.queryParamMap.subscribe((p) => {
      const topic = p.get('topic');
      if (topic && getArticlesForUser(this.auth.getCurrentUser()).some((a) => a.id === topic)) {
        this.expandedId.set(topic);
        setTimeout(() => {
          const el = document.getElementById(`help-article-${topic}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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

  toggle(id: string) {
    this.expandedId.update((cur) => (cur === id ? null : id));
  }

  isOpen(id: string): boolean {
    return this.expandedId() === id;
  }
}
