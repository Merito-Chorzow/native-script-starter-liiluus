import { Component, OnInit, NO_ERRORS_SCHEMA, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NativeScriptCommonModule, NativeScriptRouterModule } from "@nativescript/angular";
import { ProductService, Product } from "../../product.service";

@Component({
  selector: "ns-product-list",
  templateUrl: "./product-list.component.html",
  standalone: true,
  imports: [CommonModule, NativeScriptCommonModule, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProductListComponent implements OnInit {
products: Product[] = [];
isLoading = true;
errorMessage: string | null = null;

constructor(
  private productService: ProductService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
    this.loadProducts();
}

loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.productService.getProducts().subscribe({
    next: (data) => {
        this.products = [...(data || [])];
        this.isLoading = false;
        this.cdr.detectChanges();
    },
    error: (err) => {
        console.error("Error loading products:", err);
        this.errorMessage = "Nie udało się pobrać listy produktów.";
        this.isLoading = false;
        this.cdr.detectChanges();
    },
    });
}

navigateToProduct(product: Product): void {
    if (product.id) {
        this.router.navigate(['/products', product.id]);
    } else {
        console.warn("Product does not have an ID:", product);
        alert("Ten produkt nie ma ID i nie można wyświetlić szczegółów.");
    }
}

navigateToSettings(): void {
    this.router.navigate(['/settings']);
}
}