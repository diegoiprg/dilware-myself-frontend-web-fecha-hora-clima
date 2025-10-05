# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.20] - 2025-10-05

### Changed

- Tamaños de letra del reloj ajustados para tablet android landscape +2rem, ipad landscape +1rem, desktop hd/fullhd +2rem, wqhd/uhd +4rem
- Tamaños de letra de la fecha ajustados para iPhone +1rem portrait/+2rem landscape, tablet android +1rem portrait/+2rem landscape, iPad +1rem portrait/+2rem landscape, desktop +1rem portrait/+2rem landscape
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Tamaños de texto optimizados para mejor legibilidad en todos los dispositivos y orientaciones

## [1.9.19] - 2025-10-05

### Changed

- Tamaño de letra de versión cambiado a 1.5rem
- Tamaños de letra del reloj ajustados: +1rem iOS portrait, +2rem iOS landscape, +2rem otros portrait, +4rem otros landscape
- Mejoras en CI/CD: cache de node_modules, npm ci, cache de .next para acelerar build & deploy
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Tamaños de texto consistentes en versión y reloj
- Build & deploy más rápidos con caching optimizado

## [1.9.18] - 2025-10-05

### Changed

- Fila 1: versión en línea 1, fecha en línea 2
- Indicadores de clima reorganizados: humedad y precipitación en línea separada debajo de min/max
- Fondo de modo claro cambiado al color de letras de modo oscuro
- Tamaños de letra del reloj ajustados para dispositivos específicos (+rem según especificaciones)
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Mejor visibilidad de indicadores de clima en iOS portrait
- Fondo consistente en modo claro
- Tamaños de reloj optimizados para cada dispositivo y orientación

## [1.9.17] - 2025-10-05

### Changed

- Layout dividido verticalmente en 1/4 (menú+fecha), 2/4 (reloj), 1/4 (ubicación+clima)
- Menú y fecha en mismo párrafo, menú primero luego fecha, en parte superior
- Layout unificado para portrait y landscape con flexbox
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Layout consistente en todas las dimensiones y orientaciones de pantalla
- Menú posicionado correctamente en la parte superior

## [1.9.16] - 2025-10-05

### Changed

- Texto del reloj aumentado a 15vmin para máxima visibilidad en todas las dimensiones y orientaciones
- Texto de versión e icono de configuración ahora siempre visibles en portrait y landscape
- Contenido landscape ahora ocupa 100% ancho de pantalla removiendo padding
- Placeholder de clima muestra "Clima no disponible" cuando no carga en tablets antiguas
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Texto del reloj más grande y visible desde lejos
- Versión y configuración siempre mostradas
- Layout landscape ocupa ancho completo
- Placeholder adecuado para clima no disponible

## [1.9.15] - 2025-10-05

### Changed

- Sistema de layout cambiado de grid a flexbox para mejor flexibilidad en breakpoints, dimensiones de pantalla, orientaciones y dispositivos
- Texto del reloj ahora usa vmin para escalado responsivo y mostrar contenido completo horizontalmente
- Layout portrait: columna flex con secciones date, clock (flex-1), location, weather
- Layout landscape: fila flex con dos columnas, cada una con secciones date/clock/location y version/weather
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Grid/layout ahora funciona correctamente en todos los breakpoints y dispositivos
- Texto del reloj visible completamente en horizontal

## [1.9.14] - 2025-10-04

### Changed

- Contenido de celda fecha centrado al 100% ancho imitando celda ubicación
- Contenido de celda hora centrado al 100% ancho con texto lo suficientemente grande para ocupar espacio vertical y horizontal sin distorsionar sitio
- Actualizado versionado en package.json y src/lib/version.ts
- Actualizados comentarios del código

### Fixed

- Texto del reloj ahora muestra hora completa (hora, minutos, segundos, AM/PM si aplica)

## [1.9.13] - 2025-10-04

### Fixed

- Corregido comportamiento de la fila fecha/version para que se comporte como fila ubicación/clima
- Corregido texto del reloj cortado agregando overflow-hidden
- Actualizado versionado en package.json y src/lib/version.ts

### Changed

- Ajustado tamaño del texto del reloj para pantallas pequeñas y widescreen
- Centrado horizontal del contenido de las celdas de fecha y versión/menú
- Arreglado desbordamiento en iPhone portrait con ordenamiento dinámico y fluido
- Fila del reloj ahora 100% ancho, contenido máximo 95% centrado

## [1.9.12] - 2025-10-04

### Changed

- Ajustado tamaño del texto del reloj para pantallas pequeñas y widescreen
- Fila del reloj 100% ancho, contenido máximo 95% centrado

## [1.9.11] - 2025-10-04

### Changed

- Centrado horizontal del contenido de las celdas de fecha y versión/menú
- Arreglado desbordamiento en iPhone portrait con ordenamiento dinámico y fluido

## [1.9.10] - 2025-10-04

### Fixed

- Alineación de la versión/menú configuración a la derecha

## [1.9.9] - 2025-10-04

### Changed

- Mejoras en la interfaz

## [1.9.8] - 2025-10-04

### Added

- Versión inicial con funcionalidades básicas
