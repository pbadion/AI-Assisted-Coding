# Bethany's Pie Shop — Architecture

## High-level system

```mermaid
flowchart TB
    subgraph Client["Browser (port 3000)"]
        UI[React App]
        LS[localStorage]
        UI <--> LS
    end

    subgraph Dev["Vite Dev Server"]
        Proxy["/api proxy → :4000"]
    end

    subgraph Backend["Express API (port 4000)"]
        App[app.js]
        Routes[routes/api.js]
        Pies[models/pies.js]
        App --> Routes
        Routes --> Pies
    end

    UI -->|GET /api/*| Proxy
    Proxy --> App
```

## Request flow (data path)

```mermaid
sequenceDiagram
    participant User
    participant React
    participant Vite
    participant Express
    participant Pies

    User->>React: Navigate / fruit
    React->>React: usePies("fruit")
    React->>Vite: GET /api/pies?category=fruit
    Vite->>Express: proxy
    Express->>Pies: filter by category
    Pies-->>Express: pies[]
    Express-->>Vite: JSON
    Vite-->>React: JSON
    React->>User: Render CategoryPage
```

## Frontend structure

```mermaid
flowchart LR
    subgraph Entry
        Index[index.tsx]
        App[App.tsx]
        Index --> App
    end

    subgraph Providers
        CartProvider[CartProvider]
        Router[Router]
        App --> CartProvider
        CartProvider --> Router
    end

    subgraph Layout
        Header[Header]
        Footer[Footer]
        Router --> Header
        Router --> Footer
    end

    subgraph Routes
        Home[HomePage /]
        Category[CategoryPage /:category]
        Cart[CartPage /cart]
        Checkout[CheckoutPage /checkout]
        Success[CheckoutSuccessPage]
        Router --> Home
        Router --> Category
        Router --> Cart
        Router --> Checkout
        Router --> Success
    end

    subgraph Data
        pieService[pieService]
        useCart[useCart]
        usePies[usePies]
        CartContext[CartContext]
        useCart --> CartContext
    end

    Home --> usePies
    Home --> useCart
    Category --> usePies
    Category --> useCart
    Cart --> useCart
    Checkout --> useCart
    usePies --> pieService
    pieService -->|fetch| API["/api"]
```

## Backend structure

```mermaid
flowchart TB
    server[server.js] --> app[app.js]

    app --> security[middleware/security]
    app --> api["/api routes"]
    app --> static["static (public)"]
    app --> fallback["SPA fallback"]

    api --> getPies["GET /pies"]
    api --> getMonthly["GET /pies-of-the-month"]
    api --> getById["GET /pies/:id"]

    getPies --> piesModel[models/pies.js]
    getMonthly --> piesHelper[utils/piesHelper.js]
    getById --> piesModel
    piesHelper --> piesModel
```

## Cart and checkout flow

```mermaid
flowchart LR
    subgraph Cart
        CartContext[CartContext]
        useCart[useCart]
        cartStorage[cartStorage]
        CartContext --> useCart
        useCart --> cartStorage
        cartStorage --> localStorage[localStorage]
    end

    subgraph Checkout
        CheckoutPage[CheckoutPage]
        CheckoutPage -->|validate + submit| Simulate[Simulated order]
        Simulate --> Success[CheckoutSuccessPage]
    end

    Cart --> Checkout
```

---

_Generated for onboarding. See README.md for setup and scripts._
