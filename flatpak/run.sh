#!/usr/bin/env bash

SCRIPTDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# This will build the flatpak in a directory called build-dir and
# place it in a repo called local-repo that is located in a subdirectory called "repo"
function build() {
    echo "Cloning the shared modules from Flathub."
    if [ ! -d ./flatpak/shared-modules ]; then
        git clone https://github.com/flathub/shared-modules.git
    fi

    echo "Starting build..."
    flatpak-builder --force-clean \
    --install-deps-from=flathub \
    --repo=repo build-dir com.github.cross_platform.iCloudForLinux.yaml
    echo "Build complete."
}

function test() {
    flatpak remote-list | grep -q "local-repo" ||
    flatpak remote-add \
    --no-gpg-verify \
    --if-not-exists "local-repo" "$SCRIPTDIR/repo/" &&
    flatpak install -y local-repo com.github.cross_platform.iCloudForLinux &&
    flatpak run com.github.cross_platform.iCloudForLinux
}

function clean_test() {
    flatpak uninstall -y com.github.cross_platform.iCloudForLinux
}

# Call the appropriate function based on the first argument
case "$1" in
    build)
        build
        ;;
    test)
        test
        ;;
    clean)
        clean_test
        ;;
    *)
        echo "Usage: $0 {build|test|clean}"
        exit 1
        ;;
esac