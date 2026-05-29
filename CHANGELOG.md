# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased] — 2026-05-29

### Agregado

- **Guest checkout**: los usuarios sin cuenta pueden completar una compra ingresando nombre, apellido y email directamente en el formulario de checkout. Se llama al nuevo endpoint `POST /api/v1/checkout/guest` y se redirige a la página de confirmación con `orderId` y `trackingToken`.
- **Página de confirmación de compra** (`/checkout/success`): se muestra resumen del pedido tras finalizar el checkout (tanto para usuarios registrados como invitados).
- **Página de seguimiento de pedido** (`/track/[orderId]`): permite rastrear el estado de un pedido usando el `trackingToken` generado, sin necesidad de iniciar sesión.
- **Componente `SearchBar`**: barra de búsqueda reutilizable integrada en la home.
- **Componente `Badge`**: chip de estado reutilizable para mostrar el estado de pedidos y envíos.
- **Componente `ProductCardActions`**: acciones de producto extraídas en un componente separado.
- **Categorías rápidas en la home**: shortcuts a Perros, Gatos, Alimentos y Juguetes usando iconos de `lucide-react`.
- **Dependencia `lucide-react`**: librería de iconos usada en homepage y componentes nuevos.

### Modificado

- **Checkout** (`/checkout`): ya no redirige al login si el usuario no está autenticado; detecta el estado guest y muestra el formulario de datos personales. Usuarios registrados mantienen el flujo anterior.
- **Carrito** (`/cart`): rediseño completo de la UI. Se agregó `QuantityStepper` (+/−) para modificar cantidades inline, precio unitario por producto, desglose de subtotal + envío gratis, y botón "Finalizar compra →".
- **Homepage** (`/`): hero minimalista centrado con `SearchBar`, sección de categorías con íconos, sección "Más vendidos" (antes "Productos populares"). Se eliminó el hero con gradiente verde.
- **Sistema de diseño** (`globals.css`): paleta primaria más oscura (`#166534`), nuevas variables `--vp-primary-light`, `--vp-shadow-sm`, `--vp-shadow`, `--vp-shadow-lg`. Fuente cambiada a `Helvetica Neue` (sistema), eliminando dependencia de Google Fonts Geist.
- **Layout** (`layout.tsx`): se eliminaron las fuentes Geist importadas de `next/font/google`.
- **Login**: al iniciar sesión se despacha el evento `cart_updated` para sincronizar el contador del header.
- **Órdenes** (`/account/orders`, `/account/orders/[id]`): refactor de componentes y mejoras de UI con uso del nuevo `Badge`.
- **Servicios** (`lib/services/`): `checkout.ts` agrega `createGuestCheckout`; `cart.ts` e `orders.ts` refactorizados; `cart-session.ts` actualizado.
- **`SiteHeader`**, **`ProductCard`**, **`AddToCartButton`**: ajustes de UI alineados al nuevo sistema de diseño.

---

## Historial anterior

Ver commits en la rama `develop` para cambios previos al 2026-05-29.
