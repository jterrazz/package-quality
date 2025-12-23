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
# Resolve symlinks to get the real script location
SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SOURCE" ]; do
    DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Find bin directory: installed package or development
if [ -x "$SCRIPT_DIR/../../../.bin/oxlint" ]; then
    BIN_DIR="$SCRIPT_DIR/../../../.bin"
elif [ -x "$SCRIPT_DIR/../node_modules/.bin/oxlint" ]; then
    BIN_DIR="$SCRIPT_DIR/../node_modules/.bin"
else
    BIN_DIR="$(npm bin 2>/dev/null)"
fi

# Check if project uses any configs that need JS plugins and merge them
OXLINT_EXTRA_ARGS=()
if [ -f ".oxlintrc.json" ]; then
    PLUGINS_DIR="$PACKAGE_DIR/src/oxlint/plugins"
    CONFIGS_DIR="$PACKAGE_DIR/src/oxlint"
    
    if [ -d "$PLUGINS_DIR" ]; then
        # Create a temporary config that merges all needed jsPlugins and rules
        TEMP_CONFIG="$tmp_dir/oxlintrc.json"
        node -e "
            const fs = require('fs');
            const path = require('path');
            
            const config = JSON.parse(fs.readFileSync('.oxlintrc.json', 'utf8'));
            const pluginsDir = '$PLUGINS_DIR';
            const configsDir = '$CONFIGS_DIR';
            
            // Initialize arrays/objects
            config.jsPlugins = config.jsPlugins || [];
            config.rules = config.rules || {};
            
            // Map of config patterns to their plugin files and config files
            const pluginConfigs = [
                {
                    pattern: 'architectures/hexagonal',
                    plugin: 'architecture-boundaries.js',
                    configFile: 'architectures/hexagonal.json'
                },
                {
                    pattern: 'oxlint/node',
                    plugin: 'require-js-extensions.js',
                    configFile: 'node.json'
                },
                {
                    pattern: 'oxlint/expo',
                    plugin: 'remove-ts-extensions.js',
                    configFile: 'expo.json'
                },
                {
                    pattern: 'oxlint/nextjs',
                    plugin: 'remove-ts-extensions.js',
                    configFile: 'nextjs.json'
                }
            ];
            
            const configStr = JSON.stringify(config);
            const addedPlugins = new Set();
            
            for (const pc of pluginConfigs) {
                if (configStr.includes(pc.pattern)) {
                    const pluginPath = path.join(pluginsDir, pc.plugin);
                    
                    // Add plugin if not already added
                    if (fs.existsSync(pluginPath) && !addedPlugins.has(pc.plugin)) {
                        config.jsPlugins.push(pluginPath);
                        addedPlugins.add(pc.plugin);
                    }
                    
                    // Merge rules from config file
                    const configPath = path.join(configsDir, pc.configFile);
                    if (fs.existsSync(configPath)) {
                        try {
                            const extConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                            if (extConfig.rules) {
                                Object.assign(config.rules, extConfig.rules);
                            }
                        } catch (e) {}
                    }
                }
            }
            
            // Only write temp config if we added plugins
            if (config.jsPlugins.length > 0) {
                fs.writeFileSync('$TEMP_CONFIG', JSON.stringify(config, null, 2));
            }
        " 2>/dev/null
        
        if [ -f "$TEMP_CONFIG" ]; then
            OXLINT_EXTRA_ARGS+=("-c" "$TEMP_CONFIG")
        fi
    fi
fi

if [ "$RUN_TYPE" = true ]; then
    "$BIN_DIR/tsgo" --noEmit "${EXTRA_ARGS[@]}" > "$tmp_dir/type.log" 2>&1 &
    type_pid=$!
fi

if [ "$RUN_LINT" = true ]; then
    if [ "$FIX_MODE" = true ]; then
        "$BIN_DIR/oxlint" "${OXLINT_EXTRA_ARGS[@]}" --fix "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/code.log" 2>&1 &
    else
        "$BIN_DIR/oxlint" "${OXLINT_EXTRA_ARGS[@]}" "${EXTRA_ARGS[@]:-.}" > "$tmp_dir/code.log" 2>&1 &
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
