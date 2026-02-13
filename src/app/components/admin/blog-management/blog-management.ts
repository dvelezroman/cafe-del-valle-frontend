import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

interface BlogPost {
  id: string;
  title: { es: string; en: string; fr: string };
  slug: string;
  excerpt: { es: string; en: string; fr: string };
  content: { es: string; en: string; fr: string };
  author: string;
  image?: string;
  categoryId: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  publishedAt?: string;
}

interface BlogCategory {
  id: string;
  name: { es: string; en: string; fr: string };
  slug: string;
}

@Component({
  selector: 'app-blog-management',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.scss'
})
export class BlogManagement implements OnInit {
  posts = signal<BlogPost[]>([]);
  categories = signal<BlogCategory[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal<string>('');
  showPostModal = signal(false);
  showCategoryModal = signal(false);
  isEditingPost = signal(false);
  isEditingCategory = signal(false);
  selectedPost = signal<BlogPost | null>(null);
  selectedCategoryItem = signal<BlogCategory | null>(null);
  isSaving = signal(false);
  isDeleting = signal(false);
  
  activeLang: 'es' | 'en' | 'fr' = 'es';
  
  postForm: Partial<BlogPost> = {
    title: { es: '', en: '', fr: '' },
    slug: '',
    excerpt: { es: '', en: '', fr: '' },
    content: { es: '', en: '', fr: '' },
    author: '',
    image: '',
    categoryId: '',
    tags: [],
    published: false,
    featured: false
  };

  categoryForm: Partial<BlogCategory> = {
    name: { es: '', en: '', fr: '' },
    slug: ''
  };

  tagsInput = '';

  filteredPosts = computed(() => {
    let items = this.posts();
    
    if (this.selectedCategory()) {
      items = items.filter(post => post.categoryId === this.selectedCategory());
    }
    
    const query = this.searchQuery().toLowerCase();
    if (query) {
      items = items.filter(post => 
        post.title.es?.toLowerCase().includes(query) ||
        post.title.en?.toLowerCase().includes(query) ||
        post.title.fr?.toLowerCase().includes(query) ||
        post.slug.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return items.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  });

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts() {
    this.loading.set(true);
    this.adminService.getBlogPosts().subscribe({
      next: (posts: any[]) => {
        this.posts.set(posts || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.adminService.getBlogCategories().subscribe({
      next: (categories: any[]) => {
        this.categories.set(categories || []);
      }
    });
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  updateSlug() {
    const title = this.postForm.title?.[this.activeLang] || '';
    if (title && !this.isEditingPost()) {
      this.postForm.slug = this.generateSlug(title);
    }
  }

  openCreatePostModal() {
    this.isEditingPost.set(false);
    this.selectedPost.set(null);
    this.resetPostForm();
    this.showPostModal.set(true);
  }

  openEditPostModal(post: BlogPost) {
    this.isEditingPost.set(true);
    this.selectedPost.set(post);
    this.postForm = {
      title: { ...post.title },
      slug: post.slug,
      excerpt: { ...post.excerpt },
      content: { ...post.content },
      author: post.author,
      image: post.image || '',
      categoryId: post.categoryId,
      tags: [...post.tags],
      published: post.published,
      featured: post.featured
    };
    this.tagsInput = post.tags.join(', ');
    this.showPostModal.set(true);
  }

  closePostModal() {
    this.showPostModal.set(false);
    this.resetPostForm();
  }

  resetPostForm() {
    this.postForm = {
      title: { es: '', en: '', fr: '' },
      slug: '',
      excerpt: { es: '', en: '', fr: '' },
      content: { es: '', en: '', fr: '' },
      author: '',
      image: '',
      categoryId: '',
      tags: [],
      published: false,
      featured: false
    };
    this.tagsInput = '';
    this.activeLang = 'es';
  }

  savePost() {
    if (this.isSaving()) return;

    if (!this.postForm.title?.es?.trim()) {
      this.toastService.error('El título en español es requerido');
      return;
    }

    if (!this.postForm.slug?.trim()) {
      this.toastService.error('El slug es requerido');
      return;
    }

    if (!this.postForm.categoryId) {
      this.toastService.error('La categoría es requerida');
      return;
    }

    const tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const postData: any = {
      title: this.postForm.title,
      slug: this.postForm.slug.trim(),
      excerpt: this.postForm.excerpt,
      content: this.postForm.content,
      author: this.postForm.author?.trim() || 'Equipo Café del Valle',
      image: this.postForm.image?.trim() || undefined,
      categoryId: this.postForm.categoryId,
      tags,
      published: this.postForm.published ?? false,
      featured: this.postForm.featured ?? false,
      publishedAt: this.postForm.published ? new Date().toISOString() : undefined
    };

    this.isSaving.set(true);

    if (this.isEditingPost() && this.selectedPost()) {
      this.adminService.updateBlogPost(this.selectedPost()!.id, postData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Post actualizado correctamente');
          this.closePostModal();
          this.loadPosts();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    } else {
      this.adminService.createBlogPost(postData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Post creado correctamente');
          this.closePostModal();
          this.loadPosts();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    }
  }

  deletePost(post: BlogPost) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${post.title.es || post.title.en}"? Esta acción no se puede deshacer.`)) {
      this.isDeleting.set(true);
      this.adminService.deleteBlogPost(post.id).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.toastService.success('Post eliminado correctamente');
          this.loadPosts();
        },
        error: () => {
          this.isDeleting.set(false);
        }
      });
    }
  }

  togglePublished(post: BlogPost) {
    this.adminService.updateBlogPost(post.id, {
      ...post,
      published: !post.published,
      publishedAt: !post.published ? new Date().toISOString() : post.publishedAt
    }).subscribe({
      next: () => {
        this.toastService.success(`Post ${!post.published ? 'publicado' : 'despublicado'}`);
        this.loadPosts();
      }
    });
  }

  // Category Management
  openCreateCategoryModal() {
    this.isEditingCategory.set(false);
    this.selectedCategoryItem.set(null);
    this.resetCategoryForm();
    this.showCategoryModal.set(true);
  }

  openEditCategoryModal(category: BlogCategory) {
    this.isEditingCategory.set(true);
    this.selectedCategoryItem.set(category);
    this.categoryForm = {
      name: { ...category.name },
      slug: category.slug
    };
    this.showCategoryModal.set(true);
  }

  closeCategoryModal() {
    this.showCategoryModal.set(false);
    this.resetCategoryForm();
  }

  resetCategoryForm() {
    this.categoryForm = {
      name: { es: '', en: '', fr: '' },
      slug: ''
    };
    this.activeLang = 'es';
  }

  updateCategorySlug() {
    const name = this.categoryForm.name?.[this.activeLang] || '';
    if (name && !this.isEditingCategory()) {
      this.categoryForm.slug = this.generateSlug(name);
    }
  }

  saveCategory() {
    if (!this.categoryForm.name?.es?.trim()) {
      this.toastService.error('El nombre en español es requerido');
      return;
    }

    if (!this.categoryForm.slug?.trim()) {
      this.toastService.error('El slug es requerido');
      return;
    }

    const categoryData: any = {
      name: this.categoryForm.name,
      slug: this.categoryForm.slug.trim()
    };

    this.isSaving.set(true);

    if (this.isEditingCategory() && this.selectedCategoryItem()) {
      this.adminService.updateBlogCategory(this.selectedCategoryItem()!.id, categoryData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Categoría actualizada correctamente');
          this.closeCategoryModal();
          this.loadCategories();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    } else {
      this.adminService.createBlogCategory(categoryData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.success('Categoría creada correctamente');
          this.closeCategoryModal();
          this.loadCategories();
        },
        error: () => {
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteCategory(category: BlogCategory) {
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name.es || category.name.en}"?`)) {
      this.adminService.deleteBlogCategory(category.id).subscribe({
        next: () => {
          this.toastService.success('Categoría eliminada correctamente');
          this.loadCategories();
        }
      });
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name.es || category?.name.en || 'Sin categoría';
  }

  Object = Object;
}
