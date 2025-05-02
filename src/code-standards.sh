#!/bin/bash

# Exit on error
set -e

# Colors for output (using Vitest-like colors)
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN_BG='\033[46m'  # Cyan background
BRIGHT_WHITE='\033[1;30m'  # Bold black text
NC='\033[0m' # No Color

# Create a temporary directory for log files
tmp_dir=$(mktemp -d)
cleanup() {
    rm -rf "$tmp_dir"
}
trap cleanup EXIT

printf "${CYAN_BG}${BRIGHT_WHITE} START ${NC} Running all quality checks in parallel...\n\n"

# Function to run a command and capture its output
run_check() {
    local cmd=$1
    local log_file=$2
    local pid_file=$3
    
    # Run the command and capture both stdout and stderr
    eval "$cmd" > "$log_file" 2>&1
    echo $? > "$pid_file"
}

# Run all linting commands in parallel
run_check "tsc --noEmit" "$tmp_dir/type.log" "$tmp_dir/type.pid" &
run_check "eslint ." "$tmp_dir/code.log" "$tmp_dir/code.pid" &
run_check "prettier . --check" "$tmp_dir/style.log" "$tmp_dir/style.pid" &

# Function to print output with a header
print_output() {
    local file=$1
    local header=$2
    local status_file=$3
    
    local status=$(cat "$status_file")
    
    printf "\n${CYAN_BG}${BRIGHT_WHITE} RUN ${NC} %s\n\n" "$header"
    
    # Always show the output, even if it's empty
    cat "$file"
    
    if [ $status -ne 0 ]; then
        printf "${RED}✗ Failed with exit code %d${NC}\n" $status
    else
        printf "${GREEN}✓ Passed${NC}\n"
    fi
}

# Wait for all processes to complete
wait

# Print outputs with headers
print_output "$tmp_dir/type.log" "TypeScript Check" "$tmp_dir/type.pid"
print_output "$tmp_dir/code.log" "ESLint Check" "$tmp_dir/code.pid"
print_output "$tmp_dir/style.log" "Prettier Check" "$tmp_dir/style.pid"

# Get final status
type_status=$(cat "$tmp_dir/type.pid")
code_status=$(cat "$tmp_dir/code.pid")
style_status=$(cat "$tmp_dir/style.pid")

# Print final summary
printf "\n${CYAN_BG}${BRIGHT_WHITE} END ${NC} Finalizing quality checks\n\n"
if [ $type_status -eq 0 ] && [ $code_status -eq 0 ] && [ $style_status -eq 0 ]; then
    printf "${GREEN}✓ All checks passed${NC}\n"
    exit 0
else
    printf "${RED}✗ Some checks failed${NC}\n"
    exit 1
fi 