import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class RegistrationComponent {
  data = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idNumber: '',
    phone: '',
    referralCode: ''
  };

  loading = false;
  success = '';
  error = '';

  constructor(private authService: AuthService) { }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.subscribe(this.data).subscribe({
      next: () => {
        this.loading = false;
        this.success = '¡Solicitud enviada! Un administrador revisará tu perfil pronto. Te notificaremos por correo.';
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al enviar la solicitud. Por favor intenta más tarde.';
      }
    });
  }

  private resetForm() {
    this.data = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      idNumber: '',
      phone: '',
      referralCode: ''
    };
  }
}
