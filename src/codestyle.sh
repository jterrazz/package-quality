#!/bin/bash

# Colors for output (using Vitest-like colors)
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN_BG='\033[46m'  # Cyan background
BRIGHT_WHITE='\033[1;30m'  # Bold black text
NC='\033[0m' # No Color

# Parse arguments
FIX_MODE=false
RUN_TYPE=false
RUN_LINT=false
RUN_FORMAT=false
RUN_ALL=true
EXTRA_ARGS=()

for arg in "$@"; do
    case $arg in
        --fix)
            FIX_MODE=true
            ;;
        --type)
            RUN_TYPE=true
            RUN_ALL=false
            ;;
        --lint)
            RUN_LINT=true
            RUN_ALL=false
            ;;
        --format)
            RUN_FORMAT=true
            RUN_ALL=false
            ;;
        *)
            EXTRA_ARGS+=("$arg")
            ;;
    esac
done

# If running all, enable all checks
if [ "$RUN_ALL" = true ]; then
    RUN_TYPE=true
    RUN_LINT=true
    RUN_FORMAT=true
fi

# Create a temporary directory for log files
tmp_dir=$(mktemp -d)
cleanup() {
    rm -rf "$tmp_dir"
}
trap cleanup EXIT

if [ "$FIX_MODE" = true ]; then
    printf "${CYAN_BG}${BRIGHT_WHITE} START ${NC} Running quality fixes\n"
else
    printf "${CYAN_BG}${BRIGHT_WHITE} START ${NC} Running quality checks\n"
fi

# Run selected commands in parallel and save their outputs
type_pid=""
code_pid=""
style_pid=""

# Find the node_modules/.bin directory relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Find bin directory: installed package or development
if [ -x "$SCRIPT_DIR/../../.bin/oxlint" ]; then
    BIN_DIR="$SCRIPT_DIR/../../.bin"
elif [ -x "$SCRIPT_DIR/../node_modules/.bin/oxlint" ]; then
    BIN_DIR="$SCRIPT_DIR/../node_modules/.bin"
else
    BIN_DIR="$(npm bin 2>/dev/null)"
fi

if [ "$RUN_TYPE" = true ]; then
    "$BIN_DIR/tsgo" --noEmit "${EXTRA_ARGS[@]}" > "$tmp_dir/type.log" 2>&1 &
    type_pid=$!
fi

if [ "$RUN_LINT" = true ]; then
    if [ "$FIX_MODE" = true ]; then
        "$BIN_DIR/oxlint" --fix "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/code.log" 2>&1 &
    else
        "$BIN_DIR/oxlint" "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/code.log" 2>&1 &
    fi
    code_pid=$!
fi

if [ "$RUN_FORMAT" = true ]; then
    if [ "$FIX_MODE" = true ]; then
        "$BIN_DIR/oxfmt" "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/style.log" 2>&1 &
    else
        "$BIN_DIR/oxfmt" --check "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/style.log" 2>&1 &
    fi
    style_pid=$!
fi

# Function to print output with a header
print_output() {
    local file=$1
    local header=$2
    local status=$3

    printf "\n${CYAN_BG}${BRIGHT_WHITE} RUN ${NC} %s\n\n" "$header"
    if [ -s "$file" ]; then
        cat "$file"
    fi
    if [ $status -ne 0 ]; then
        printf "${RED}✗ Failed with exit code %d${NC}\n" $status
    else
        printf "${GREEN}✓ Passed${NC}\n"
    fi
}

# Wait for processes and collect statuses
type_status=0
code_status=0
style_status=0

if [ -n "$type_pid" ]; then
    wait $type_pid
    type_status=$?
fi

if [ -n "$code_pid" ]; then
    wait $code_pid
    code_status=$?
fi

if [ -n "$style_pid" ]; then
    wait $style_pid
    style_status=$?
fi

# Print outputs with headers
if [ "$RUN_TYPE" = true ]; then
    print_output "$tmp_dir/type.log" "TypeScript Check" $type_status
fi

if [ "$RUN_LINT" = true ]; then
    if [ "$FIX_MODE" = true ]; then
        print_output "$tmp_dir/code.log" "Oxlint Fix" $code_status
    else
        print_output "$tmp_dir/code.log" "Oxlint Check" $code_status
    fi
fi

if [ "$RUN_FORMAT" = true ]; then
    if [ "$FIX_MODE" = true ]; then
        print_output "$tmp_dir/style.log" "Oxfmt Format" $style_status
    else
        print_output "$tmp_dir/style.log" "Oxfmt Check" $style_status
    fi
fi

# Print final summary
if [ "$FIX_MODE" = true ]; then
    printf "\n${CYAN_BG}${BRIGHT_WHITE} END ${NC} Finalizing quality fixes\n\n"
else
    printf "\n${CYAN_BG}${BRIGHT_WHITE} END ${NC} Finalizing quality checks\n\n"
fi

if [ $type_status -eq 0 ] && [ $code_status -eq 0 ] && [ $style_status -eq 0 ]; then
    printf "${GREEN}✓ All checks passed${NC}\n"
    exit 0
else
    printf "${RED}✗ Some checks failed${NC}\n"
    exit 1
fi
