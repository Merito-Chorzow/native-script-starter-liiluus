import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Http, ApplicationSettings } from "@nativescript/core";

export interface Product {
  id?: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  photo?: string;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private defaultApiUrl = "https://6935cfe3fa8e704dafbef33d.mockapi.io/products";
  
  get apiUrl(): string {
    const saved = ApplicationSettings.getString('apiUrl');
    return saved || this.defaultApiUrl;
  }
  
  set apiUrl(url: string) {
    ApplicationSettings.setString('apiUrl', url);
  }

  getProducts(): Observable<Product[]> {
    return new Observable<Product[]>((observer) => {
      const url = this.apiUrl;
      Http.getJSON<Product[]>(url)
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          observer.error(error);
        });
    });
  }

  addProduct(product: Product): Observable<Product> {
    const productToSend = {
      name: product.name,
      code: product.code,
      status: product.status || "aktywny",
      description: product.description || "",
      photo: typeof product.photo === 'string' ? product.photo : ""
    };

    return new Observable<Product>((observer) => {
      Http.request({
        url: this.apiUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(productToSend)
      })
        .then((response) => {
          const data = response.content?.toJSON() as Product;
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          observer.error(error);
        });
    });
  }

  getProduct(id: string): Observable<Product> {
    return new Observable<Product>((observer) => {
      Http.getJSON<Product>(`${this.apiUrl}/${id}`)
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          observer.error(error);
        });
    });
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return new Observable<Product>((observer) => {
      Http.request({
        url: `${this.apiUrl}/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(product)
      })
        .then((response) => {
          const data = response.content?.toJSON() as Product;
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          observer.error(error);
        });
    });
  }

  deleteProduct(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      Http.request({
        url: `${this.apiUrl}/${id}`,
        method: "DELETE"
      })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          observer.error(error);
        });
    });
  }
}
