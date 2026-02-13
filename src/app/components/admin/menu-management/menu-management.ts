import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

type MenuCategory = 'BEBIDAS' | 'COMIDAS' | 'POSTRES' | 'ESPECIALES';

interface MenuItem {
  id: string;
  name: string;
  description: { es: string; en: string; fr: string };
  price: number;
  category: MenuCategory;
  image?: string;
  available: boolean;
  featured: boolean;
  order: number;
}

@Component({
  selector: 'app-menu-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.scss'
})
export class MenuManagement implements OnInit {
  menuItems = signal<MenuItem[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal<MenuCategory | ''>('');
  showModal = signal(false);
  isEditing = signal(false);
  selectedItem = signal<MenuItem | null>(null);
  isSaving = signal(false);
  isDeleting = signal(false);
  
  activeLang: 'es' | 'en' | 'fr' = 'es';
  
  formData: Partial<MenuItem> = {
    name: '',
    description: { es: '', en: '', fr: '' },
    price: 0,
    category: 'BEBIDAS',
    image: '',
    available: true,
    featured: false,
    order: 0
  };

  categories: MenuCategory[] = ['BEBIDAS', 'COMIDAS', 'POSTRES', 'ESPECIALES'];

  filteredItems = computed(() => {
    let items = this.menuItems();
    
    // Filter by category
    if (this.selectedCategory()) {
      items = items.filter(item => item.category === this.selectedCategory());
    }
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.es?.toLowerCase().includes(query) ||
        item.description.en?.toLowerCase().includes(query) ||
        item.description.fr?.toLowerCase().includes(query)
      );
    }
    
    return items.sort((a, b) => a.order - b.order);
  });

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.loading.set(true);
    this.adminService.getMenuItems().subscribe({
      next: (items: any[]) => {
        this.menuItems.set(items || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedItem.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(item: MenuItem) {
    this.isEditing.set(true);
    this.selectedItem.set(item);
    this.formData = {
      name: item.name,
      description: { ...item.description },
      price: item.price,
      category: item.category,
      image: item.image || '',
      available: item.available,
      featured: item.featured,
      order: item.order
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      description: { es: '', en: '', fr: '' },
      price: 0,
      category: 'BEBIDAS',
      image: '',
      available: true,
      featured: false,
      order: 0
    };
    this.activeLang = 'es';
  }

  saveItem() {
    if (this.isSaving()) return;

    // Validation
    if (!this.formData.name?.trim()) {
      this.toastService.error('El nombre del item es requerido');
      return;
    }

    if (!this.formData.price || this.formData.price < 0) {
      this.toastService.error('El precio debe ser mayor o igual a 0');
      return;
    }

    const itemData: any = {
      name: this.formData.name.trim(),
      description: this.formData.description,
      price: parseFloat(this.formData.price.toString()),
      category: this.formData.category,
      image: this.formData.image?.trim() || undefined,
      available: this.formData.available ?? true,
      featured: this.formData.featured ?? false,
      order: this.formData.order || 0
    };

    this.isSaving.set(true);

    if (this.isEditing() && this.selectedItem()) {
      // Update existing item
      this.adminService.updateMenuItem(this.selectedItem()!.id, itemData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Item actualizado correctamente');
          this.closeModal();
          this.loadMenuItems();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    } else {
      // Create new item
      this.adminService.createMenuItem(itemData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Item creado correctamente');
          this.closeModal();
          this.loadMenuItems();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteItem(item: MenuItem) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${item.name}"? Esta acción no se puede deshacer.`)) {
      this.isDeleting.set(true);
      this.adminService.deleteMenuItem(item.id).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.toastService.success('Item eliminado correctamente');
          this.loadMenuItems();
        },
        error: () => {
          this.isDeleting.set(false);
        }
      });
    }
  }

  toggleAvailability(item: MenuItem) {
    this.adminService.updateMenuItem(item.id, {
      ...item,
      available: !item.available
    }).subscribe({
      next: () => {
        this.toastService.success(`Item ${!item.available ? 'habilitado' : 'deshabilitado'}`);
        this.loadMenuItems();
      }
    });
  }

  toggleFeatured(item: MenuItem) {
    this.adminService.updateMenuItem(item.id, {
      ...item,
      featured: !item.featured
    }).subscribe({
      next: () => {
        this.toastService.success(`Item ${!item.featured ? 'marcado como destacado' : 'removido de destacados'}`);
        this.loadMenuItems();
      }
    });
  }

  bulkToggleAvailability(available: boolean) {
    const itemsToUpdate = this.filteredItems().filter(item => item.available !== available);
    if (itemsToUpdate.length === 0) {
      this.toastService.error('No hay items para actualizar');
      return;
    }

    if (confirm(`¿${available ? 'Habilitar' : 'Deshabilitar'} ${itemsToUpdate.length} item(s)?`)) {
      let completed = 0;
      const total = itemsToUpdate.length;
      
      itemsToUpdate.forEach(item => {
        this.adminService.updateMenuItem(item.id, { ...item, available }).subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.toastService.success(`${total} item(s) actualizado(s)`);
              this.loadMenuItems();
            }
          },
          error: () => {
            completed++;
            if (completed === total) {
              this.loadMenuItems();
            }
          }
        });
      });
    }
  }

  Object = Object;
}
