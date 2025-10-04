# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
