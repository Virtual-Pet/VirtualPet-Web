# Virtual Pet - Frontend (Web)

Marketplace de productos para mascotas con soporte para **modo mock** (sin backend).

## Inicio rápido

### Arrancar en modo mock (sin backend) para desarrollo

```bash
cd apps/web
npm install    # si es la primera vez
npm run dev
```

Luego abre: **http://localhost:3000**

El archivo `.env.local` ya tiene configurado `NEXT_PUBLIC_USE_MOCK_SERVICES=1`, por lo que la app usará datos de prueba sin necesidad del backend.

### Arrancar con backend real

1. Edita `.env.local`:
   ```
   NEXT_PUBLIC_USE_MOCK_SERVICES=0
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

2. Asegúrate de que el backend esté corriendo en `http://localhost:8080`.

3. Arranca la app:
   ```bash
   npm run dev
   ```

## Modo Mock - Cómo probar

En modo mock, los datos se guardan en `localStorage` del navegador. 

### Flujo de compra básico

1. Accede a **http://localhost:3000/catalog** o página principal
2. Haz clic en un producto para ver detalles
3. Agrega al carrito con el botón verde
4. Ve a **/cart** y revisa los items
5. Procede a **/checkout** y confirma compra
6. En **/checkout/mock** simula el pago
7. Verifica la orden en **/account/orders**

### Datos de prueba desde la consola

Abre la consola del navegador (`F12` → `Console`) y pega estos comandos:

**Autenticarse como cliente (para mis pedidos)**
```javascript
localStorage.setItem('vp_token', 'mock-token');
localStorage.setItem('vp_user', JSON.stringify({
  id: 'u_cliente',
  email: 'cliente@demo.local',
  role: 'USER',
  name: 'Cliente Demo',
  address: 'Mar del Plata'
}));
location.reload();
```

**Autenticarse como staff (para backoffice)**
```javascript
localStorage.setItem('vp_token', 'mock-token');
localStorage.setItem('vp_user', JSON.stringify({
  id: 'u_staff',
  email: 'staff@virtualpet.local',
  role: 'STAFF',
  name: 'Staff Demo',
  address: ''
}));
location.reload();
```
Luego accede a **http://localhost:3000/orders** (backoffice).

**Sembrar carrito con productos**
```javascript
localStorage.setItem('vp_mock_cart', JSON.stringify({
  items: [
    { variantId: 'v1', productName: 'Croquetas SuperDog', sku: 'SD-01', quantity: 2, unitPrice: 1500, lineTotal: 3000, imageUrl: null },
    { variantId: 'v2', productName: 'Arena Gatuna Soft', sku: 'GF-01', quantity: 1, unitPrice: 900, lineTotal: 900, imageUrl: null }
  ],
  subtotal: 3900
}));
location.reload();
```

**Sembrar órdenes (para staff y cliente)**
```javascript
localStorage.setItem('vp_mock_orders', JSON.stringify([
  { id: 'ord_demo_1', status: 'CONFIRMED', total: 4500, createdAt: new Date().toISOString(), items: [{ productName: 'Croquetas SuperDog', quantity: 1, variantId: 'v1', unitPrice: 1500 }] },
  { id: 'ord_demo_2', status: 'IN_TRANSIT', total: 2400, createdAt: new Date().toISOString(), items: [{ productName: 'Arena Gatuna Soft', quantity: 2, variantId: 'v2', unitPrice: 1200 }] }
]));
location.reload();
```

**Limpiar todos los mocks**
```javascript
localStorage.removeItem('vp_mock_cart');
localStorage.removeItem('vp_mock_orders');
localStorage.removeItem('vp_token');
localStorage.removeItem('vp_user');
location.reload();
```

## Arquitectura de servicios

La lógica de negocio está **desacoplada** en `lib/services/`:

| Servicio | Responsabilidad |
|----------|-----------------|
| **`auth.ts`** | Login, registro, recuperación de contraseña |
| **`products.ts`** | Catálogo, búsqueda, facetas |
| **`cart.ts`** | Añadir/quitar items, carrito persistente |
| **`checkout.ts`** | Crear checkout, confirmar pago |
| **`orders.ts`** | Listar y ver detalles de órdenes |
| **`backoffice.ts`** | Órdenes pendientes, cambios de estado |

Cada servicio incluye:
- Implementación **real** (vía API backend `/api/v1/...`)
- Implementación **mock** (usando `localStorage`)

El modo se controla con la variable de entorno `NEXT_PUBLIC_USE_MOCK_SERVICES=1`.

## Comandos

```bash
npm run dev      # Desarrollo (hot reload)
npm run build    # Build para producción
npm run start    # Ejecutar build de producción
npm run lint     # Linter ESLint
```

## Variables de entorno

Archivo `.env.local` (ya viene configurado):

```env
# Activar servicios mock (sin backend)
NEXT_PUBLIC_USE_MOCK_SERVICES=1

# API URL (ignorado en modo mock)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

`NEXT_PUBLIC_API_URL` debe apuntar al host base del backend, sin el sufijo `/api/v1` (se añade automáticamente en el cliente OpenAPI).

## Docker

La imagen se construye con `output: "standalone"` y se ejecuta con `node server.js` desde el bundle compactado. `NEXT_PUBLIC_API_URL` se inlinea en el bundle del cliente en *build time*, así que para cambiar la URL del backend hay que **rebuildear**.

### Local (backend en el host)

Backend Spring/Node corriendo en `localhost:8080` de tu máquina:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://host.docker.internal:8080 \
  -t virtualpet-web .

docker run --rm -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  virtualpet-web
```

`--add-host=host.docker.internal:host-gateway` es necesario en Linux; en Mac/Windows ya viene resuelto.

> **Limitación**: el SSR adentro del contenedor llega a `host.docker.internal`, pero el browser del usuario no resuelve ese hostname. Las llamadas client-side (cart, checkout, account) van a fallar. Para iteración local con cliente funcional usá `npm run dev` directo, o alternativamente:
>
> ```bash
> docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 -t virtualpet-web .
> docker run --rm --network host virtualpet-web
> ```

### EC2 (backend en IP pública)

Para deployar a EC2 con el backend en otro EC2 accesible por **Elastic IP** (sin dominio):

```bash
# Reemplazar <BACKEND_EC2_IP> y <PORT> por valores reales
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://<BACKEND_EC2_IP>:<PORT> \
  -t virtualpet-web .

docker run -d -p 80:3000 --restart unless-stopped virtualpet-web
```

Checklist antes de correr en EC2:

- El EC2 del backend tiene **Elastic IP** asignada (sin EIP, un reboot del backend invalida el bundle del front y requiere rebuild).
- El Security Group del backend permite tráfico en el puerto desde `0.0.0.0/0` (las llamadas client-side vienen del browser de cada usuario, no del SG del front).
- El backend bindea en `0.0.0.0:<PORT>`, no en `127.0.0.1`.
- El Security Group del front deja entrar `80` desde `0.0.0.0/0`.

Cuando se sume dominio / HTTPS al front, el backend en HTTP plano va a ser bloqueado por mixed content; pasar también el backend a HTTPS en ese momento.

## Notas

- En modo mock, el checkout genera un UUID único para cada sesión.
- Las órdenes mock se persisten en `localStorage` bajo clave `vp_mock_orders`.
- Los formularios de login/registro aceptan cualquier email/password en modo mock.
- El carrito y las órdenes se sincronizan entre pestañas del navegador.
