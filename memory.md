# Seguimiento del proyecto

## page.tsx

- Estructura base: reemplazado el contenido de la plantilla por secciones full-bleed apiladas.
- **Hero** (`#065f46`): `100vh` x `100vw`, `min-height: 450px`. Contiene un div centrado de `1200px` (con `max-width: 100%`) en `#7f1d1d`, con `display: flex` + `align-items`/`justify-content: center`.
  - Dentro, un párrafo Lorem ipsum desarrollado, color `#ffffff`, `font-size: 55px`, `text-align: center`, `line-height: 1em`.
- **Sección 2** (`#40382d`): `50vh` x `100vw`, `min-height: 450px`.
- **Sección 3** (`#fcd34d`): `50vh` x `100vw`, `min-height: 450px`.

## layout.tsx

- Fuente por defecto (`--font-sans`) cambiada de Inter → Bebas Neue → **Bungee Tint** (peso único 400, vía `next/font/google`).

## Git

- Repo: `vitobtt/150926` (rama `master`), remoto configurado.
- Último commit pusheado: cambios de hero (texto Lorem ipsum + estilos) y fuente Bungee Tint.

## Próximos pasos

- (Pendiente de definir)
