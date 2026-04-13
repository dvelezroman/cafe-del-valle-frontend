import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface BranchRow {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  active: boolean;
  order: number;
}

@Component({
  selector: 'app-branch-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-management.html',
  styleUrl: './branch-management.scss'
})
export class BranchManagement implements OnInit {
  branches = signal<BranchRow[]>([]);
  loading = signal(true);
  showModal = signal(false);
  isEditing = signal(false);
  selected = signal<BranchRow | null>(null);
  isSaving = signal(false);
  isDeleting = signal(false);

  form: { name: string; slug: string; address: string; phone: string; active: boolean; order: number } = {
    name: '',
    slug: '',
    address: '',
    phone: '',
    active: true,
    order: 0
  };

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.adminService.getBranchesAdmin().subscribe({
      next: (rows) => {
        this.branches.set((rows || []) as BranchRow[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.isEditing.set(false);
    this.selected.set(null);
    this.form = { name: '', slug: '', address: '', phone: '', active: true, order: 0 };
    this.showModal.set(true);
  }

  openEdit(row: BranchRow) {
    this.isEditing.set(true);
    this.selected.set(row);
    this.form = {
      name: row.name,
      slug: row.slug,
      address: row.address || '',
      phone: row.phone || '',
      active: row.active,
      order: row.order
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  save() {
    if (this.isSaving()) return;
    if (!this.form.name?.trim()) {
      this.toastService.error('El nombre es requerido');
      return;
    }
    this.isSaving.set(true);
    const payload: any = {
      name: this.form.name.trim(),
      slug: this.form.slug?.trim() || undefined,
      address: this.form.address?.trim() || undefined,
      phone: this.form.phone?.trim() || undefined,
      active: this.form.active,
      order: Number(this.form.order) || 0
    };
    if (this.isEditing() && this.selected()) {
      this.adminService.updateBranch(this.selected()!.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Sucursal actualizada');
          this.closeModal();
          this.load();
        },
        error: () => this.isSaving.set(false)
      });
    } else {
      this.adminService.createBranch(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Sucursal creada');
          this.closeModal();
          this.load();
        },
        error: () => this.isSaving.set(false)
      });
    }
  }

  deleteRow(row: BranchRow) {
    if (!confirm(`¿Eliminar la sucursal "${row.name}"? Los vínculos con el menú se quitarán.`)) return;
    this.isDeleting.set(true);
    this.adminService.deleteBranch(row.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.toastService.success('Sucursal eliminada');
        this.load();
      },
      error: () => this.isDeleting.set(false)
    });
  }

  toggleActive(row: BranchRow) {
    this.adminService.updateBranch(row.id, { active: !row.active }).subscribe({
      next: () => {
        this.toastService.success(row.active ? 'Sucursal desactivada' : 'Sucursal activada');
        this.load();
      }
    });
  }
}
