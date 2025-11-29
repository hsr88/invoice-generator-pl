# 💼 Generator Faktur VAT

Nowoczesny, profesjonalny generator faktur VAT dla polskich firm. Twórz piękne faktury PDF bezpośrednio w przeglądarce. Bez serwera, całkowicie po stronie klienta z pełną prywatnością.

![Wersja](https://img.shields.io/badge/wersja-1.0.0-blue.svg)
![Licencja](https://img.shields.io/badge/licencja-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Funkcje

### 📄 Profesjonalne Faktury
- **Czysty, nowoczesny design** w stylu brutalistycznym
- **Export do PDF** z wysokiej jakości formatowaniem
- **Polski standard faktur VAT** - zgodny z wymaganiami
- **Automatyczne obliczenia** wszystkich sum

### 💰 Kompleksowa Fakturacja
- **Nieograniczona liczba pozycji** - dodaj tyle ile potrzebujesz
- **Obsługa VAT** - 23%, 8%, 5%, 0%, zwolniony
- **Jednostki miary** - szt., godz., usł., m, m², kg
- **Obliczenia w czasie rzeczywistym** - kwoty aktualizują się na bieżąco

### 🇵🇱 Polskie Wymagania
- **Numer NIP** - dla sprzedawcy i nabywcy
- **Data sprzedaży** - zgodnie z przepisami
- **Termin płatności** - automatycznie 14 dni
- **Metody płatności** - przelew, gotówka, karta, BLIK
- **Numer konta bankowego** - dla przelewów
- **Format polskiej daty** - DD.MM.RRRR
- **Waluta PLN** - z polskim formatowaniem (przecinek, spacje)

### 🎨 Unikalny Design
- **Brutalistyczny styl** - czarny + neonowa zieleń
- **Grain effect** - tekstura vintage
- **Smooth animations** - płynne przejścia
- **Responsywny** - działa na wszystkich urządzeniach

### 💾 Zapisz i Użyj Ponownie
- **Zapisywanie szablonu** - zapisz dane swojej firmy
- **Wczytywanie szablonu** - szybko załaduj zapisane dane
- **Przechowywanie w przeglądarce** - wszystko lokalnie (prywatne)
- **Bez rejestracji** - bez kont, bez logowania

### 🔒 Prywatność Przede Wszystkim
- **100% client-side** - wszystko w Twojej przeglądarce
- **Bez uploadu na serwer** - Twoje dane nigdy nie opuszczają urządzenia
- **Bez śledzenia** - całkowicie prywatne
- **Działa offline** - po pierwszym załadowaniu

## 🚀 Demo

[Live Demo](https://generator-fv.netlify.app/) 

## 📸 Zrzuty Ekranu

<img width="341" height="884" alt="Zrzut ekranu 2025-11-30 002402" src="https://github.com/user-attachments/assets/8cde72fd-8cc4-4688-9b8c-53f468989e5c" />


## 🛠️ Instalacja

### Opcja 1: Sklonuj Repozytorium
```bash
git clone https://github.com/hsr88/invoice-generator-pl.git
cd invoice-generator-pl
```

### Opcja 2: Pobierz ZIP
Pobierz plik ZIP i rozpakuj.

### Opcja 3: Użyj Bezpośrednio
Po prostu otwórz `index.html` w przeglądarce!

## 📖 Instrukcja Użycia

### Tworzenie Pierwszej Faktury

1. **Dane Sprzedawcy (Twoje)**
   - Wpisz nazwę firmy (wymagane)
   - Dodaj NIP (wymagane)
   - Uzupełnij adres, email, telefon
   - Podaj numer konta bankowego
   - Te dane można zapisać jako szablon

2. **Dane Nabywcy (Klient)**
   - Wpisz nazwę firmy/osoby (wymagane)
   - Dodaj NIP jeśli firma
   - Uzupełnij dane kontaktowe

3. **Dane Faktury**
   - Numer faktury (np. FV/01/2024)
   - Data wystawienia (domyślnie dzisiaj)
   - Data sprzedaży (domyślnie dzisiaj)
   - Termin płatności (domyślnie +14 dni)
   - Sposób płatności

4. **Dodaj Pozycje**
   - Kliknij "+ Dodaj Pozycję" dla każdego towaru/usługi
   - Wpisz nazwę, ilość, cenę netto
   - Wybierz stawkę VAT
   - Sumy liczą się automatycznie
   - Usuń pozycje przyciskiem "×"

5. **Uwagi**
   - Dodaj informacje o terminie płatności
   - Napisz dodatkowe uwagi

6. **Generuj Fakturę**
   - Kliknij "👁 Podgląd" aby zobaczyć
   - Kliknij "📄 Generuj PDF" aby pobrać
   - PDF zapisze się jako `Faktura-[numer].pdf`

### Używanie Szablonów

**Zapisz Szablon:**
- Wypełnij dane swojej firmy
- Kliknij "💾 Zapisz Szablon"
- Dane zapisują się w przeglądarce

**Wczytaj Szablon:**
- Kliknij "📂 Wczytaj Szablon"
- Twoje dane firmy załadują się automatycznie
- Wystarczy uzupełnić dane klienta i pozycje

## 📁 Struktura Projektu

```
invoice-generator-pl/
│
├── index.html          # Struktura HTML
├── style.css           # Unikalny design (brutalist)
├── script.js           # Logika aplikacji
└── README.md           # Dokumentacja
```

## 🎯 Kluczowe Funkcje

### Automatyczne Obliczenia
Wszystkie obliczenia w czasie rzeczywistym:
- Wartość netto = Ilość × Cena netto
- Kwota VAT = Wartość netto × Stawka VAT
- Wartość brutto = Wartość netto + Kwota VAT
- Sumy dla całej faktury

### Stawki VAT
Obsługiwane stawki VAT:
- 23% - stawka podstawowa
- 8% - stawka obniżona
- 5% - stawka obniżona
- 0% - stawka zerowa
- zw. - zwolniony z VAT

### Generowanie PDF
Używa biblioteki jsPDF do generowania PDF:
- Profesjonalne formatowanie
- Prawidłowe odstępy i wyrównanie
- Dane sprzedawcy i nabywcy
- Tabela pozycji z sumami
- Uwagi i informacje o płatności
- Miejsca na podpisy

## 🌐 Wsparcie Przeglądarek

- ✅ Chrome (zalecane)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ⚠️ IE11 (ograniczone wsparcie)

## 🔧 Dostosowanie

### Zmiana Kolorów

Edytuj zmienne CSS w `style.css`:

```css
:root {
    --color-bg: #0a0a0a;           /* Tło główne */
    --color-primary: #00ff94;       /* Kolor główny */
    --color-accent: #ff006e;        /* Kolor akcentu */
    /* ... */
}
```

### Domyślna Stawka VAT

Ustaw domyślną stawkę w `script.js`:

```javascript
// W funkcji addItem()
<option value="23" selected>23%</option>
```

### Domyślny Termin Płatności

Zmień ilość dni w `script.js`:

```javascript
// W DOMContentLoaded
dueDate.setDate(dueDate.getDate() + 14); // 14 dni
```

## 🤝 Współpraca

Wkład jest mile widziany! Jak możesz pomóc:

1. Forkuj repozytorium
2. Stwórz branch funkcji (`git checkout -b feature/NowaFunkcja`)
3. Commit zmian (`git commit -m 'Dodaj NowaFunkcja'`)
4. Push do brancha (`git push origin feature/NowaFunkcja`)
5. Otwórz Pull Request

### Pomysły na Rozwój
- [ ] Upload logo firmy
- [ ] Faktury korygujące
- [ ] Faktury proforma
- [ ] Więcej jednostek miary
- [ ] Historia faktur
- [ ] Eksport do innych formatów
- [ ] Ciemny/jasny motyw
- [ ] Wielojęzyczność
- [ ] Integracja z e-mail
- [ ] Kod QR dla płatności

## 📝 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) po szczegóły.

## 👨‍💻 Autor

**hsr88**
- GitHub: [@hsr88](https://github.com/hsr88)

## 🙏 Podziękowania

- Generowanie PDF: [jsPDF](https://github.com/parallax/jsPDF)
- Czcionki: Google Fonts (Space Grotesk, JetBrains Mono)
- Inspiracja: profesjonalne potrzeby fakturowania

## 💡 Przypadki Użycia

Idealne dla:
- 💻 Freelancerów - programiści, graficy, konsultanci
- 🏢 Małych firm - dostawcy usług
- 🔧 Rzemieślników - naprawy, usługi
- 📚 Korepetytorów - faktury za lekcje
- 🎨 Kreatywnych - projektanci, artyści
- 📊 Księgowych - szybkie faktury dla klientów

## 🐛 Znane Problemy

- Brak w tej chwili! Zgłaszaj problemy na GitHub.

## 🔮 Roadmapa

### Wersja 1.1
- [ ] Historia/archiwum faktur
- [ ] Upload logo firmy
- [ ] Pole na podpis elektroniczny
- [ ] Faktury korygujące

### Wersja 1.2
- [ ] Wiele szablonów
- [ ] Faktury cykliczne
- [ ] Tryb proforma
- [ ] Baza klientów

### Wersja 2.0
- [ ] Panel statystyk
- [ ] Integracja email
- [ ] Śledzenie płatności
- [ ] Eksport do JPK

## 📊 FAQ

**P: Czy moje dane są bezpieczne?**  
O: Tak! Wszystko działa w przeglądarce. Żadne dane nie są wysyłane na serwer.

**P: Czy mogę używać offline?**  
O: Tak! Po pierwszym załadowaniu aplikacja jest cachowana.

**P: Czy muszę coś instalować?**  
O: Nie! Wystarczy otworzyć plik HTML w przeglądarce.

**P: Czy mogę zmienić design faktury?**  
O: Tak! Edytuj plik CSS aby zmienić kolory, fonty, layout.

**P: Czy to jest darmowe?**  
O: Tak! Całkowicie darmowe i open-source.

**P: Czy faktury są zgodne z prawem?**  
O: Aplikacja generuje faktury zgodnie z polskimi standardami, ale zawsze skonsultuj się z księgowym.

## 📱 Wsparcie Mobile

Aplikacja działa na urządzeniach mobilnych, ale jest zoptymalizowana dla desktop/tablet dla najlepszego doświadczenia przy tworzeniu szczegółowych faktur.

## 🔐 Prywatność i Bezpieczeństwo

- Brak zbierania danych
- Brak śledzenia analytics
- Brak cookies (oprócz localStorage dla szablonów)
- Brak zewnętrznych API (oprócz jsPDF CDN)
- Twoje dane zostają na Twoim urządzeniu

---

**Profesjonalne fakturowanie made simple** 💼✨

*Gwiazdka ⭐ to repozytorium jeśli pomaga Twojemu biznesowi!*
