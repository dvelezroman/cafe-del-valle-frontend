import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'PARTNER';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  isModalOpen = signal(false);
  isSubmitting = signal(false);
  editingUser = signal<User | null>(null);
  
  formData = signal({
    email: '',
    password: '',
    name: '',
    role: 'ADMIN' as 'ADMIN' | 'EDITOR' | 'PARTNER',
    active: true
  });

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar usuarios');
      }
    });
  }

  openCreateModal() {
    this.editingUser.set(null);
    this.formData.set({
      email: '',
      password: '',
      name: '',
      role: 'ADMIN',
      active: true
    });
    this.isModalOpen.set(true);
  }

  openEditModal(user: User) {
    this.editingUser.set(user);
    this.formData.set({
      email: user.email,
      password: '',
      name: user.name,
      role: user.role,
      active: user.active
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
  }

  submitForm() {
    if (this.isSubmitting()) return;

    const form = this.formData();
    
    // Validation
    if (!form.email || !form.name) {
      this.toastService.error('Email y nombre son requeridos');
      return;
    }

    if (!this.editingUser() && !form.password) {
      this.toastService.error('La contraseña es requerida para nuevos usuarios');
      return;
    }

    this.isSubmitting.set(true);

    if (this.editingUser()) {
      // Update existing user
      const updateData: any = {
        email: form.email,
        name: form.name,
        role: form.role,
        active: form.active
      };
      
      // Only include password if provided
      if (form.password) {
        updateData.password = form.password;
      }

      this.adminService.updateUser(this.editingUser()!.id, updateData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toastService.success('Usuario actualizado correctamente');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const message = err.error?.message || 'Error al actualizar usuario';
          this.toastService.error(message);
        }
      });
    } else {
      // Create new user
      this.adminService.createUser(form).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toastService.success('Usuario creado correctamente');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const message = err.error?.message || 'Error al crear usuario';
          this.toastService.error(message);
        }
      });
    }
  }

  toggleUserActive(user: User) {
    if (user.id === this.authService.getCurrentUser()?.id) {
      this.toastService.error('No puedes desactivar tu propia cuenta');
      return;
    }

    this.adminService.toggleUserActive(user.id).subscribe({
      next: () => {
        this.toastService.success(`Usuario ${user.active ? 'desactivado' : 'activado'} correctamente`);
        this.loadUsers();
      },
      error: (err) => {
        const message = err.error?.message || 'Error al cambiar estado del usuario';
        this.toastService.error(message);
      }
    });
  }

  deleteUser(user: User) {
    if (user.id === this.authService.getCurrentUser()?.id) {
      this.toastService.error('No puedes eliminar tu propia cuenta');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.success('Usuario eliminado correctamente');
        this.loadUsers();
      },
      error: (err) => {
        const message = err.error?.message || 'Error al eliminar usuario';
        this.toastService.error(message);
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'EDITOR': 'Editor',
      'PARTNER': 'Socio'
    };
    return labels[role] || role;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  updateFormField(field: 'name' | 'email' | 'password' | 'role' | 'active', value: any) {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  getFormValue(field: 'name' | 'email' | 'password' | 'role' | 'active'): any {
    return this.formData()[field];
  }
}
