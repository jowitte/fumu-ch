# AI-Crawler-Radar – Erhebung und Publish ziehen ins Repo

Stand: 2026-09-20 · Quelle: Akasha-Vault, Story «AI-Crawler-Radar läuft unabhängig vom Mac» (`Aufwände/fumu Marketing/AI-Crawler-Monitoring/`). Self-contained – was diese Session braucht, steht hier. Vorgänger-Pläne: `2026-07-07-ai-crawler-tracker.md` (Seite, Daten-Vertrag), `2026-07-16-ai-crawler-radar-iteration.md`.

## Kontext

Der Radar (`/ai-crawler-radar/`) liest beim Build `src/data/ai-crawler-tracker.json`. Dieses JSON erzeugt bisher eine Python-Lib im Akasha-Vault (`.claude/lib/robots-txt-analyzer/`), ausgelöst alle 14 Tage von einem launchd-Job auf Jochens Mac, der das JSON hierher committet und pusht.

Das hat zweimal versagt: Am 20.07. und 03.08.2026 fand der Mac zur Trigger-Zeit keine Namensauflösung, alle 108 Sites liefen auf ERROR, und die Null-Delle stand in der öffentlichen Zeitreihe. Ein Error-Guard (Schwelle 30 Prozent ERROR-Zellen) fängt das seit dem 18.08. ab, die Ursache bleibt: Der Job läuft auf einem Rechner, der nicht durchläuft. Von fünf geplanten Läufen haben zwei einen Snapshot veröffentlicht.

Entscheid im Vault (2026-09-20): Der Radar ist ein Produkt von fumu.ch, also gehören Erhebung, Snapshots und Publish in dieses Repo. Den Lauf übernimmt ein Cron-Job auf dem Server `akasha-cloud` aus einem eigenen Klon dieses Repos. GitHub Actions ist verworfen – ein Cron-Job mit Shell-Skript läuft bei jedem Git-Host weiter. Der Vault ist danach nicht mehr Teil der Kette; er nutzt die Daten nur noch lesend für interne Auswertungen.

Ein Testlauf von akasha-cloud aus ergab 13 Sites mit ERROR gegen 12 vom Mac. Der Standortwechsel verschiebt die Messung also kaum.

**Arbeitsteilung:** Diese Session zieht Code und Daten ins Repo und baut den Wrapper. Klon, venv und crontab auf dem Server sowie das Abschalten des Mac-Jobs macht die Vault-Session danach (Server-Betrieb liegt dort). Der nächste Mac-Lauf wäre Montag 2026-09-28 – bis dahin sollte der Server-Lauf stehen. Solange dieser Plan nicht umgesetzt ist, läuft die Mac-Pipeline unverändert weiter; hier also nichts abschalten.

## Akzeptanzkriterien (aus der Vault-Story)

- Nach jedem 14-Tage-Fenster liegt ein frischer Snapshot im Tracker-JSON, ohne dass der Mac zur Trigger-Zeit wach sein muss.
- Ein ausgefallener Lauf ist daran erkennbar, dass kein Snapshot entsteht – nicht daran, dass die Kurve auf null fällt.
	- Netz zur Laufzeit weg → kein Publish, kein Commit, Log-Eintrag mit Grund, Working Tree danach sauber
	- Einzelne Sites mit Bot-Schutz-403 → Lauf geht durch wie bisher
- Die Lauf-Historie steht an einer Stelle: ein Commit pro veröffentlichtem Lauf in der Git-Historie dieses Repos, Abbrüche im Log des Wrappers.

## Technische Eckpunkte

**Was umzieht** (Quelle: `~/Data/Akasha/.claude/lib/robots-txt-analyzer/`, Vault-Commit `249e101b9`; kopieren, die Vault-Historie bleibt dort):

