import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: 'primary' | 'danger' | 'warning';
    showCancel?: boolean;
}

export interface ConfirmationResult {
    confirmed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    private confirmationSubject = new BehaviorSubject<{ options: ConfirmationOptions; resolve: (result: ConfirmationResult) => void } | null>(null);
    
    show(options: ConfirmationOptions): Observable<ConfirmationResult> {
        return new Observable(observer => {
            const resolve = (result: ConfirmationResult) => {
                observer.next(result);
                observer.complete();
                this.confirmationSubject.next(null);
            };

            this.confirmationSubject.next({ options, resolve });
        });
    }

    getConfirmation(): Observable<{ options: ConfirmationOptions; resolve: (result: ConfirmationResult) => void } | null> {
        return this.confirmationSubject.asObservable();
    }

    confirm(result: ConfirmationResult) {
        const current = this.confirmationSubject.value;
        if (current) {
            current.resolve(result);
        }
    }
}
