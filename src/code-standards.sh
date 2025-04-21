#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create a temporary directory for log files
tmp_dir=$(mktemp -d)
cleanup() {
    rm -rf "$tmp_dir"
}
trap cleanup EXIT

echo -e "${YELLOW}Running all quality checks in parallel...${NC}\n"

# Run all linting commands in parallel and save their outputs
tsc --noEmit > "$tmp_dir/type.log" 2>&1 &
type_pid=$!

eslint . > "$tmp_dir/code.log" 2>&1 &
code_pid=$!

prettier . --check > "$tmp_dir/style.log" 2>&1 &
style_pid=$!

# Function to print output with a header
print_output() {
    local file=$1
    local header=$2
    local status=$3
    
    echo -e "\n=== $header ==="
    if [ -s "$file" ]; then
        cat "$file"
    fi
    if [ $status -ne 0 ]; then
        echo -e "${RED}❌ Failed with exit code $status${NC}"
    else
        echo -e "${GREEN}✅ Passed${NC}"
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
print_output "$tmp_dir/code.log" "ESLint Check" $code_status
print_output "$tmp_dir/style.log" "Prettier Check" $style_status

# Print final summary
echo -e "\n=== Summary ==="
if [ $type_status -eq 0 ] && [ $code_status -eq 0 ] && [ $style_status -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed${NC}"
    exit 1
fi 