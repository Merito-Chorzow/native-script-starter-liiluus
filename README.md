[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Uu9lUx8_)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21969023&assignment_repo_type=AssignmentRepo)
# NativeScript: Scan Inventory

# Aplikacja mobilna do prostego zarządzania inwentarzem. Umożliwia:

- przeglądanie listy produktów (nazwa, kod, status),
- dodawanie nowych produktów z użyciem natywnego skanera kodów (kamera),
- podgląd szczegółów z opcjami edycji/usuwania,
- (opcjonalnie) ustawienia aplikacji.

## Cel
Zbuduj podstawową aplikację w **NativeScript używając framework Angular**, która używa **natywnej funkcji** oraz **komunikuje się z API**, z **3–4 widokami**.

## Zakres i wymagania funkcjonalne
- **Natywna funkcja (min. 1):** wybierz i uzasadnij (np. aparat/kamera – skan/zdjęcie, pliki, geolokalizacja, latarka, wibracje).
- **API (min. 1 endpoint):** pobranie listy elementów lub zapis nowego.
- **Widoki (3–4):**
  1. **Lista produktów** (nazwa, kod, mini-status).
  2. **Szczegóły produktu** (opis, zdjęcie/skan, akcje: usuń/edytuj).
  3. **Dodaj produkt** (formularz + akcja natywna, np. „zeskanuj/zdjęcie”).
  4. *(Opcjonalnie)* **Ustawienia** (np. preferencje, tryb offline).
- **Walidacja:** minimalna w formularzu (np. wymagane pola).

## Testowanie lokalne (w trakcie developmentu)
- Uruchom na **urządzeniu/emulatorze**.
- Pokaż: dodanie produktu z użyciem **natywnej funkcji** (np. zdjęcie/skan), pojawienie się na liście.
- Pokaż komunikację z **API** (pobranie/zapis) i zachowanie przy błędach/uprawnieniach.

## Definition of Done (DoD)
- [ ] 3–4 widoki + nawigacja.
- [ ] Co najmniej 1 **natywna funkcja**.
- [ ] Integracja z **API** (GET/POST).
- [ ] Walidacja formularza + podstawowa obsługa błędów.
- [ ] Aktualizacja `README.md`, zrzuty ekranów, min. 3 commity.

## Architektura

- src/app
	- services/api.service.ts — komunikacja z API (GET/POST/DELETE/PATCH)
	- models/product.model.ts — typy danych
	- pages/
		- product-list/
		- product-details/
		- add-product/
		- settings/ (opcjonalnie)
	- app.routes.ts — konfiguracja tras
- Pluginy natywne: @nativescript/barcode-scanner

## Instalacja i uruchomienie

# Wymagania:
- Node.js LTS
- NativeScript CLI
- Android SDK lub Xcode (dla iOS)
- Emulator lub urządzenie fizyczne
  Kroki:
    npm install
    ns doctor
    ns prepare android
    ns run android

    ns build android --release

# Uprawnienia:
- Android: kamera (proszona automatycznie przez plugin skanera)
- iOS: dodaj opisy uprawnień do Info.plist (NSCameraUsageDescription)

## Natywna funkcja: skan kodu (kamera)
Używamy @nativescript/barcode-scanner do odczytu kodów (EAN-13, CODE_128, QR itp.).

# Uzasadnienie:
- szybkie i bezbłędne wprowadzanie kodów,
- typowy use case inwentaryzacyjny,
- skan działa offline, zapis może być wykonany po odzyskaniu sieci.

# Scenariusz:
- Ekran „Dodaj produkt” → „Zeskanuj kod” → otwarcie kamery → wpisanie wyniku do pola „Kod”.

## API i środowiska
Domyślnie aplikacja korzysta z prostego API (np. MockAPI/JSON server). Adres można podmienić w ApiService.

# Przykładowe endpointy:

- GET /products — lista produktów

- GET /products/:id — szczegóły

- POST /products — dodanie

- PATCH /products/:id — edycja

- DELETE /products/:id — usunięcie

# Zmiana adresu:
- src/app/services/api.service.ts → baseUrl

# Obsługa błędów:
- czytelne komunikaty (toast/alert),
- informacja o braku internetu lub odmowie uprawnień.

## Widoki

1) Lista produktów (/products)
- Wyświetla: nazwa, kod, mini-status (np. „aktywny”/„niedostępny”)
- Akcje: odśwież, przejdź do szczegółów, dodaj nowy produkt

2) Szczegóły produktu (/products/:id)
- Wyświetla: nazwa, kod, opis, miniatura zdjęcia (jeśli istnieje)
- Akcje: edytuj (PATCH), usuń (DELETE)

3) Dodaj produkt (/add-product)
- Formularz: nazwa (wymagane), kod (wymagane), opis (opcjonalne), zdjęcie/scan (opcjonalne)
- Natywna akcja: „Zeskanuj kod”
- Zapis: POST /products, po sukcesie nawigacja do listy

4) Ustawienia (opcjonalnie) (/settings)
- Preferencje (np. tryb offline, auto-odświeżanie)
- Przechowywanie w ApplicationSettings

## Walidacja i obsługa błędów
- Minimalna walidacja formularza „Dodaj produkt”:
	- nazwa: wymagane, min. 2 znaki
	- kod: wymagane (może pochodzić ze skanera)

- Obsługa błędów:
	- brak uprawnień do kamery → komunikat i link do ustawień,
	- błąd API → komunikat + możliwość ponowienia.

## Testowanie lokalne (w trakcie developmentu)

1. Uruchom aplikację: ns run android lub ns run ios.
2. Przejdź do „Dodaj produkt”.
3. Użyj „Zeskanuj kod” i zeskanuj etykietę (EAN/QR).
4. Wypełnij pola i zapisz.
5. Przejdź do listy — nowy produkt powinien być widoczny.
6. Otwórz szczegóły, edytuj lub usuń.
7. Odłącz internet i spróbuj odświeżyć listę — sprawdź komunikaty o błędzie.

## Zrzuty ekranów
- screen-add.png
- screen-details.png
- screen-list.png
- screen-settings.png

## Definition of Done (DoD)
-  3–4 widoki + nawigacja
-  Co najmniej 1 natywna funkcja (kamera → skaner kodów)
-  Integracja z API (GET/POST; opcjonalnie DELETE/PATCH)
-  Walidacja formularza + podstawowa obsługa błędów

## Instrukcja
- Aplikacja startuje na /products.
- Demo dodawania wykorzystuje natywny skaner.
- Adres API można zmienić w ApiService.