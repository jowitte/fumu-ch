#!/usr/bin/env bash
# AI-Crawler-Radar – 14-tägiger Lauf: Erhebung, Timeline, Diff, Tracker-JSON,
# ein Commit, Push. Gedacht für cron auf einem Klon dieses Repos; Trigger
# wöchentlich, das ISO-Wochen-Gate macht daraus 14 Tage.
#
# Aufruf:  tools/crawler-radar/run.sh [--force] [--sample PATH]
#   --force        Wochen-Gate überspringen (Handlauf)
#   --sample PATH  anderes Site-Sample als sample.yaml (Abbruch-Pfad testen)
#   RADAR_LOG      Log-Pfad (Default: tools/crawler-radar/cron.log, gitignored)
#
# Exit-Codes: 0 = veröffentlicht oder per Gate übersprungen, 1 = Setup/Pull
# gescheitert, 2 = Lauf verworfen (Guard oder Pipeline-Fehler). Ein verworfener
# Lauf hinterlässt keinen Snapshot und einen sauberen Working Tree.
set -euo pipefail

# Prozess-Zeitzone auf dem Server ist UTC; Gate, Datestamp und Commit-Datum
# sollen der Zürcher Zeit folgen.
export TZ="Europe/Zurich"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
PY="$HERE/.venv/bin/python3"
LOG="${RADAR_LOG:-$HERE/cron.log}"
DATA_REL="tools/crawler-radar/data"
JSON_REL="src/data/ai-crawler-tracker.json"

FORCE=0
SAMPLE=""
while (( $# > 0 )); do
  case "$1" in
    --force) FORCE=1 ;;
    --sample) SAMPLE="${2:?--sample braucht einen Pfad}"; shift ;;
    *) echo "Unbekanntes Argument: $1" >&2; exit 1 ;;
  esac
  shift
done

mkdir -p "$(dirname "$LOG")"
log() {
  local line="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
  echo "$line" >>"$LOG"
  if [ -t 1 ]; then echo "$line"; fi
}

# Verwirft alles, was dieser Lauf im Datenordner und am Tracker-JSON angefasst
# hat. Sonst bliebe ein ERROR-Snapshot liegen, liefe beim nächsten Mal in die
# Timeline, und der nächste `pull --rebase` scheiterte am schmutzigen Tree.
discard_run() {
  git -C "$REPO" restore --source=HEAD --staged --worktree -- "$DATA_REL" "$JSON_REL" >>"$LOG" 2>&1 || true
  git -C "$REPO" clean -fdq -- "$DATA_REL" >>"$LOG" 2>&1 || true
}

abort_run() {
  log "$1 – kein Publish, kein Commit."
  discard_run
  log "Dateien dieses Laufs verworfen."
  exit 2
}

# 14-Tage-Gate: nur in geraden ISO-Wochen laufen.
WEEK=$(date +%V)
if (( FORCE == 0 )) && (( 10#$WEEK % 2 != 0 )); then
  log "ISO-Woche $WEEK ungerade – übersprungen."
  exit 0
fi

if [ ! -x "$PY" ]; then
  log "venv fehlt ($PY) – erst tools/crawler-radar/setup.sh laufen lassen."
  exit 1
fi

log "Start (Woche $WEEK$( (( FORCE )) && echo ', --force' )$( [ -n "$SAMPLE" ] && echo ", Sample $SAMPLE" ))."

# Ohne Pull kein Lauf: Scheitert er, gibt es auch kein Netz für die Erhebung.
if ! git -C "$REPO" pull --rebase --quiet >>"$LOG" 2>&1; then
  git -C "$REPO" rebase --abort >>"$LOG" 2>&1 || true
  log "git pull --rebase gescheitert (Netz weg oder Working Tree nicht sauber) – Abbruch vor der Erhebung."
  exit 1
fi

ANALYZE_ARGS=(--workers 12)
if [ -n "$SAMPLE" ]; then ANALYZE_ARGS+=(--sample "$SAMPLE"); fi

"$PY" "$HERE/analyze.py" "${ANALYZE_ARGS[@]}" >>"$LOG" 2>&1 || abort_run "analyze.py gescheitert"
"$PY" "$HERE/timeline.py"                     >>"$LOG" 2>&1 || abort_run "timeline.py gescheitert"
"$PY" "$HERE/diff.py"                         >>"$LOG" 2>&1 || log "diff.py non-zero (evtl. erster Snapshot) – weiter."
"$PY" "$HERE/publish.py"                      >>"$LOG" 2>&1 || abort_run "publish.py blockiert (Plausibilitäts-Guard, Grund in der Zeile davor)"

# Ein Commit pro Lauf, Whitelist: Datenordner plus Tracker-JSON – sonst nichts.
git -C "$REPO" add -- "$DATA_REL" "$JSON_REL"
if git -C "$REPO" diff --cached --quiet -- "$DATA_REL" "$JSON_REL"; then
  log "Kein Datenunterschied – kein Commit."
else
  git -C "$REPO" commit --quiet -m "data: AI-Crawler-Tracker-Snapshot $(date +%Y-%m-%d)" \
    -- "$DATA_REL" "$JSON_REL" >>"$LOG" 2>&1
  log "Commit $(git -C "$REPO" rev-parse --short HEAD)."
fi

# Push fail-soft; nimmt auch einen liegen gebliebenen Commit eines früheren Laufs mit.
if [ "$(git -C "$REPO" rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)" -gt 0 ]; then
  if git -C "$REPO" push --quiet >>"$LOG" 2>&1; then
    log "Gepusht – Netlify baut."
  else
    log "Push fehlgeschlagen (Netz?) – Commit bleibt, nächster Lauf pusht nach."
  fi
fi
log "Fertig."
