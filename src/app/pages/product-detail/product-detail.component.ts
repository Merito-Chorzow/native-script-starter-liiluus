import { Component, OnInit, NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule } from '@nativescript/angular';
import { ProductService, Product } from '../../product.service';
import { CommonModule } from '@angular/common';
import * as Camera from '@nativescript/camera';
import { ImageAsset, confirm, ImageSource } from '@nativescript/core';

@Component({
  selector: 'ns-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [CommonModule, NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isEditing = false;
  editedProduct: Product | null = null;
  isSaving = false;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.errorMessage = 'Brak ID produktu.';
      this.isLoading = false;
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.editedProduct = { ...data };
        if (data.photo && !data.photo.startsWith('data:') && data.photo.length > 0) {
          (this.product as any).photoPath = 'data:image/jpeg;base64,' + data.photo;
          (this.editedProduct as any).photoPath = 'data:image/jpeg;base64,' + data.photo;
        } else if (data.photo && data.photo.startsWith('data:')) {
          (this.product as any).photoPath = data.photo;
          (this.editedProduct as any).photoPath = data.photo;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nie udało się pobrać szczegółów produktu.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  startEdit(): void {
    if (!this.product) {
      alert('Brak danych produktu do edycji.');
      return;
    }
    this.isEditing = true;
    this.editedProduct = { ...this.product };
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedProduct = this.product ? { ...this.product } : null;
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  async takePhoto(): Promise<void> {
    try {
      await Camera.requestPermissions();
      const photo = await Camera.takePicture({
        width: 400,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false,
      });
      
      if (this.editedProduct) {
        let photoPath = "";
        if (photo.android) {
          photoPath = photo.android;
        } else if (photo.ios) {
          photoPath = photo.ios;
        }
        
        try {
          const imageSource = await ImageSource.fromAsset(photo);
          if (imageSource) {
            this.editedProduct.photo = imageSource.toBase64String("jpeg", 80);
          }
        } catch (error) {
          console.error("Error converting photo:", error);
          this.editedProduct.photo = photoPath || "photo_taken";
        }
        
        if (photoPath) {
          (this.editedProduct as any).photoPath = photoPath;
        }
        
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Błąd przy robieniu zdjęcia:', error);
      alert('Nie udało się zrobić zdjęcia. Sprawdź uprawnienia aparatu.');
    }
  }

  saveProduct(): void {
    if (!this.editedProduct || !this.product?.id) {
      alert('Brak danych do zapisania.');
      return;
    }

    if (!this.editedProduct.name || !this.editedProduct.name.trim()) {
      alert('Nazwa produktu jest wymagana!');
      return;
    }

    if (!this.editedProduct.code || !this.editedProduct.code.trim()) {
      alert('Kod produktu jest wymagany!');
      return;
    }

    this.isSaving = true;
    
    const productToUpdate = {
      ...this.editedProduct,
      photo: typeof this.editedProduct.photo === 'string' ? this.editedProduct.photo : ''
    };

    this.productService.updateProduct(this.product.id, productToUpdate).subscribe({
      next: (updated) => {
        this.product = updated;
        this.editedProduct = { ...updated };
        this.isEditing = false;
        this.isSaving = false;
        this.cdr.detectChanges();
        alert('Produkt zaktualizowany!');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Błąd aktualizacji produktu. Sprawdź połączenie z internetem.');
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteProduct(): void {
    if (!this.product?.id) {
      alert('Produkt nie ma ID. Nie można usunąć.');
      return;
    }

    const confirmOptions = {
      title: "Usuń produkt",
      message: "Czy na pewno chcesz usunąć ten produkt?",
      okButtonText: "Tak",
      cancelButtonText: "Anuluj"
    };

    confirm(confirmOptions).then((result) => {
      if (result) {
        this.isDeleting = true;
        this.productService.deleteProduct(this.product!.id!).subscribe({
          next: () => {
            alert('Produkt usunięty!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Delete error:', err);
            alert('Błąd usuwania produktu. Sprawdź połączenie z internetem.');
            this.isDeleting = false;
          },
        });
      }
    });
  }
}
