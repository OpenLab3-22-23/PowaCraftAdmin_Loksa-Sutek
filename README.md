# Template pre AppsLab projekt
## Vite + React + Typescript + Supabase + Tailwind

### Začíname

```
git clone https://github.com/OpenLab3-22-23/project-template.git
```

```
npm i
```

Predtým než spustíme aplikáciu, vytvorime si nový projekt na [Supabase](https://app.supabase.com/)

Po vytvorení vykonáme nasledujúce kroky pre migráciu databázy

1. V novom projekte otvoríme **SQL Editor**
2. Klikneme na tlačítko **User Management Starter**
3. Klikneme na **Run**

Na to, aby sme vo svojom projekte mohli použiť našu Supabase inštanciu, potrebujeme získať prístup pomocou API kľúčov

1. Chodte do **Settings**
2. Kliknite na **API** v postrannom okne
3. Získajte svoju **URL** a **anon**
4. V root adresári vo Vašom projekte vytvorte súbor *.env* ktorý bude vyzerať následovne:
    ```
    VITE_SUPA_KEY=XXXX
    VITE_SUPA_URL=XXXX
    ```
    Kde za *_KEY=* vložíte svoj **anon** a za *_URL=* svoju **URL**

Teraz už len spustíte svoju appku pomocou

`npm run dev`