import { Component, NO_ERRORS_SCHEMA, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule } from "@nativescript/angular";
import { ProductService } from "../../product.service";
import * as Camera from "@nativescript/camera";
import { ImageAsset, ImageSource } from "@nativescript/core";

@Component({
  selector: "ns-product-add",
  templateUrl: "./product-add.component.html",
  standalone: true,
  imports: [CommonModule, NativeScriptCommonModule, NativeScriptRouterModule, NativeScriptFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProductAddComponent {
name = "";
code = "";
status = "";
photo: ImageAsset | null = null;
photoPath: string = "";
isSaving = false;

constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

async takePhoto() {
    try {
      await Camera.requestPermissions();
      const photo = await Camera.takePicture({
        width: 400,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false,
      });
      
      this.photo = photo;
      
      if (photo.android) {
        this.photoPath = photo.android;
      } else if (photo.ios) {
        this.photoPath = photo.ios;
      }
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Błąd przy robieniu zdjęcia:", error);
      alert("Nie udało się zrobić zdjęcia. Sprawdź uprawnienia aparatu.");
    }
}

addProduct() {
    if (!this.name || !this.name.trim()) {
      alert("Nazwa produktu jest wymagana!");
      return;
    }

    if (!this.code || !this.code.trim()) {
      alert("Kod produktu jest wymagany!");
      return;
    }

    this.isSaving = true;

    const processPhoto = (): Promise<string> => {
      return new Promise((resolve) => {
        if (!this.photo) {
          resolve("");
          return;
        }

        ImageSource.fromAsset(this.photo!)
          .then((imageSource) => {
            if (imageSource) {
              const base64 = imageSource.toBase64String("jpeg", 80);
              resolve(base64);
            } else {
              resolve(this.photoPath || "");
            }
          })
          .catch((error) => {
            console.error("Error converting photo:", error);
            resolve(this.photoPath || "");
          });
      });
    };

    processPhoto().then((photoString) => {
      const newProduct = {
        name: this.name.trim(),
        code: this.code.trim(),
        status: this.status?.trim() || "aktywny",
        description: "",
        photo: photoString,
      };

      this.productService.addProduct(newProduct).subscribe({
        next: (response) => {
          alert("Produkt dodany!");
          this.name = "";
          this.code = "";
          this.status = "";
          this.photo = null;
          this.photoPath = "";
          this.isSaving = false;
          this.cdr.detectChanges();
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error("Error adding product:", err);
          alert("Błąd zapisu danych. Sprawdź połączenie z internetem.");
          this.isSaving = false;
        },
      });
    });
}
}