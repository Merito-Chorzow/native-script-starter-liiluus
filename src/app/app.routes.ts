import { Routes } from "@angular/router";
import { ProductListComponent } from "./pages/product-list/product-list.component";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { ProductAddComponent } from "./pages/product-add/product-add.component";
import { SettingsComponent } from "./pages/settings/settings.component";

export const routes: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "products", component: ProductListComponent },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "add", component: ProductAddComponent },
  { path: "settings", component: SettingsComponent },
];