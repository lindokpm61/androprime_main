#!/usr/bin/env bash
# Andro Prime — fetch the wordmark candidate faces for gen-logo.js.
#
#   bash fetch-fonts.sh
#
# All three are SIL Open Font Licence, so self-hosting and outlining are permitted.
# The masters this folder produces are outlined paths, so these files are needed only to
# re-cut a lockup, never to render one. They are gitignored for that reason.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts

get () { # url, target
  echo "  $2"
  curl -sS -L --fail -o "fonts/$2" "$1"
}

echo "fetching wordmark faces into ./fonts"
get "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf" "ArchivoBlack-Regular.ttf"
get "https://github.com/google/fonts/raw/main/ofl/figtree/Figtree%5Bwght%5D.ttf"         "Figtree.ttf"
get "https://github.com/google/fonts/raw/main/ofl/sourcesans3/SourceSans3%5Bwght%5D.ttf" "SourceSans3.ttf"
echo "done. Python deps, if not already present:  python -m pip install fonttools uharfbuzz"