| Quelle | Ziel |
|---|---|
| `analyze.py`, `timeline.py`, `diff.py`, `query.py`, `publish.py` | `tools/crawler-radar/` |
| `sample.yaml`, `crawlers.yaml`, `presets.yaml`, `tracker-content.yaml` | `tools/crawler-radar/` |
| `tests/` (28 Tests, grün am 2026-09-20), `requirements.txt`, `setup.sh` | `tools/crawler-radar/` |
| `data/snapshot-*.{json,csv}`, `data/diff-*.md`, `data/timeline.{csv,json}` | `tools/crawler-radar/data/` |
| `data/archive/` ohne `render_heatmap-v1.py` | `tools/crawler-radar/data/archive/` (belegt die zwei DNS-Ausfälle) |

**Was im Vault bleibt:** `render.py` – die interne Heatmap-Sicht hängt an der Brand-Datei und der Publish-Lib des Vaults. Sie liest künftig `timeline.csv` und `presets.yaml` aus diesem Repo; die Anpassung macht die Vault-Session. Darum die CLI-Argumente `--timeline`, `--presets`, `--data-dir` und die Spalten von `timeline.csv` nicht ändern.

**Pfade:** Alle Skripte lösen Pfade schon relativ zu `Path(__file__).parent` auf, das trägt den Umzug. Einzige Anpassung: der Default von `publish.py --output` zeigt auf `<repo>/src/data/ai-crawler-tracker.json`, aus der Skript-Position abgeleitet. Keine `/Users/`- oder `$HOME`-Pfade im Code.

**Zeitzone:** `publish.py` stempelt `generated_at` mit `astimezone()`. Auf dem Server ist die Prozess-Zeitzone UTC, auch wenn `CRON_TZ` die Trigger-Zeit auf Zürich stellt. Umstellen auf `datetime.now(ZoneInfo("Europe/Zurich"))`, mit Test.

**Wrapper `tools/crawler-radar/run.sh`** (Vorlage: `~/Data/Akasha/.claude/bin/bot-analyzer-cron.sh`, 49 Zeilen):

- Repo-Root aus der Skript-Position ableiten. Python ist `tools/crawler-radar/.venv/bin/python3`. Log-Pfad über `RADAR_LOG`, Default `tools/crawler-radar/cron.log` (gitignored).
- Das Wochen-Gate bleibt: Trigger wöchentlich, Lauf nur in geraden ISO-Wochen. `--force` überspringt es für Handläufe.
- Vor dem Lauf `git pull --rebase`. Scheitert er, loggen und abbrechen – dann gibt es auch kein Netz für die Erhebung.
- Ablauf wie bisher: `analyze.py --workers 12` → `timeline.py` → `diff.py` → `publish.py`.
- **Neu gegenüber der Vorlage:** Blockiert der Guard in `publish.py`, verwirft der Wrapper die Dateien dieses Laufs (`git restore` und `git clean` beschränkt auf `tools/crawler-radar/data/` und das Tracker-JSON). Bisher blieb der ERROR-Snapshot im Datenordner liegen und lief beim nächsten Mal in die Timeline. Der Working Tree muss nach einem Abbruch sauber sein, sonst scheitert der nächste `pull --rebase`.
- Ein Commit pro Lauf, Whitelist-Staging: Datenordner plus Tracker-JSON, Message `data: AI-Crawler-Tracker-Snapshot YYYY-MM-DD` (Format beibehalten, die Historie ist danach durchsuchbar). Push fail-soft: Scheitert er, bleibt der Commit und der nächste Lauf pusht nach.
- Der Commit löst wie bisher den Netlify-Build aus. Ein Commit pro Lauf, nicht mehrere.

**Netlify und Astro:** `tools/` liegt ausserhalb von `src/` und `public/` und berührt den Build nicht. `.gitignore` ergänzen: `tools/crawler-radar/.venv/`, `__pycache__/`, `.pytest_cache/`, `tools/crawler-radar/cron.log`.

**Daten-Vertrag:** `src/data/ai-crawler-tracker.json` bleibt unverändert. Gegenprobe: Nach dem Umzug erzeugt `publish.py` aus den umgezogenen Daten ein JSON, das bis auf `generated_at` identisch zum committeten ist.

## Schritte

