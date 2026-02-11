import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationOptions, ConfirmationResult } from '../../services/confirmation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirmation-modal.html',
    styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
    private confirmationService = inject(ConfirmationService);
    private subscription?: Subscription;

    show = false;
    options: ConfirmationOptions = {
        title: 'Confirmar',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmButtonClass: 'primary',
        showCancel: true
    };

    ngOnInit() {
        this.subscription = this.confirmationService.getConfirmation().subscribe(data => {
            if (data) {
                this.options = {
                    title: data.options.title || 'Confirmar',
                    message: data.options.message,
                    confirmText: data.options.confirmText || 'Confirmar',
                    cancelText: data.options.cancelText || 'Cancelar',
                    confirmButtonClass: data.options.confirmButtonClass || 'primary',
                    showCancel: data.options.showCancel !== false
                };
                this.show = true;
            } else {
                this.show = false;
            }
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    confirm() {
        this.confirmationService.confirm({ confirmed: true });
        this.show = false;
    }

    cancel() {
        this.confirmationService.confirm({ confirmed: false });
        this.show = false;
    }

    close() {
        this.cancel();
    }
}
