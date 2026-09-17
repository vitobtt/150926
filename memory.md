# Seguimiento del proyecto

## page.tsx

- Estructura base: reemplazado el contenido de la plantilla por secciones full-bleed apiladas.
- **Hero** (`#065f46`): `100vh` x `100vw`, `min-height: 450px`. Ahora es `position: relative` + `overflow: hidden` para alojar el fondo.
  - **Fondo**: `<CardsShader />` (tarjeta de crédito 3D con shader WebGL), en `absolute inset-0` con base negra.
  - Encima, el div centrado de `1200px` (con `max-width: 100%`), ahora con `backgroundColor: transparent` (antes `#7f1d1d`) para dejar ver el shader, `zIndex: 10` y `pointerEvents: none` para no bloquear el hover/click de la tarjeta.
  - Dentro, un párrafo Lorem ipsum desarrollado, color `#ffffff`, `font-size: 55px`, `text-align: center`, `line-height: 1em`.
- **Sección 2** (`#40382d`): `50vh` x `100vw`, `min-height: 450px`.
- **Sección 3** (`#fcd34d`): `50vh` x `100vw`, `min-height: 450px`.

## components/ui/cards-shader-effect.tsx

- Componente `CardsShader` (client): tarjeta 3D con volumen por capas, tilt con el ratón (inercia), flip en hover y cambio de diseño al hacer click.
- Depende de `components/ui/cards-shader-effect-utils/`:
  - `shader-canvas.tsx`: renderer WebGL reutilizable (`ShaderCanvas` + helper `createShader`) y `GLSL_PRELUDE` con `u_time`, `u_resolution`, `hash/noise/fbm/centered()`. Si no hay WebGL, el canvas queda transparente y la tarjeta cae al color sólido.
  - `shaders-map.tsx`: `SHADERS_MAP`, 9 fragment shaders (aurora, liquid metal, plasma, mesh gradient, silk, nebula, caustics, sunset, carbon flow). Tipado como `Array<ComponentType | undefined>` a propósito, para que el fallback a `CARD_COLORS` siga siendo válido para TS.

## layout.tsx

- Fuente por defecto (`--font-sans`) cambiada de Inter → Bebas Neue → **Bungee Tint** (peso único 400, vía `next/font/google`).

## Git

- Repo: `vitobtt/150926` (rama `master`), remoto configurado.
- Último commit pusheado: cambios de hero (texto Lorem ipsum + estilos) y fuente Bungee Tint.

## Próximos pasos

- (Pendiente de definir)
