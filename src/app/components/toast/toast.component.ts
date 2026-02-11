import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [ngClass]="toast.type" @toastAnimation>
          <div class="toast-content">
            <span class="icon" [ngSwitch]="toast.type">
              <span *ngSwitchCase="'success'">✓</span>
              <span *ngSwitchCase="'error'">✕</span>
              <span *ngSwitchCase="'info'">ℹ</span>
            </span>
            <span class="message">{{ toast.message }}</span>
          </div>
          <button class="close-btn" (click)="toastService.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      max-width: 400px;
      padding: 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      backdrop-filter: blur(10px);
      border-left: 4px solid;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .message {
      font-size: 0.95rem;
      color: #333;
      line-height: 1.4;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      line-height: 1;
    }

    .close-btn:hover {
      color: #333;
    }

    /* Types */
    .toast.success {
      border-left-color: #10b981;
      background: rgba(255, 255, 255, 0.95);
    }
    .toast.success .icon { color: #10b981; }

    .toast.error {
      border-left-color: #ef4444;
      background: rgba(255, 255, 255, 0.95);
    }
    .toast.error .icon { color: #ef4444; }

    .toast.info {
      border-left-color: #3b82f6;
      background: rgba(255, 255, 255, 0.95);
    }
    .toast.info .icon { color: #3b82f6; }
  `],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
