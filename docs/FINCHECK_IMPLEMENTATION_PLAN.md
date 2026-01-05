# Plan Implementacji FinCheck

> Polska aplikacja do analizy finansowej spółek.

## Spis Treści

1. [Przegląd](#przegląd)
2. [Architektura](#architektura)
3. [Schemat Bazy Danych](#schemat-bazy-danych)
4. [Struktura Plików](#struktura-plików)
5. [Fazy Implementacji](#fazy-implementacji)
6. [Interfejsy TypeScript](#interfejsy-typescript)
7. [Konfiguracja Docker](#konfiguracja-docker)
8. [Zmienne Środowiskowe](#zmienne-środowiskowe)
9. [Endpointy API](#endpointy-api)
10. [Obliczenia Finansowe](#obliczenia-finansowe)

---

## Przegląd

### Czym jest FinCheck?

FinCheck umożliwia użytkownikom:
1. **Wyszukiwanie** polskich spółek po numerze KRS
2. **Przeglądanie** informacji o spółce z Krajowego Rejestru Sądowego (KRS)
3. **Pobieranie** i parsowanie sprawozdań finansowych (XML e-sprawozdania)
4. **Obliczanie** 7 wskaźników finansowych + 2 modeli predykcji upadłości
5. **Generowanie** analizy finansowej opartej na AI, dopasowanej do roli użytkownika

### Zakres MVP

| Funkcjonalność | MVP | Przyszłość |
|----------------|-----|------------|
| Wyszukiwanie po KRS | ✅ | Wyszukiwanie po NIP/Nazwie |
| Integracja z API KRS | ✅ | - |
| Pobieranie sprawozdań finansowych | ✅ | - |
| Parsowanie XML (e-sprawozdania) | ✅ | Parsowanie PDF |
| 7 wskaźników finansowych | ✅ | Więcej wskaźników |
| 2 modele upadłościowe | ✅ | Więcej modeli |
| Analiza AI (OpenRouter darmowe) | ✅ | Płatne modele |
| Podstawowy interfejs wyszukiwania | ✅ | Dashboard |
| Konta użytkowników | ❌ | ✅ |
| Płatności | ❌ | ✅ |
| Generowanie raportów PDF | ❌ | ✅ |

---

## Architektura

### Diagram Systemu

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRZEGLĄDARKA UŻYTKOWNIKA                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APLIKACJA SVELTEKIT                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   /fincheck     │  │   /fincheck/    │  │  Endpointy API  │  │
│  │   Wyszukiwanie  │  │   [krs]/        │  │  /api/...       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MODUŁY SERWEROWE                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │  Klient  │  │  Crawler │  │  Parser  │  │  Analiza │  │   │
│  │  │   KRS    │  │   RDF    │  │   XML    │  │    AI    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  │  ┌──────────┐  ┌──────────┐                              │   │
│  │  │Wskaźniki │  │  Modele  │                              │   │
│  │  │Finansowe │  │Upadłości │                              │   │
│  │  └──────────┘  └──────────┘                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                    │                      │
         ▼                    ▼                      ▼
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ PostgreSQL  │     │   Playwright    │     │   OpenRouter    │
│ Baza Danych │     │   Kontener      │     │      API        │
└─────────────┘     └─────────────────┘     └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  ekrs.ms.gov.pl │
                  │  (Portal RDF)   │
                  └─────────────────┘
```

### Przepływ Danych

1. **Użytkownik wyszukuje po KRS** → SvelteKit sprawdza cache w DB
2. **Brak w cache** → Pobierz z API KRS → Zapisz w DB
3. **Użytkownik żąda analizy** → Sprawdź istniejące dokumenty finansowe
4. **Brak dokumentów** → Playwright crawluje ekrs.ms.gov.pl → Pobiera XML
5. **Parsuj XML** → Wyodrębnij bilans, rachunek zysków i strat, cash flow
6. **Oblicz wskaźniki** → 7 wskaźników finansowych + 2 modele upadłościowe
7. **Wygeneruj prompt AI** → Wyślij do OpenRouter → Wyświetl analizę

---

## Schemat Bazy Danych

### Nowe Tabele

Dodaj do `src/lib/server/db/schema.ts`:

```typescript
import { pgTable, serial, text, varchar, timestamp, date, integer, jsonb, index } from 'drizzle-orm/pg-core';

// Informacje o spółce z API KRS
export const companies = pgTable('companies', {
  krs: varchar('krs', { length: 10 }).primaryKey(),
  nip: varchar('nip', { length: 10 }),
  regon: varchar('regon', { length: 14 }),
  name: text('name').notNull(),
  legalForm: text('legal_form'),
  pkdMain: varchar('pkd_main', { length: 10 }),
  pkdOther: jsonb('pkd_other').$type<string[]>(),
  address: jsonb('address').$type<{
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }>(),
  capital: jsonb('capital').$type<{
    initial: number;
    current: number;
    currency: string;
  }>(),
  management: jsonb('management').$type<Array<{
    name: string;
    role: string;
    since: string;
  }>>(),
  shareholders: jsonb('shareholders').$type<Array<{
    name: string;
    shares: number;
    percentage: number;
  }>>(),
  financialStatementsList: jsonb('financial_statements_list').$type<Array<{
    period: string;
    submittedAt: string;
    documentId: string;
  }>>(),
  rawKrsData: jsonb('raw_krs_data'),
  lastFetchedAt: timestamp('last_fetched_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  nipIdx: index('companies_nip_idx').on(table.nip),
  nameIdx: index('companies_name_idx').on(table.name)
}));

// Pobrane dokumenty finansowe
export const financialDocuments = pgTable('financial_documents', {
  id: serial('id').primaryKey(),
  companyKrs: varchar('company_krs', { length: 10 })
    .notNull()
    .references(() => companies.krs),
  periodFrom: date('period_from').notNull(),
  periodTo: date('period_to').notNull(),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'annual_report', 'semi_annual', itp.
  fileFormat: varchar('file_format', { length: 10 }).notNull(), // 'xml', 'pdf'
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  sourceUrl: text('source_url'),
  parsedData: jsonb('parsed_data').$type<ParsedFinancialStatement>(),
  parsingStatus: varchar('parsing_status', { length: 20 }).default('pending'), // 'pending', 'parsing', 'completed', 'failed'
  parsingError: text('parsing_error'),
  downloadedAt: timestamp('downloaded_at').defaultNow(),
  parsedAt: timestamp('parsed_at')
}, (table) => ({
  krsIdx: index('financial_documents_krs_idx').on(table.companyKrs),
  periodIdx: index('financial_documents_period_idx').on(table.periodTo)
}));

// Wygenerowane analizy
export const financialAnalyses = pgTable('financial_analyses', {
  id: serial('id').primaryKey(),
  companyKrs: varchar('company_krs', { length: 10 })
    .notNull()
    .references(() => companies.krs),
  documentId: integer('document_id')
    .references(() => financialDocuments.id),
  periodYear: integer('period_year').notNull(),
  
  // Obliczone dane finansowe
  ratios: jsonb('ratios').$type<FinancialRatios>(),
  bankruptcyModels: jsonb('bankruptcy_models').$type<BankruptcyModels>(),
  
  // Analiza AI
  userRole: varchar('user_role', { length: 50 }), // 'manager', 'employee', 'competitor', 'supplier', 'client'
  aiPrompt: text('ai_prompt'),
  aiResponse: text('ai_response'),
  aiModel: varchar('ai_model', { length: 100 }),
  aiTokensUsed: integer('ai_tokens_used'),
  
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  krsYearIdx: index('financial_analyses_krs_year_idx').on(table.companyKrs, table.periodYear)
}));

// Definicje typów dla kolumn JSONB
export interface ParsedFinancialStatement {
  balanceSheet: {
    assets: {
      fixedAssets: number;        // Aktywa trwałe
      currentAssets: number;      // Aktywa obrotowe
      inventory: number;          // Zapasy
      receivables: number;        // Należności
      cash: number;               // Środki pieniężne
      totalAssets: number;        // Aktywa razem
    };
    liabilities: {
      equity: number;                  // Kapitał własny
      longTermLiabilities: number;     // Zobowiązania długoterminowe
      shortTermLiabilities: number;    // Zobowiązania krótkoterminowe
      totalLiabilities: number;        // Pasywa razem
    };
  };
  incomeStatement: {
    revenue: number;              // Przychody ze sprzedaży
    operatingCosts: number;       // Koszty działalności operacyjnej
    operatingProfit: number;      // Zysk z działalności operacyjnej
    financialIncome: number;      // Przychody finansowe
    financialCosts: number;       // Koszty finansowe
    grossProfit: number;          // Zysk brutto
    netProfit: number;            // Zysk netto
  };
  cashFlow?: {
    operatingCashFlow: number;    // Przepływy z działalności operacyjnej
    investingCashFlow: number;    // Przepływy z działalności inwestycyjnej
    financingCashFlow: number;    // Przepływy z działalności finansowej
    netCashFlow: number;          // Przepływy pieniężne netto
  };
}

export interface FinancialRatios {
  // Płynność
  currentRatio: number;           // Wskaźnik płynności bieżącej
  quickRatio: number;             // Wskaźnik płynności szybkiej
  cashRatio: number;              // Wskaźnik płynności gotówkowej
  
  // Rentowność
  returnOnAssets: number;         // ROA - Rentowność aktywów
  returnOnEquity: number;         // ROE - Rentowność kapitału własnego
  netProfitMargin: number;        // Rentowność netto sprzedaży
  
  // Zadłużenie
  debtToEquityRatio: number;      // Wskaźnik zadłużenia kapitału własnego
}

export interface BankruptcyModels {
  poznanskiModel: {
    score: number;
    interpretation: 'safe' | 'warning' | 'danger';
    components: Record<string, number>;
  };
  wierzbaModel: {
    score: number;
    interpretation: 'safe' | 'warning' | 'danger';
    components: Record<string, number>;
  };
}
```

### Plik Migracji

Utwórz `drizzle/0002_fincheck_tables.sql`:

```sql
-- Tabela spółek
CREATE TABLE IF NOT EXISTS "companies" (
  "krs" varchar(10) PRIMARY KEY NOT NULL,
  "nip" varchar(10),
  "regon" varchar(14),
  "name" text NOT NULL,
  "legal_form" text,
  "pkd_main" varchar(10),
  "pkd_other" jsonb,
  "address" jsonb,
  "capital" jsonb,
  "management" jsonb,
  "shareholders" jsonb,
  "financial_statements_list" jsonb,
  "raw_krs_data" jsonb,
  "last_fetched_at" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "companies_nip_idx" ON "companies" ("nip");
CREATE INDEX IF NOT EXISTS "companies_name_idx" ON "companies" ("name");

-- Tabela dokumentów finansowych
CREATE TABLE IF NOT EXISTS "financial_documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "company_krs" varchar(10) NOT NULL REFERENCES "companies"("krs"),
  "period_from" date NOT NULL,
  "period_to" date NOT NULL,
  "document_type" varchar(50) NOT NULL,
  "file_format" varchar(10) NOT NULL,
  "file_path" text NOT NULL,
  "file_size" integer,
  "source_url" text,
  "parsed_data" jsonb,
  "parsing_status" varchar(20) DEFAULT 'pending',
  "parsing_error" text,
  "downloaded_at" timestamp DEFAULT now(),
  "parsed_at" timestamp
);

CREATE INDEX IF NOT EXISTS "financial_documents_krs_idx" ON "financial_documents" ("company_krs");
CREATE INDEX IF NOT EXISTS "financial_documents_period_idx" ON "financial_documents" ("period_to");

-- Tabela analiz finansowych
CREATE TABLE IF NOT EXISTS "financial_analyses" (
  "id" serial PRIMARY KEY NOT NULL,
  "company_krs" varchar(10) NOT NULL REFERENCES "companies"("krs"),
  "document_id" integer REFERENCES "financial_documents"("id"),
  "period_year" integer NOT NULL,
  "ratios" jsonb,
  "bankruptcy_models" jsonb,
  "user_role" varchar(50),
  "ai_prompt" text,
  "ai_response" text,
  "ai_model" varchar(100),
  "ai_tokens_used" integer,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "financial_analyses_krs_year_idx" ON "financial_analyses" ("company_krs", "period_year");
```

---

## Struktura Plików

### Nowe Pliki do Utworzenia

```
src/
├── lib/
│   ├── server/
│   │   ├── fincheck/
│   │   │   ├── krs/
│   │   │   │   ├── api.ts              # Klient API KRS
│   │   │   │   ├── types.ts            # Typy odpowiedzi KRS
│   │   │   │   └── cache.ts            # Logika cache'owania w DB
│   │   │   ├── rdf/
│   │   │   │   ├── crawler.ts          # Crawler Playwright
│   │   │   │   ├── downloader.ts       # Logika pobierania plików
│   │   │   │   └── storage.ts          # Lokalne przechowywanie plików
│   │   │   ├── parser/
│   │   │   │   ├── xml-parser.ts       # Parser XML e-sprawozdań
│   │   │   │   ├── extractor.ts        # Pomocnicze funkcje ekstrakcji
│   │   │   │   └── types.ts            # Typy sprawozdań finansowych
│   │   │   ├── analysis/
│   │   │   │   ├── ratios.ts           # 7 wskaźników finansowych
│   │   │   │   ├── bankruptcy.ts       # Modele Poznański i Wierzba
│   │   │   │   └── types.ts            # Typy analiz
│   │   │   └── ai/
│   │   │       ├── openrouter.ts       # Klient OpenRouter
│   │   │       ├── prompts.ts          # Szablony promptów
│   │   │       └── types.ts            # Typy AI
│   │   └── db/
│   │       └── schema.ts               # (aktualizacja istniejącego)
│   └── components/
│       └── fincheck/
│           ├── SearchForm.svelte       # Formularz wyszukiwania KRS
│           ├── CompanyCard.svelte      # Karta informacji o spółce
│           ├── FinancialTable.svelte   # Tabela danych finansowych
│           ├── RatiosChart.svelte      # Wizualizacja wskaźników
│           ├── BankruptcyBadge.svelte  # Znacznik modelu upadłościowego
│           └── AIAnalysis.svelte       # Wyświetlanie odpowiedzi AI
├── routes/
│   └── fincheck/
│       ├── +page.svelte                # Strona wyszukiwania
│       ├── +page.server.ts             # Logika serwerowa wyszukiwania
│       ├── data.remote.ts              # Remote functions
│       └── [krs]/
│           ├── +page.svelte            # Strona szczegółów spółki
│           ├── +page.server.ts         # Logika serwerowa spółki
│           └── data.remote.ts          # Remote functions
└── drizzle/
    └── 0002_fincheck_tables.sql        # Nowa migracja

docs/
└── FINCHECK_IMPLEMENTATION_PLAN.md     # Ten plik

docker-compose.yml                       # (aktualizacja istniejącego)
```

---

## Fazy Implementacji

### Faza 1: Klient API KRS + Podstawowy UI (2-3 dni)

#### Zadania

1. **Aktualizacja schematu bazy danych**
   - Dodaj tabelę `companies` do schema.ts
   - Utwórz plik migracji
   - Uruchom migrację

2. **Klient API KRS** (`src/lib/server/fincheck/krs/`)
   - `types.ts`: Interfejsy TypeScript dla odpowiedzi API KRS
   - `api.ts`: Pobieranie danych spółki z API KRS
   - `cache.ts`: Sprawdzanie cache w DB, odświeżanie jeśli stare (24h)

3. **UI wyszukiwania** (`src/routes/fincheck/`)
   - `+page.svelte`: Formularz wyszukiwania z polem KRS
   - `+page.server.ts`: Akcja wyszukiwania
   - `data.remote.ts`: Remote function dla wyszukiwania

4. **Strona szczegółów spółki** (`src/routes/fincheck/[krs]/`)
   - `+page.svelte`: Wyświetlanie informacji o spółce
   - `+page.server.ts`: Ładowanie danych spółki

5. **Komponenty**
   - `SearchForm.svelte`: Pole KRS + przycisk wyszukiwania
   - `CompanyCard.svelte`: Wyświetlanie informacji o spółce

#### Szczegóły API KRS

**Endpointy:**
```
GET https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/{krs}?rejestr=P&format=json
GET https://api-krs.ms.gov.pl/api/krs/OdpisPelny/{krs}?rejestr=P&format=json
```

**Struktura odpowiedzi (uproszczona):**
```json
{
  "odppisCurrent": {
    "root": {
      "podmiot1": {
        "danePodmiotu": {
          "nazwa": "NAZWA SPÓŁKI",
          "nip": "1234567890",
          "regon": "12345678901234"
        },
        "siedzibaIAdres": {
          "siedzibaKraj": "POLSKA",
          "siedzibaWojewodztwo": "...",
          "siedzibaGmina": "...",
          "siedzibaUlica": "...",
          "siedzibaNrDomu": "...",
          "siedzibaKodPocztowy": "...",
          "siedzibaMiejscowosc": "..."
        },
        "dzial1": {
          "przedmiotDzialalnosci": {
            "przedmiotPrzewazajacejDzialalnosci": [
              { "kodPKD": "62.01.Z", "opis": "..." }
            ]
          },
          "kapital": {
            "wysokoscKapitaluZakladowego": {
              "wysokoscKwotowa": 5000.00
            }
          }
        },
        "dzial2": {
          "organ": {
            "nazwaOrganu": "ZARZĄD",
            "sklad": {
              "sklad1": [
                {
                  "nazwisko": "...",
                  "imiona": "...",
                  "funkcja": "PREZES ZARZĄDU"
                }
              ]
            }
          }
        }
      },
      "naglowekA": {
        "numerKRS": "0000123456",
        "dataCzasOdpisu": "2024-01-15T10:30:00"
      }
    }
  }
}
```

#### Kryteria Akceptacji

- [ ] Użytkownik może wpisać numer KRS na `/fincheck`
- [ ] Dane spółki są pobierane i wyświetlane na `/fincheck/[krs]`
- [ ] Dane są cache'owane w PostgreSQL
- [ ] Stare dane (>24h) wyzwalają ponowne pobranie
- [ ] Obsługa błędów dla nieprawidłowego KRS

---

### Faza 2: Crawler Playwright dla ekrs.ms.gov.pl (3-4 dni)

#### Zadania

1. **Konfiguracja Docker**
   - Dodaj serwis Playwright do docker-compose.yml
   - Utwórz Dockerfile.playwright

2. **Implementacja crawlera** (`src/lib/server/fincheck/rdf/`)
   - `crawler.ts`: Nawigacja po ekrs.ms.gov.pl, znajdowanie dokumentów
   - `downloader.ts`: Pobieranie plików XML/PDF
   - `storage.ts`: Zapis do lokalnego systemu plików

3. **Aktualizacja bazy danych**
   - Dodaj tabelę `financialDocuments`
   - Utwórz migrację

4. **Zadanie w tle (proste)**
   - Mechanizm pollingu do sprawdzania oczekujących pobrań
   - Przetwarzanie kolejki w tym samym procesie Node.js

#### Logika Crawlera

```typescript
// Pseudokod dla crawler.ts
async function crawlFinancialDocuments(krs: string) {
  const browser = await playwright.chromium.connect(PLAYWRIGHT_URL);
  const page = await browser.newPage();
  
  // Nawiguj do portalu RDF
  await page.goto('https://ekrs.ms.gov.pl/rdf/pd/search_df');
  
  // Wypełnij formularz wyszukiwania KRS (JSF/PrimeFaces)
  await page.fill('input[id*="nrKrs"]', krs);
  await page.click('button[id*="szukaj"]');
  
  // Poczekaj na wyniki
  await page.waitForSelector('.ui-datatable-data');
  
  // Wyodrębnij linki do dokumentów
  const documents = await page.$$eval('table tbody tr', rows => {
    return rows.map(row => ({
      period: row.querySelector('td:nth-child(1)')?.textContent,
      type: row.querySelector('td:nth-child(2)')?.textContent,
      downloadUrl: row.querySelector('a[href*="download"]')?.getAttribute('href')
    }));
  });
  
  await browser.close();
  return documents;
}
```

#### Kryteria Akceptacji

- [ ] Kontener Playwright uruchamia się z docker-compose
- [ ] Crawler nawiguje po ekrs.ms.gov.pl poprawnie
- [ ] Dokumenty finansowe są identyfikowane i pobierane
- [ ] Pliki przechowywane w `/data/financial-documents/{krs}/`
- [ ] Metadane dokumentów zapisane w DB

---

### Faza 3: Parser XML + Obliczenia Finansowe (3-4 dni)

#### Zadania

1. **Parser XML** (`src/lib/server/fincheck/parser/`)
   - `xml-parser.ts`: Parsowanie struktury XML e-sprawozdania
   - `extractor.ts`: Ekstrakcja bilansu, rachunku zysków i strat, cash flow
   - Mapowanie taksonomii XML na nasz model danych

2. **Wskaźniki Finansowe** (`src/lib/server/fincheck/analysis/`)
   - `ratios.ts`: Obliczanie 7 wskaźników

3. **Modele Upadłościowe**
   - `bankruptcy.ts`: Model Poznański, Model Wierzby

4. **Komponenty UI**
   - `FinancialTable.svelte`: Wyświetlanie sparsowanych danych
   - `RatiosChart.svelte`: Wizualizacja wskaźników
   - `BankruptcyBadge.svelte`: Wskaźnik ryzyka

#### Struktura XML (e-sprawozdanie)

E-sprawozdania używają taksonomii podobnej do XBRL. Kluczowe elementy:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<JednostkaInna xmlns="...">
  <Naglowek>
    <KRS>0000123456</KRS>
    <NIP>1234567890</NIP>
    <OkresOd>2023-01-01</OkresOd>
    <OkresDo>2023-12-31</OkresDo>
  </Naglowek>
  
  <Bilans>
    <Aktywa>
      <AktywaTrwale>1000000.00</AktywaTrwale>
      <AktywaObrotowe>
        <Zapasy>200000.00</Zapasy>
        <Naleznosci>300000.00</Naleznosci>
        <SrodkiPieniezne>100000.00</SrodkiPieniezne>
      </AktywaObrotowe>
    </Aktywa>
    <Pasywa>
      <KapitalWlasny>800000.00</KapitalWlasny>
      <ZobowiazaniaDlugoterminowe>300000.00</ZobowiazaniaDlugoterminowe>
      <ZobowiazaniaKrotkoterminowe>500000.00</ZobowiazaniaKrotkoterminowe>
    </Pasywa>
  </Bilans>
  
  <RachunekZyskówIStrat>
    <PrzychodyZeSprzedazy>5000000.00</PrzychodyZeSprzedazy>
    <KosztyDzialalnosciOperacyjnej>4500000.00</KosztyDzialalnosciOperacyjnej>
    <ZyskBrutto>400000.00</ZyskBrutto>
    <ZyskNetto>320000.00</ZyskNetto>
  </RachunekZyskówIStrat>
</JednostkaInna>
```

#### Kryteria Akceptacji

- [ ] Pliki XML parsowane poprawnie
- [ ] Dane bilansu wyodrębnione
- [ ] Dane rachunku zysków i strat wyodrębnione
- [ ] 7 wskaźników finansowych obliczonych
- [ ] 2 modele upadłościowe obliczone
- [ ] Wyniki wyświetlane w UI z wykresami

---

### Faza 4: Integracja AI (2-3 dni)

#### Zadania

1. **Klient OpenRouter** (`src/lib/server/fincheck/ai/`)
   - `openrouter.ts`: Klient API dla OpenRouter
   - Obsługa rate limitingu, ponawiania

2. **Szablony Promptów** 
   - `prompts.ts`: Szablon bazowy + warianty dla różnych ról

3. **UI**
   - `AIAnalysis.svelte`: Wyświetlanie odpowiedzi AI
   - Selektor roli (menedżer, pracownik, konkurent, dostawca, klient)

4. **Baza Danych**
   - Przechowywanie promptów i odpowiedzi w `financialAnalyses`

#### Konfiguracja OpenRouter

```typescript
// Darmowe modele do developmentu
const FREE_MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

// Endpoint API
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
```

#### Struktura Szablonu Promptu

```typescript
const basePrompt = `
Jesteś ekspertem finansowym analizującym polskie spółki.

## Dane spółki
Nazwa: {companyName}
KRS: {krs}
NIP: {nip}
Branża (PKD): {pkdMain}

## Dane finansowe za rok {year}
### Bilans
- Aktywa trwałe: {fixedAssets} PLN
- Aktywa obrotowe: {currentAssets} PLN
- Kapitał własny: {equity} PLN
- Zobowiązania długoterminowe: {longTermLiabilities} PLN
- Zobowiązania krótkoterminowe: {shortTermLiabilities} PLN

### Rachunek zysków i strat
- Przychody: {revenue} PLN
- Koszty operacyjne: {operatingCosts} PLN
- Zysk netto: {netProfit} PLN

### Wskaźniki finansowe
- Płynność bieżąca: {currentRatio}
- Płynność szybka: {quickRatio}
- ROA: {roa}%
- ROE: {roe}%
- Rentowność netto: {netMargin}%
- Zadłużenie kapitału własnego: {debtToEquity}%

### Modele upadłościowe
- Model Poznański: {poznanskiScore} ({poznanskiInterpretation})
- Model Wierzby: {wierzbaScore} ({wierzbaInterpretation})

## Twoja rola
{roleDescription}

## Zadanie
Przygotuj szczegółową analizę finansową spółki z perspektywy {role}.
Uwzględnij mocne strony, słabe strony, szanse i zagrożenia.
Sformułuj konkretne rekomendacje.
`;

const roleDescriptions = {
  manager: 'Jesteś menedżerem rozważającym zatrudnienie w tej spółce. Interesuje Cię stabilność finansowa, perspektywy rozwoju i bezpieczeństwo zatrudnienia.',
  employee: 'Jesteś pracownikiem tej spółki. Interesuje Cię czy firma jest stabilna i czy jest ryzyko zwolnień.',
  competitor: 'Jesteś konkurentem na tym samym rynku. Interesują Cię słabe punkty spółki i możliwości przejęcia jej klientów.',
  supplier: 'Jesteś potencjalnym dostawcą. Interesuje Cię zdolność płatnicza spółki i ryzyko opóźnień w płatnościach.',
  client: 'Jesteś potencjalnym klientem. Interesuje Cię czy spółka jest wiarygodna i czy będzie istnieć w przyszłości.'
};
```

#### Kryteria Akceptacji

- [ ] Integracja API OpenRouter działa
- [ ] Selektor roli w UI
- [ ] Analiza AI generowana i wyświetlana
- [ ] Analiza cache'owana w bazie danych
- [ ] Stan ładowania i obsługa błędów

---

## Interfejsy TypeScript

### Typy KRS (`src/lib/server/fincheck/krs/types.ts`)

```typescript
export interface KrsApiResponse {
  odppisCurrent: {
    root: KrsRoot;
  };
}

export interface KrsRoot {
  naglowekA: {
    numerKRS: string;
    dataCzasOdpisu: string;
  };
  podmiot1: KrsPodmiot;
}

export interface KrsPodmiot {
  danePodmiotu: {
    nazwa: string;
    nip?: string;
    regon?: string;
    formaOrganu?: string;
  };
  siedzibaIAdres: KrsAddress;
  dzial1: KrsDzial1;
  dzial2?: KrsDzial2;
}

export interface KrsAddress {
  siedzibaKraj: string;
  siedzibaWojewodztwo: string;
  siedzibaGmina: string;
  siedzibaUlica?: string;
  siedzibaNrDomu?: string;
  siedzibaKodPocztowy: string;
  siedzibaMiejscowosc: string;
}

export interface KrsDzial1 {
  przedmiotDzialalnosci?: {
    przedmiotPrzewazajacejDzialalnosci: Array<{
      kodPKD: string;
      opis: string;
    }>;
    przedmiotPozostalej?: Array<{
      kodPKD: string;
      opis: string;
    }>;
  };
  kapital?: {
    wysokoscKapitaluZakladowego?: {
      wysokoscKwotowa: number;
    };
  };
}

export interface KrsDzial2 {
  organ?: KrsOrgan | KrsOrgan[];
}

export interface KrsOrgan {
  nazwaOrganu: string;
  sklad?: {
    sklad1?: Array<{
      nazwisko: string;
      imiona: string;
      funkcja?: string;
    }>;
  };
}

// Znormalizowane dane spółki
export interface Company {
  krs: string;
  nip: string | null;
  regon: string | null;
  name: string;
  legalForm: string | null;
  pkdMain: string | null;
  pkdOther: string[];
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  capital: {
    initial: number;
    current: number;
    currency: string;
  } | null;
  management: Array<{
    name: string;
    role: string;
    since?: string;
  }>;
  shareholders: Array<{
    name: string;
    shares?: number;
    percentage?: number;
  }>;
}
```

### Typy Analiz (`src/lib/server/fincheck/analysis/types.ts`)

```typescript
export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface FinancialRatios {
  currentRatio: number;        // Wskaźnik płynności bieżącej
  quickRatio: number;          // Wskaźnik płynności szybkiej
  cashRatio: number;           // Wskaźnik płynności gotówkowej
  returnOnAssets: number;      // ROA
  returnOnEquity: number;      // ROE
  netProfitMargin: number;     // Rentowność netto sprzedaży
  debtToEquityRatio: number;   // Wskaźnik zadłużenia kapitału własnego
}

export interface BankruptcyModel {
  score: number;
  interpretation: RiskLevel;
  components: Record<string, number>;
}

export interface BankruptcyModels {
  poznanskiModel: BankruptcyModel;
  wierzbaModel: BankruptcyModel;
}

export interface FinancialAnalysisResult {
  ratios: FinancialRatios;
  bankruptcyModels: BankruptcyModels;
  aiAnalysis?: {
    role: UserRole;
    content: string;
    model: string;
    generatedAt: Date;
  };
}

export type UserRole = 'manager' | 'employee' | 'competitor' | 'supplier' | 'client';
```

---

## Konfiguracja Docker

### Zaktualizowany docker-compose.yml

Dodaj serwis Playwright:

```yaml
services:
  # ... istniejące serwisy ...
  
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    platform: ${DOCKER_DEFAULT_PLATFORM}
    restart: unless-stopped
    command: ["npx", "playwright", "run-server", "--port=3000"]
    ports:
      - "3001:3000"
    networks:
      - app-network
    # Współdzielony wolumen dla pobranych plików
    volumes:
      - financial_documents:/data/financial-documents
  
  app:
    # ... istniejąca konfiguracja ...
    environment:
      # ... istniejące zmienne ...
      - PLAYWRIGHT_URL=ws://playwright:3000
    volumes:
      # ... istniejące wolumeny ...
      - financial_documents:/data/financial-documents
    depends_on:
      - db
      - playwright

volumes:
  # ... istniejące wolumeny ...
  financial_documents:
```

---

## Zmienne Środowiskowe

### Wymagane Zmienne

Dodaj do `.env` (i udokumentuj w `.env.example`):

```bash
# Istniejące
DATABASE_URL=postgres://admin:devpassword123@db:5432/local

# Nowe dla FinCheck
PLAYWRIGHT_URL=ws://playwright:3000
OPENROUTER_API_KEY=sk-or-v1-twój-klucz-tutaj

# Opcjonalne
KRS_API_CACHE_TTL_HOURS=24
FINANCIAL_DOCUMENTS_PATH=/data/financial-documents
```

---

## Endpointy API

### Remote Functions (`data.remote.ts`)

```typescript
// src/routes/fincheck/data.remote.ts
import { query, command } from '$app/server';
import * as v from 'valibot';

// Wyszukaj/pobierz spółkę po KRS
export const getCompany = query(
  v.pipe(v.string(), v.regex(/^\d{10}$/)),
  async (krs) => {
    // Sprawdź cache, pobierz z API jeśli trzeba
  }
);

// Pobierz dokumenty finansowe dla spółki
export const getFinancialDocuments = query(
  v.pipe(v.string(), v.regex(/^\d{10}$/)),
  async (krs) => {
    // Zwróć listę dostępnych dokumentów
  }
);

// Wyzwól pobranie dokumentu
export const downloadDocument = command(
  v.object({
    krs: v.pipe(v.string(), v.regex(/^\d{10}$/)),
    period: v.string()
  }),
  async ({ krs, period }) => {
    // Dodaj dokument do kolejki pobierania
  }
);

// Pobierz analizę finansową
export const getAnalysis = query(
  v.object({
    krs: v.pipe(v.string(), v.regex(/^\d{10}$/)),
    year: v.number()
  }),
  async ({ krs, year }) => {
    // Zwróć obliczone wskaźniki i modele
  }
);

// Wygeneruj analizę AI
export const generateAIAnalysis = command(
  v.object({
    krs: v.pipe(v.string(), v.regex(/^\d{10}$/)),
    year: v.number(),
    role: v.picklist(['manager', 'employee', 'competitor', 'supplier', 'client'])
  }),
  async ({ krs, year, role }) => {
    // Wygeneruj i zwróć analizę AI
  }
);
```

---

## Obliczenia Finansowe

### 7 Wskaźników Finansowych

```typescript
// src/lib/server/fincheck/analysis/ratios.ts

export function calculateRatios(data: ParsedFinancialStatement): FinancialRatios {
  const { balanceSheet, incomeStatement } = data;
  
  return {
    // 1. Wskaźnik płynności bieżącej (Current Ratio)
    // Aktywa obrotowe / Zobowiązania krótkoterminowe
    currentRatio: balanceSheet.assets.currentAssets / balanceSheet.liabilities.shortTermLiabilities,
    
    // 2. Wskaźnik płynności szybkiej (Quick Ratio)
    // (Aktywa obrotowe - Zapasy) / Zobowiązania krótkoterminowe
    quickRatio: (balanceSheet.assets.currentAssets - balanceSheet.assets.inventory) / 
                balanceSheet.liabilities.shortTermLiabilities,
    
    // 3. Wskaźnik płynności gotówkowej (Cash Ratio)
    // Środki pieniężne / Zobowiązania krótkoterminowe
    cashRatio: balanceSheet.assets.cash / balanceSheet.liabilities.shortTermLiabilities,
    
    // 4. ROA - Rentowność aktywów
    // Zysk netto / Aktywa ogółem * 100
    returnOnAssets: (incomeStatement.netProfit / balanceSheet.assets.totalAssets) * 100,
    
    // 5. ROE - Rentowność kapitału własnego
    // Zysk netto / Kapitał własny * 100
    returnOnEquity: (incomeStatement.netProfit / balanceSheet.liabilities.equity) * 100,
    
    // 6. Rentowność netto sprzedaży (Net Profit Margin)
    // Zysk netto / Przychody * 100
    netProfitMargin: (incomeStatement.netProfit / incomeStatement.revenue) * 100,
    
    // 7. Wskaźnik zadłużenia kapitału własnego (Debt to Equity)
    // Zobowiązania ogółem / Kapitał własny * 100
    debtToEquityRatio: ((balanceSheet.liabilities.longTermLiabilities + 
                         balanceSheet.liabilities.shortTermLiabilities) / 
                        balanceSheet.liabilities.equity) * 100
  };
}
```

### Modele Upadłościowe

```typescript
// src/lib/server/fincheck/analysis/bankruptcy.ts

// Model Poznański (dyskryminacyjny model Poznański)
export function calculatePoznanskiModel(data: ParsedFinancialStatement): BankruptcyModel {
  const { balanceSheet: bs, incomeStatement: is } = data;
  
  // X1 = Zysk netto / Aktywa
  const x1 = is.netProfit / bs.assets.totalAssets;
  
  // X2 = (Aktywa obrotowe - Zapasy) / Zobowiązania krótkoterminowe  
  const x2 = (bs.assets.currentAssets - bs.assets.inventory) / bs.liabilities.shortTermLiabilities;
  
  // X3 = Kapitał stały / Aktywa (Kapitał stały = Kapitał własny + Zobowiązania długoterminowe)
  const x3 = (bs.liabilities.equity + bs.liabilities.longTermLiabilities) / bs.assets.totalAssets;
  
  // X4 = Zysk brutto ze sprzedaży / Przychody
  const x4 = is.grossProfit / is.revenue;
  
  // Z = 3.562 * X1 + 1.588 * X2 + 4.288 * X3 + 6.719 * X4 - 2.368
  const score = 3.562 * x1 + 1.588 * x2 + 4.288 * x3 + 6.719 * x4 - 2.368;
  
  return {
    score: Math.round(score * 1000) / 1000,
    interpretation: score > 0 ? 'safe' : score > -0.5 ? 'warning' : 'danger',
    components: { x1, x2, x3, x4 }
  };
}

// Model Wierzby (dyskryminacyjny model Wierzby)
export function calculateWierzbaModel(data: ParsedFinancialStatement): BankruptcyModel {
  const { balanceSheet: bs, incomeStatement: is, cashFlow } = data;
  
  // X1 = (Aktywa obrotowe - Zapasy) / Zobowiązania krótkoterminowe
  const x1 = (bs.assets.currentAssets - bs.assets.inventory) / bs.liabilities.shortTermLiabilities;
  
  // X2 = Zysk z działalności operacyjnej / Przychody
  const x2 = is.operatingProfit / is.revenue;
  
  // X3 = Przepływy operacyjne / Zobowiązania (jeśli cash flow dostępny)
  const x3 = cashFlow ? cashFlow.operatingCashFlow / bs.liabilities.totalLiabilities : 0;
  
  // X4 = Kapitał własny / Aktywa
  const x4 = bs.liabilities.equity / bs.assets.totalAssets;
  
  // Z = 3.26 * X1 + 2.16 * X2 + 1.63 * X3 + 3.28 * X4 - 1.53
  const score = 3.26 * x1 + 2.16 * x2 + 1.63 * x3 + 3.28 * x4 - 1.53;
  
  return {
    score: Math.round(score * 1000) / 1000,
    interpretation: score > 0 ? 'safe' : score > -0.5 ? 'warning' : 'danger',
    components: { x1, x2, x3, x4 }
  };
}
```

---

## Strategia Testowania

### Testy Jednostkowe

- Parsowanie odpowiedzi API KRS
- Obliczenia wskaźników finansowych
- Obliczenia modeli upadłościowych
- Parsowanie XML

### Testy Integracyjne

- Klient API KRS (z mockowanymi odpowiedziami)
- Operacje bazodanowe
- API OpenRouter (z mockowanymi odpowiedziami)

### Testy E2E

- Przepływ wyszukiwania: wpisz KRS → zobacz spółkę
- Przepływ analizy: spółka → dokumenty → wskaźniki → AI

---

## Mitygacja Ryzyk

| Ryzyko | Mitygacja |
|--------|-----------|
| ekrs.ms.gov.pl blokuje crawlera | Implementuj rate limiting, losowe opóźnienia, rotację user-agent |
| Zmiana struktury XML | Elastyczny parser z fallbackiem do wyświetlania surowych danych |
| API OpenRouter niedostępne | Cache'uj odpowiedzi AI, pokazuj "niedostępne" gracefully |
| Duże pliki | Streaming download, limity rozmiaru, obsługa timeoutów |
| Nieprawidłowe numery KRS | Walidacja wejścia z regex, jasne komunikaty błędów |

---

## Szacowany Harmonogram

| Faza | Czas trwania | Zależności |
|------|--------------|------------|
| Faza 1: API KRS + UI | 2-3 dni | Brak |
| Faza 2: Crawler Playwright | 3-4 dni | Faza 1 |
| Faza 3: Parser XML + Wskaźniki | 3-4 dni | Faza 2 |
| Faza 4: Integracja AI | 2-3 dni | Faza 3 |
| **Razem MVP** | **10-14 dni** | |

---

## Kolejne Kroki Po MVP

1. **Konta użytkowników** - Dashboard z zapisanymi spółkami
2. **Integracja płatności** - Stripe PL dla subskrypcji
3. **Parsowanie PDF** - Obsługa starszych sprawozdań finansowych
4. **Eksport PDF** - Generowanie profesjonalnych raportów
5. **Wdrożenie na Hetzner** - Konfiguracja produkcyjnego VPS
6. **Monitoring** - Śledzenie błędów, analityka