- [x] Code, Konfiguration, Tests und Daten nach `tools/crawler-radar/` kopieren (Tabelle oben), `.gitignore` ergänzen
- [x] venv lokal aufsetzen (`setup.sh` bzw. `pip install -r requirements.txt`), `pytest` grün: 28 Tests
- [x] `publish.py`: Default-Output auf das Repo-JSON, `generated_at` auf `ZoneInfo("Europe/Zurich")`, Test dazu
- [x] Gegenprobe Daten-Vertrag: `publish.py` laufen lassen, `git diff src/data/ai-crawler-tracker.json` zeigt nur `generated_at`
- [x] `run.sh` bauen (Eckpunkte oben), inklusive Verwerfen bei Guard-Abbruch
- [x] Abbruch-Pfad prüfen: Lauf ohne Netz simulieren (z.B. `sample.yaml` per Argument auf eine Kopie mit unauflösbaren Hosts zeigen lassen) → kein Commit, Log-Eintrag mit Grund, `git status` sauber
- [x] `npm run build` und `npx vitest run` grün – der Umzug darf die Site nicht berühren
- [x] `CLAUDE.md` nachziehen: Abschnitt zur Radar-Pipeline (Ort, Befehle, Test-Aufruf) und bei den Schreibern den Server-Cron ergänzen (committet `tools/crawler-radar/data/` und das Tracker-JSON von ausserhalb; vor Arbeit an diesen Pfaden `git pull`)
- [x] Commit vorbereiten, Push nach Freigabe durch Jochen. Der Push deployt, ändert an der Seite aber nichts

## Entscheidungen

Getroffen im Vault, hier nicht neu verhandeln:

- Server-Cron statt GitHub Actions.
- Ort `tools/crawler-radar/`. Die Rohdaten sind damit öffentlich; das ist gewollt, der Radar wird nachprüfbar.
- Kuratierte Lauf-Texte (`tracker-content.yaml`) bleiben Inhalt und werden weiter aus der Vault-Session gepflegt (`/robots-txt snap`, über `/fumu-web`), nicht hier umformuliert.
- Keine Ausfall-Benachrichtigung in diesem Schritt.

Offen für diese Session: nichts Inhaltliches. Technische Detailfragen (Struktur von `run.sh`, Testaufbau) entscheidet sie selbst.

## Rückkanal

In die Vault-Story zurückmelden (Jochen trägt es rüber, oder die Vault-Session liest diesen Abschnitt):

- Endgültige Pfade und der genaue Aufruf von `run.sh` (inklusive `--force` und `RADAR_LOG`), damit der crontab-Eintrag geschrieben werden kann
- Test-Aufruf und Testzahl nach dem Umzug
- Alles, was sich an CLI-Argumenten oder am Format von `timeline.csv` doch geändert hat – daran hängen `render.py` und der `/robots-txt`-Skill im Vault

### Rückmeldung der Umsetzungs-Session (2026-09-20)

**Pfade und Aufruf**

- Pipeline: `tools/crawler-radar/` · Daten: `tools/crawler-radar/data/` · Ergebnis: `src/data/ai-crawler-tracker.json`
- Einmalig auf dem Server: `tools/crawler-radar/setup.sh` (legt `tools/crawler-radar/.venv/` an, installiert `requirements.txt`). Braucht `python3-venv`.
- Cron-Aufruf: `<klon>/tools/crawler-radar/run.sh` – keine Argumente, kein `cd` nötig, das Skript leitet Repo-Root und venv aus seiner Position ab. Vorschlag crontab (bisheriger Rhythmus, Montag 09:01):

  ```
  CRON_TZ=Europe/Zurich
  1 9 * * 1 /pfad/zum/klon/tools/crawler-radar/run.sh
  ```

