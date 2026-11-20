# English by Maestra Lia

Giochi e materiali per imparare l'inglese alla scuola primaria.

## Com'è organizzato

- `index.html`: la home del sito, con le schede dei giochi e dei materiali
- `assets/style.css`: lo stile comune (quaderno verde, inchiostro blu, rosa). I colori sono in alto, in `:root`
- `games/guess-the-job/`: il gioco *Guess the job*
  - `jobs.js`: lavori, luoghi e azioni del gioco. Per cambiare il gioco basta modificare questo file
  - `game.js`: come funziona il gioco (domande, risposte, indizi)
  - `game.css`: lo stile del gioco

## Aggiungere un nuovo gioco o materiale

1. Crea una cartella, per esempio `games/nome-del-gioco/` o `materials/nome/`, con dentro un `index.html`
2. Nella pagina collega lo stile comune: `<link rel="stylesheet" href="../../assets/style.css">`
3. Aggiungi una scheda (`<a class="note" ...>`) nella home, in `index.html`
