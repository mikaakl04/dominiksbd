# Eine kleine Zeitreise — für Dominik

Eine scrollbare Erinnerung: 9 Kapitel, 67 Medien (52 Bilder, 15 Videos), jedes Kapitel
mit eigener visueller Welt und animiertem Hintergrund.

## Entwicklung

```bash
npm install
npm run dev
```

## Deployment auf GitHub Pages

1. Repository auf GitHub pushen (Branch `main`).
2. In den Repo-Einstellungen: **Settings → Pages → Source: GitHub Actions**.
3. Der Workflow in `.github/workflows/deploy.yml` baut und veröffentlicht automatisch.
4. Fertig — die Seite läuft unter `https://<username>.github.io/<repo>/`.

Der Build nutzt `base: './'` (relative Pfade), funktioniert also sowohl unter einer
Repository-URL als auch auf einer eigenen Domain — auch nach direktem Reload.

## Medien

Die Originale liegen außerhalb des Repos. Neu aufbereiten:

```bash
node scripts/process-media.mjs   # skaliert, konvertiert (JPEG + WebP), erzeugt Video-Poster
node scripts/add-video-dims.mjs  # ergänzt Videodimensionen im Manifest
```

`scripts/manifest-source.json` ist die redaktionelle Quelle: Kapitelzuordnung, Rolle
(`hero` / `main` / `supporting` / `archive`) und bei Bedarf `rotate` für Snapchat-Exporte,
die ohne EXIF-Orientierung gedreht gespeichert wurden.

Daraus entsteht `src/data/manifest.json` — die Verbindung zwischen Originaldatei und Website
bleibt dabei über `originalFolder` / `originalFilename` erhalten.

## Vollständigkeitsprüfung

```bash
npm run build
node scripts/verify.mjs
```

Prüft, dass jede Datei aus dem Archiv genau einmal im Manifest landet, alle abgeleiteten
Dateien existieren, jedes Asset in einem gerenderten Kapitel vorkommt, alles im `dist/`-Build
enthalten ist und keine absoluten Pfade den GitHub-Pages-Betrieb brechen.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `src/data/content.ts` | Kapiteltexte, Bildunterschriften, Intro- und Finaletexte |
| `src/data/themes.ts` | Farbwelt, Partikelart und Vignette pro Kapitel |
| `src/components/ChapterDecor.tsx` | Kapitel-Dekor (Tricolore, Zitronen, Stromboli, Feuerwerk, Frost, Sonne) |
| `src/components/Chapter.tsx` | Layout: Hero und Videos volle Breite, übrige Bilder paarweise |
| `src/components/MediaTile.tsx` | Medien-Darstellung — Container übernimmt das Seitenverhältnis, nichts wird beschnitten |

Ein Link wie `/#chapter-italien` springt direkt in ein Kapitel.
