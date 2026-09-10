#!/usr/bin/env bash
# Andro Prime — fetch the sleeve design faces for gen-sleeve-v8.js.
#
#   bash fetch-fonts.sh
#
# All three are SIL Open Font Licence, so self-hosting and outlining are permitted.
# They are gitignored: the repo holds the recipe, not the binaries.
#
# Without these, Chrome silently substitutes Consolas / Arial / Georgia and the PDF
# embeds THOSE. That is exactly what the v7b proofs shipped, and it is invisible unless
# you inspect the embedded font list. Check any output with:
#   python3 -c "from pypdf import PdfReader; p=PdfReader('x.pdf').pages[0]; \
#     print([str(p['/Resources']['/Font'][k].get_object()['/BaseFont']) for k in p['/Resources']['/Font']])"
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts
get () { echo "  $2"; curl -sS -L --fail -o "fonts/$2" "$1"; }
echo "fetching sleeve faces into ./fonts"
get "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf"                   "Inter.ttf"
get "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"         "JetBrainsMono.ttf"
get "https://github.com/google/fonts/raw/main/ofl/merriweather/Merriweather%5Bopsz,wdth,wght%5D.ttf" "Merriweather.ttf"
echo "done."
