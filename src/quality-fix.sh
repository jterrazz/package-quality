#!/bin/bash

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

printf "${CYAN_BG}${BRIGHT_WHITE} START ${NC} Running all quality fixes in parallel\n"

# Run all fixing commands in parallel and save their outputs
tsc --noEmit > "$tmp_dir/type.log" 2>&1 &
type_pid=$!

eslint . --fix > "$tmp_dir/code.log" 2>&1 &
code_pid=$!

prettier . --write > "$tmp_dir/style.log" 2>&1 &
style_pid=$!

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

# Wait for all processes to complete
wait $type_pid
type_status=$?
wait $code_pid
code_status=$?
wait $style_pid
style_status=$?

# Print outputs with headers
print_output "$tmp_dir/type.log" "TypeScript Check" $type_status
print_output "$tmp_dir/code.log" "ESLint Fix" $code_status
print_output "$tmp_dir/style.log" "Prettier Fix" $style_status

# Print final summary
printf "\n${CYAN_BG}${BRIGHT_WHITE} END ${NC} Finalizing quality fixes\n\n"
if [ $type_status -eq 0 ] && [ $code_status -eq 0 ] && [ $style_status -eq 0 ]; then
    printf "${GREEN}✓ All fixes completed successfully${NC}\n"
    exit 0
else
    printf "${RED}✗ Some operations failed${NC}\n"
    exit 1
fi 