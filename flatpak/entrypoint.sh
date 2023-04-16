#!/bin/sh

HERE=$(dirname "$(realpath "$0")")
export PATH="$HERE/../lib/nodejs/bin:$PATH"
export DISPLAY=:0
export GTK_IM_MODULE=ibus
exec env TMPDIR=$XDG_CACHE_HOME /app/icloud-for-linux/icloud-for-linux --no-sandbox "$@"
