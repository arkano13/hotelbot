# Instalar este módulo de pruebas

1. Copia `test/` dentro de la raíz del proyecto.
2. Copia `scripts/tests/` dentro de `scripts/`.
3. Copia `PRUEBAS.md`, `RESULTADOS_REVISION.md` y `.env.test.example` a la raíz.
4. Reemplaza `package.json` por el incluido. Solo se agregaron comandos de prueba; las dependencias no cambiaron.
5. Ejecuta:

```bash
npm install
npm test
```

Es correcto que la primera ejecución falle: las pruebas están mostrando defectos de la versión actual. Corrige un defecto, vuelve a ejecutar y comprueba que desaparezca su prueba correspondiente.

Para revisar los datos actuales sin modificarlos:

```bash
npm run test:db:audit
```

Para la integración destructiva, sigue las instrucciones de `PRUEBAS.md` y usa únicamente una base cuyo nombre contenga `test`.
