import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { ApplicationSettings, confirm } from '@nativescript/core';
import { ProductService } from '../../product.service';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [CommonModule, NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsComponent implements OnInit {
  offlineMode = false;
  apiUrl = 'https://6935cfe3fa8e704dafbef33d.mockapi.io/products';
  autoRefresh = true;
  showNotifications = true;
  cacheProducts = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.offlineMode = ApplicationSettings.getBoolean('offlineMode', false);
    this.autoRefresh = ApplicationSettings.getBoolean('autoRefresh', true);
    this.showNotifications = ApplicationSettings.getBoolean('showNotifications', true);
    this.cacheProducts = ApplicationSettings.getBoolean('cacheProducts', true);
    
    const savedApiUrl = ApplicationSettings.getString('apiUrl');
    if (savedApiUrl) {
      this.apiUrl = savedApiUrl;
    }
  }

  toggleOfflineMode(): void {
    this.offlineMode = !this.offlineMode;
    ApplicationSettings.setBoolean('offlineMode', this.offlineMode);
    if (this.offlineMode) {
      alert('Tryb offline włączony. Niektóre funkcje mogą być niedostępne.');
    } else {
      alert('Tryb offline wyłączony.');
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    ApplicationSettings.setBoolean('autoRefresh', this.autoRefresh);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    ApplicationSettings.setBoolean('showNotifications', this.showNotifications);
  }

  toggleCacheProducts(): void {
    this.cacheProducts = !this.cacheProducts;
    ApplicationSettings.setBoolean('cacheProducts', this.cacheProducts);
  }

  saveApiUrl(): void {
    if (!this.apiUrl || !this.apiUrl.trim()) {
      alert('URL API nie może być pusty!');
      return;
    }

    if (!this.apiUrl.startsWith('http://') && !this.apiUrl.startsWith('https://')) {
      alert('URL API musi zaczynać się od http:// lub https://');
      return;
    }

    ApplicationSettings.setString('apiUrl', this.apiUrl.trim());
    alert('URL API zapisany! Aplikacja użyje nowego adresu przy następnym żądaniu.');
  }

  resetToDefaults(): void {
    const confirmOptions = {
      title: "Resetuj ustawienia",
      message: "Czy na pewno chcesz przywrócić domyślne ustawienia?",
      okButtonText: "Tak",
      cancelButtonText: "Anuluj"
    };

    confirm(confirmOptions).then((result: boolean) => {
      if (result) {
        ApplicationSettings.remove('offlineMode');
        ApplicationSettings.remove('apiUrl');
        ApplicationSettings.remove('autoRefresh');
        ApplicationSettings.remove('showNotifications');
        ApplicationSettings.remove('cacheProducts');
        
        this.apiUrl = 'https://6935cfe3fa8e704dafbef33d.mockapi.io/products';
        this.offlineMode = false;
        this.autoRefresh = true;
        this.showNotifications = true;
        this.cacheProducts = true;
        
        alert('Ustawienia przywrócone do domyślnych wartości.');
      }
    });
  }

  clearCache(): void {
    const confirmOptions = {
      title: "Wyczyść cache",
      message: "Czy na pewno chcesz wyczyścić cache aplikacji?",
      okButtonText: "Tak",
      cancelButtonText: "Anuluj"
    };

    confirm(confirmOptions).then((result: boolean) => {
      if (result) {
        ApplicationSettings.remove('cachedProducts');
        alert('Cache wyczyszczony!');
      }
    });
  }

  goBackToProducts(): void {
    this.router.navigate(['/products']);
  }
}
