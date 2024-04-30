# Quizerinas: Svelte viktorinų sistema

## Aprašymas
"Quizerinas" - tai viktorinų sistema, sukurta naudojant SvelteKit ir SQLite duomenų baze. 

## Paleisti lokaliame tinkle

- Įdiekite naudodami yarn ar npm: `yarn install` arba `npm install`
- Paleiskite naudodami `yarn dev` arba `npm run dev`

## Docker

### Programos sukūrimas ir paleidimas

Docker konteinerio sukurimas:

```sh
docker build -t sveltekit-sqlite-img .
```

Docker konteinerio paleidimas:

```sh
docker run -d -p 3000:3000 \
  --mount type=bind,source="$(pwd)"/data/,target=/app/data/ \
  --rm --name sveltekit-sqlite \
  sveltekit-sqlite-img
```