- Handlauf ausserhalb des Gates: `run.sh --force`. Abbruch-Pfad testen: `run.sh --force --sample <kopie-mit-unauflösbaren-hosts.yaml>`.
- Log: `RADAR_LOG=/pfad/cron.log`, Default `tools/crawler-radar/cron.log` (gitignored). `run.sh` setzt selbst `TZ=Europe/Zurich` – Wochen-Gate, Snapshot-Datestamp, Commit-Datum und Log-Zeiten folgen damit der Zürcher Zeit, unabhängig von der Server-Zeitzone.
- Exit-Codes: 0 = veröffentlicht oder per Gate übersprungen · 1 = venv fehlt oder `git pull --rebase` gescheitert · 2 = Lauf verworfen (Guard oder Pipeline-Fehler).
- Der Klon braucht: Schreibzugriff auf `origin` (Deploy-Key mit Write), gesetztes `user.name`/`user.email`, Branch `main` mit Upstream. Der Working Tree muss sauber bleiben – im Klon nichts von Hand editieren.

**Tests**

- `cd tools/crawler-radar && .venv/bin/python -m pytest -q` → 32 Tests (28 übernommen, 4 neu: Zürcher Zeitstempel bei Prozess-TZ UTC, Default-Output, `main()` ohne `--output`, `--output -`).
- Geprüft in einem abgeschotteten Klon mit bare Scratch-Origin: (a) 108 Hosts auf `.invalid` → Guard blockiert bei 100 % ERROR, Exit 2, kein Commit, `git status` sauber, kein Snapshot im Datenordner; (b) Origin unerreichbar → Exit 1 vor der Erhebung; (c) echter Lauf → ein Commit mit genau sechs Dateien (Snapshot json/csv, Diff, Timeline csv/json, Tracker-JSON), Push ok, 12,0 % ERROR-Zellen auf 13 Sites.
- Gegenprobe Daten-Vertrag bestanden: `publish.py` auf den umgezogenen Daten ändert am committeten JSON nur `generated_at`.

**Geändert gegenüber der Vault-Lib**

- `publish.py --output`: Default ist jetzt das Repo-JSON statt stdout. Wer stdout will, ruft `--output -`. Falls der `/robots-txt`-Skill sich auf stdout verlassen hat: dort nachziehen.
- `generated_at` über `ZoneInfo("Europe/Zurich")`; `requirements.txt` um `tzdata` ergänzt (Absicherung für Server-Images ohne System-Zeitzonendaten).
- Unverändert: `--timeline`, `--presets`, `--data-dir`, alle übrigen Argumente und die Spalten von `timeline.csv`. `analyze.py`, `timeline.py`, `diff.py`, `query.py` sind byte-identisch zum Vault-Stand `249e101b9`.
- Nicht mit umgezogen: `README.md` der Lib (beschreibt Vault-Pfade und `render.py`); die Repo-Doku steht in `CLAUDE.md` > AI-Crawler-Radar-Pipeline.

**Für die Umstellung beachten**

- Bis der Server-Cron läuft, schreibt der Mac-Job weiter in den Datenordner des Vaults. Entsteht dort vor der Umstellung noch ein Snapshot (nächster Termin 2026-09-28), muss er samt Diff nach `tools/crawler-radar/data/` nachgezogen werden – sonst fehlt er der Repo-Timeline, und der erste Server-Lauf liesse ihn aus Trend und Lauf-Log fallen.
- `tracker-content.yaml` existiert ab jetzt doppelt. Master wird mit der Umstellung die Repo-Kopie; Änderungen, die bis dahin noch im Vault landen, vorher rüberziehen.
- `run.sh` verwirft bei jedem Scheitern vor dem Commit, nicht nur beim Guard (auch wenn `analyze.py` oder `timeline.py` abbrechen). Ein liegen gebliebener Commit nach gescheitertem Push wird beim nächsten Lauf per `pull --rebase` nachgeführt und mitgepusht.
- Grössenordnung: Ein Lauf ändert `timeline.json` (8 MB) und `timeline.csv` (2,6 MB) komplett. Git komprimiert das gut, das Repo wächst trotzdem pro Lauf spürbar. Kein Handlungsbedarf jetzt; falls es stört, wäre `timeline.json` der erste Kandidat zum Weglassen (wird aus den Snapshots neu erzeugt).
