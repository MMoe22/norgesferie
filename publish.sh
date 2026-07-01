#!/bin/bash
# Publiserer Norgesferie-appen til GitHub Pages, så den kan åpnes på mobil.
# Kjør fra Terminal:  ./publish.sh
# Trygt å kjøre flere ganger – den oppdaterer bare siste versjon.
set -e
cd "$(dirname "$0")"

echo "🏔️  Norgesferie → GitHub Pages"
echo

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI mangler. Installer med:  brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Først: innlogging på GitHub."
  echo "  • Har dere ikke konto? Lag en gratis på https://github.com/signup først."
  echo "  • Trykk Enter på spørsmålene under. Nettleseren åpner seg –"
  echo "    logg inn og skriv inn koden som vises her."
  echo
  gh auth login --hostname github.com --git-protocol https --web
  echo
fi

OWNER=$(gh api user -q .login)
REPO="norgesferie"

if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Oppretter offentlig repo github.com/$OWNER/$REPO og laster opp appen …"
  echo "(Selve appen blir offentlig på nett – valgene deres ligger IKKE i den,"
  echo " de bor kun i nettleserens lagring.)"
  gh repo create "$REPO" --public --source . --remote origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  echo "Laster opp siste versjon …"
  git push -u origin main
fi

echo "Slår på GitHub Pages …"
gh api -X POST "repos/$OWNER/$REPO/pages" \
  -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true

URL="https://$OWNER.github.io/$REPO/"
echo "Venter på at siden bygges (tar vanligvis 1–3 minutter) …"
code=""
for _ in $(seq 1 36); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  [ "$code" = "200" ] && break
  printf "."
  sleep 5
done
echo

if [ "$code" = "200" ]; then
  echo "✅ Appen er på nett:  $URL"
else
  echo "⏳ Pages bygger fortsatt. Prøv adressen om noen minutter:  $URL"
fi
echo
echo "📱 På mobilene:"
echo "   1. Åpne adressen over i Safari/Chrome."
echo "   2. Del-menyen → «Legg til på Hjem-skjerm» – da blir den som en app."
echo "   3. Hent ruten: på PC-en trykk «💾 Sikkerhetskopi / overfør» og send"
echo "      koden til telefonen (f.eks. på melding). Lim inn under «Hent inn"
echo "      valg» på telefonen og trykk «Erstatt alt»."
