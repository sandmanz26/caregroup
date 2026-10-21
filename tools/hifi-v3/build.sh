#!/usr/bin/env bash
# Regenerates full_design_v3/*.html from the data & helpers in src/ (so hi-fi numbers always match the lo-fi app).
# Usage: bash tools/hifi-v3/build.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HERE="$ROOT/tools/hifi-v3"
S="$ROOT/src"
W="$(mktemp -d)"
cp "$HERE"/*.mjs "$W"/
cp "$S/utils/date.js" "$W/date.mjs"
sed "s#from './date'#from './date.mjs'#; s#from './tiers'#from './tiers.mjs'#" "$S/utils/tiers.js" > "$W/tiers.mjs"
sed "s#from '../data/mockData'#from './mockData.mjs'#; s#from './date'#from './date.mjs'#; s#from './tiers'#from './tiers.mjs'#" "$S/utils/reading.js" > "$W/reading.mjs"
sed "s#from './date'#from './date.mjs'#" "$S/utils/attendance.js" > "$W/attendance.mjs"
cp "$S/utils/pelayanan.js" "$W/pelayanan.mjs"
sed "s#from '../utils/date'#from './date.mjs'#" "$S/data/mockData.js" > "$W/mockData.mjs"
node "$W/build.mjs" "$ROOT/full_design_v3"
rm -rf "$W"
