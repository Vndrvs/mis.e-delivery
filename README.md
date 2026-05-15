# Projekt Dokumentáció: mis.e-delivery

## 1. Rövid Intro

A 'Mis.e Delivery' egy japán ételrendelő és kiszállító alkalmazás concept verziója, UX fájltól éles weboldalig megvalósítva, bejárva a teljes design engineering ívet.
Az oldal célja, hogy a felhasználók intuitívan és fennakadások nélkül böngészhessék az étlapot, adhassanak le rendelést és bejelentkezve olyan kényelmi funckiókat használhassanak, mint a kiszállítási címek mentése és a rendeléstörténet megtekintése.

### Elérhetőségek:
- **UI/UX Prototípus (Figma):** [Figma designfájl linke](https://www.figma.com/design/VmZB74MRw283jmyFXRRZN4/mis.e?node-id=351-1119&t=XkaFxOUHrh3DAZKW-1)
- **Webalkalmazás felülete:** [A Mis.e rendelési portálja](https://mis-e-delivery.onrender.com/)
- **Backend / Admin Panel (CMS):** [A Strapi admin panelje](https://46-101-159-56.nip.io/admin/auth/login)
- **Backend Github Repo:** [Github Link](https://github.com/Vndrvs/multisite-cms)

--- 
## 2. Felépítés és Stack

Szétválasztott architektúra, amely tartalmaz egy frontend és egy backend réteget.

### Frontend:
**Setup:** Render.com (Jelenleg statikus / SSR disabled)
**Framework:**  Vue.js 3 / Nuxt 4 (TypeScript alapon)
**Stílus:** Mobile-first, Tailwind CSS-el írva
**State Management:** Pinia (stores/cart.ts a kosár kezelésére)
**Többnyelvűség:** Nuxt i18n modul (Jelenleg angol és magyar nyelven szolgál ki)
**Animációk:** GSAP, Embla Carousel

### Backend:
**Setup:** DigitalOcean 2GB RAM Ubuntu VM Droplet
**Környezet:** Node.js
**Framework:** Strapi v5 (Headless CMS)
**Authentikáció:** Strapi JWT (JSON Web Token) alapú hitelesítés

### Adatbázis:
**Típus:** PostgreSQL relációs adatbázis
**Szolgáltató:** Supabase (Amazon S3 tárhely a médiafájlokhoz)

--- 
## 3. Kiegészítő Funkciók Megvalósítása

A projekt az alapkövetelményeken felül az alábbi extra funkciókat integrálja:

1. **Autentikáció (JWT):** A felhasználók regisztrálhatnak és bejelentkezhetnek az alkalmazásba. A folyamat biztonságát a backend által generált JWT tokenek biztosítják.

2. **Cloud Szolgáltatások:**
 - A Frontend a **Render.com** platformján fut
 - A Backend egy **DigitalOcean** Ubuntu VM Droplet-en (2GB RAM) kapott helyet
 -Az adatbázist a **Supabase** (PostgreSQL) szolgáltatja

3. **CI/CD Integráció:** A projekt verziókövetése GitHubon történik, ahol GitHub Actions/ .yaml fájlok biztosítják a folyamatos integrációt és a deployt.

--- 
## 4. Telepítési és Konfigurációs Útmutató

A projekt helyi fejlesztői környezetben történő futtatásához az alábbi lépések szükségesek.

### Előfeltételek:
-   Node.js (v18+)
-   Git verziókezelő

### Frontend telepítése:

1.  A repository klónozása:
```
git clone https://github.com/Vndrvs/mis.e-delivery.git
cd mis.e-delivery/frontend
```
2.  Függőségek telepítése:
```
npm install
```
3.  Környezeti változók beállítása: Hozzon létre egy `.env` fájlt a `frontend` mappában, és adja meg a backend elérését:
```
STRAPI_URL=https://46-101-159-56.nip.io
```
4.  Fejlesztői szerver indítása:
```
npm run dev
```
-> Az alkalmazás elérhető lesz a `http://localhost:3000` címen.
    
### Tesztek futtatása:

A projekt Vitest keretrendszert használ a komponens- és állapottesztekhez (pl. `Productcard.test.ts`, `cart.test.ts`). Tesztek indítása:
```
npm run test
```

---
## 5. API végpontok 

A backend REST API architektúrát használ, amely szabványos HTTP metódusokkal kommunikál a klienssel. A bejövő adatokat a Strapi validálja, a válaszok szabványos JSON formátumúak, megfelelő HTTP státuszkódokkal.

 **1. Termékek lekérése (Menu) **
-   **Végpont:** `GET /api/products`
-   **Leírás:** Visszaadja a rendszerben elérhető ételek és promóciók listáját. A kérés paraméterezhető szűrésre és lapozásra.

**2. Autentikáció: Regisztráció**
-   **Végpont:** `POST /api/auth/local/register`
-   **Leírás:** Új felhasználói fiók létrehozása. Sikeres hívás esetén bejelentkezteti a felhasználót és JWT tokent ad vissza. A rendszer beépített hibakezeléssel ellenőrzi a foglalt email címeket (pl. "already taken" hiba).
-   **Bemenet (Body):**
```
{
  "username": "user@example.com",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

 **3. Autentikáció: Bejelentkezés **
-   **Végpont:** `POST /api/auth/local`
-   **Leírás:** A felhasználó hitelesítése regisztrált email/jelszó párossal. Sikeres bejelentkezés esetén JWT tokent ad vissza.
-   **Bemenet (Body):**
```
{
  "identifier": "user@example.com",
  "password": "securepassword123"
}
```

**4. Felhasználói adatok és Címek lekérése**
-   **Végpont:** `GET /api/users/me`
-   **Leírás:** A bejelentkezett felhasználó adatainak lekérése. A kliens az URL-ben a `?populate=addresses` paraméter használatával relációs lekérdezést indít, így a profilhoz tartozó, elmentett szállítási címeket is egyben kapja meg.
-   **Hitelesítés:** JWT Token kötelező
    
**5. Cím törlése**
-   **Végpont:** `DELETE /api/addresses/:documentId`
-   **Leírás:** Egy elmentett szállítási cím törlése a felhasználó profiljából a cím egyedi azonosítója (Strapi documentId) alapján.
-   **Hitelesítés:** JWT Token kötelező
    
**6. Rendelés leadása (Checkout)**
-   **Végpont:** `POST /api/restaurant-orders`
-   **Leírás:** Új rendelés rögzítése a rendszerben. A végpont hibrid módon működik: bejelentkezés nélkül (vendégként) is használható, ekkor nem igényel JWT tokent. Bejelentkezett felhasználó esetén a kliens a payloadhoz csatolja a felhasználó azonosítóját (`user: documentId`), így relációs kapcsolatot hozva létre a rendelés és a profil között.
-   **Bemenet (Body):**
```
{
  "data": {
    "customer_name": "Kovács János",
    "customer_email": "janos@example.com",
    "total": 8000,
    "order_status": "pending",
    "shipping_address": {
      "first_name": "János",
      "last_name": "Kovács",
      "email": "janos@example.com",
      "phone": "+36301234567",
      "zip": "1055",
      "city": "Budapest",
      "street": "Példa utca 1.",
      "floor_door": "2. emelet 4.",
      "courier_note": "A kapucsengő rossz."
    },
    "order_items": [
      {
        "product_name": "Sushi Tál",
        "quantity": 2,
        "price": 4000
      }
    ],
    "user": "a1b2c3d4e5f6g7h8i9j0" 
  }
}
```
_(Megjegyzés: A "user" kulcs csak bejelentkezést követő megrendelés esetén kerül a payloadba)_

**7. Rendelési előzmények lekérése**
-   **Végpont:** `GET /api/restaurant-orders`
-   **Leírás:** A bejelentkezett felhasználó korábbi rendeléseinek lekérése. A kliens az URL-ben szűrőket alkalmaz (`?filters[user][id][$eq]=userId`), így csak a saját rendelés kerülnek visszaadásra. A lekérdezés a `populate` paraméterrel betölti a megrendelt tételeket és a szállítási címet is, időben csökkenő sorrendbe rendezve (`sort[0]=createdAt:desc`).
-   **Hitelesítés:** JWT Token kötelező