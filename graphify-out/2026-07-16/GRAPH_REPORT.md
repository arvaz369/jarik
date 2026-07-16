# Graph Report - .  (2026-07-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 910 nodes · 1337 edges · 63 communities (48 shown, 15 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40dad299`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ShadcnInstaller
- search
- gray
- color
- button
- memory-indexer.js
- index.js
- slide_search_core.py
- spacing
- html-token-validator.py
- BM25
- TestTailwindConfigGenerator
- handleTextMessage
- secrets-menu.js
- fetch-background.py
- main
- DesignSystemGenerator
- generate.py
- generate-slide.py
- fontSize
- TailwindConfigGenerator
- manage-schedule.js
- design_system.py
- _sync_all.py
- package.json
- .generate_config_string
- primitive
- _search_csv
- ._base_config
- generate.py
- callClaude
- sendResponse
- BM25
- radius
- _generate_intelligent_overrides
- setup-server.sh
- shadow
- voice-helper.js
- lg
- bonus.js
- xl
- md
- none
- lesson.js
- getTodaySpend
- transcribeVoice
- prefetchUrls
- main
- .test_full_configuration_javascript
- .test_default_content_paths_react
- search.py
- update-bot.sh
- .test_add_breakpoints
- .test_recommend_plugins_nextjs
- .test_generate_typescript_config
- .test_generate_config_with_colors
- .test_write_config
- .test_init_framework
- .test_default_output_path_javascript
- .test_custom_output_path
- .test_default_content_paths_nextjs
- .test_add_colors

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 54 edges
2. `TestTailwindConfigGenerator` - 35 edges
3. `ShadcnInstaller` - 32 edges
4. `TestShadcnInstaller` - 26 edges
5. `color` - 15 edges
6. `handleTextMessage()` - 12 edges
7. `gray` - 12 edges
8. `spacing` - 12 edges
9. `ValidationResult` - 11 edges
10. `validate_html()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `TestTailwindConfigGenerator` --uses--> `TailwindConfigGenerator`  [INFERRED]
  skills/global/ui-styling/scripts/tests/test_tailwind_config_gen.py → skills/global/ui-styling/scripts/tailwind_config_gen.py
- `_generate_intelligent_overrides()` --calls--> `search()`  [INFERRED]
  skills/global/ui-ux-pro-max/scripts/design_system.py → skills/global/ui-ux-pro-max/scripts/core.py
- `main()` --calls--> `search()`  [INFERRED]
  skills/global/design-system/scripts/search-slides.py → skills/global/design-system/scripts/slide_search_core.py
- `main()` --calls--> `search_all()`  [INFERRED]
  skills/global/design-system/scripts/search-slides.py → skills/global/design-system/scripts/slide_search_core.py
- `main()` --calls--> `search_with_context()`  [INFERRED]
  skills/global/design-system/scripts/search-slides.py → skills/global/design-system/scripts/slide_search_core.py

## Import Cycles
- None detected.

## Communities (63 total, 15 thin omitted)

### Community 0 - "ShadcnInstaller"
Cohesion: 0.05
Nodes (32): main(), Path, Add all available shadcn/ui components.          Args:             overwrite:, List installed components.          Returns:             Tuple of (success, m, Handle shadcn/ui component installation., Initialize installer.          Args:             project_root: Project root d, Check if shadcn is initialized in project.          Returns:             True, Get list of already installed components.          Returns:             List (+24 more)

### Community 1 - "search"
Cohesion: 0.06
Nodes (47): s script, err(), log(), step(), warn(), BM25, detect_domain(), get_cip_brief() (+39 more)

### Community 2 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 3 - "color"
Cohesion: 0.04
Nodes (48): $type, $value, background, destructive, destructive-foreground, foreground, muted, muted-foreground (+40 more)

### Community 4 - "button"
Cohesion: 0.06
Nodes (45): $type, $value, $type, $value, bg, fg, font-size, hover-bg (+37 more)

### Community 5 - "memory-indexer.js"
Cohesion: 0.10
Nodes (37): initSemanticMemory(), closeDb(), DB_PATH, deleteChunksForFile(), getAllEmbeddings(), getChunkCount(), getDb(), getHashesForFile() (+29 more)

### Community 6 - "index.js"
Cohesion: 0.05
Nodes (28): BOOTSTRAP_STEPS, bootstrapData, bootstrapStep, bot, BOT_VERSION, CRASH_CONTEXT_FILE, DATA_DIR, enqueueText() (+20 more)

### Community 7 - "slide_search_core.py"
Cohesion: 0.08
Nodes (36): format_context(), format_result(), main(), Format a single search result for display, Format contextual recommendations for display., BM25, calculate_pattern_break(), detect_domain() (+28 more)

### Community 8 - "spacing"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 9 - "html-token-validator.py"
Cohesion: 0.14
Nodes (24): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+16 more)

### Community 10 - "BM25"
Cohesion: 0.11
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 11 - "TestTailwindConfigGenerator"
Cohesion: 0.08
Nodes (13): Test adding full color palette., Test adding custom fonts., Test adding custom spacing., Test TailwindConfigGenerator class., Test initialization with default settings., Test generating config with plugins., Test validating config with no content paths., Test validating config with empty theme extensions. (+5 more)

### Community 12 - "handleTextMessage"
Cohesion: 0.16
Nodes (13): downloadAndSave(), downloadTgFile(), enqueueMedia(), formatThinkingPhrase(), handleTextMessage(), humanizeError(), isGloballyRateLimited(), isOwner() (+5 more)

### Community 13 - "secrets-menu.js"
Cohesion: 0.20
Nodes (17): DATA_DIR, deleteEnvVar(), ENV_FILE, ENV_GROUP_KEYS, ENV_INSTRUCTIONS, ENV_SERVICES, ENV_SUCCESS_MESSAGES, envGithubChoiceKeyboard() (+9 more)

### Community 14 - "fetch-background.py"
Cohesion: 0.17
Nodes (17): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+9 more)

### Community 15 - "main"
Cohesion: 0.11
Nodes (9): main(), Add custom font families.          Args:             fonts: Dict of font_type, Add custom spacing values.          Args:             spacing: Dict of name:, Add custom breakpoints.          Args:             breakpoints: Dict of name:, Add plugin requirements.          Args:             plugins: List of plugin n, Get plugin recommendations based on configuration.          Returns:, Validate configuration.          Returns:             Tuple of (valid, messag, Add custom colors to theme.          Args:             colors: Dict of color_ (+1 more)

### Community 16 - "DesignSystemGenerator"
Cohesion: 0.16
Nodes (9): DesignSystemGenerator, Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation., Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., Execute searches across multiple domains., Find matching reasoning rule for a category. (+1 more)

### Community 17 - "generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 18 - "generate-slide.py"
Cohesion: 0.13
Nodes (13): generate_chart_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_title_slide(), main(), Title slide with gradient headline (+5 more)

### Community 19 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 20 - "TailwindConfigGenerator"
Cohesion: 0.12
Nodes (9): Generate Tailwind CSS configuration files., Add full color palette (50-950 shades) for a base color.          Args:, TailwindConfigGenerator, Test that adding same plugin twice doesn't duplicate., Test plugin recommendations., Test generating JavaScript configuration., Test validating valid configuration., Test initialization for JavaScript config. (+1 more)

### Community 21 - "manage-schedule.js"
Cohesion: 0.17
Nodes (11): AGENT_DIR, [command, ...args], fail(), getTimezone(), nowLocal(), schedules, SCHEDULES_FILE, STATE_FILE (+3 more)

### Community 22 - "design_system.py"
Cohesion: 0.17
Nodes (16): ansi_ljust(), format_ascii_box(), format_markdown(), format_master_md(), generate_design_system(), hex_to_ansi(), persist_design_system(), Convert hex color to ANSI True Color swatch (██) with fallback. (+8 more)

### Community 23 - "_sync_all.py"
Cohesion: 0.29
Nodes (13): blend(), derive_row(), derive_ui_reasoning(), h2r(), is_dark(), lum(), on_color(), r2h() (+5 more)

### Community 24 - "package.json"
Cohesion: 0.15
Nodes (12): dependencies, dotenv, grammy, @grammyjs/auto-retry, sql.js, description, main, name (+4 more)

### Community 25 - ".generate_config_string"
Cohesion: 0.20
Nodes (6): Generate configuration file content.          Returns:             Configurat, Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config., Add indentation to JSON string., Write configuration to file.          Returns:             Tuple of (success,

### Community 26 - "primitive"
Cohesion: 0.18
Nodes (11): fast, normal, slow, $type, $value, $type, $value, primitive (+3 more)

### Community 27 - "_search_csv"
Cohesion: 0.25
Nodes (10): detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search stack-specific guidelines, search() (+2 more)

### Community 28 - "._base_config"
Cohesion: 0.22
Nodes (6): Any, Path, Initialize generator.          Args:             typescript: If True, generat, Determine default output path., Create base configuration structure., Get default content paths for framework.

### Community 29 - "generate.py"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation      Args:, Generate multiple logo variants with different styles (+1 more)

### Community 30 - "callClaude"
Cohesion: 0.22
Nodes (9): buildSystemPrompt(), callClaude(), _callClaudeInner(), getCurrentModel(), loadSchedules(), recordSpend(), _safeRead(), saveState() (+1 more)

### Community 31 - "sendResponse"
Cohesion: 0.25
Nodes (9): confirmKeyboard(), escapeHtml(), extractMediaTags(), mdToTgHtml(), needsConfirmation(), sendChunked(), sendMediaItem(), sendResponse() (+1 more)

### Community 32 - "BM25"
Cohesion: 0.28
Nodes (5): BM25, BM25 ranking algorithm for text search, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query

### Community 33 - "radius"
Cohesion: 0.29
Nodes (8): $type, $value, $type, $value, radius, default, full, default

### Community 34 - "_generate_intelligent_overrides"
Cohesion: 0.33
Nodes (6): _detect_page_type(), format_page_override_md(), _generate_intelligent_overrides(), Detect page type from context and search results., Format a page-specific override file with intelligent AI-generated content., Generate intelligent overrides based on page type using layered search.

### Community 36 - "setup-server.sh"
Cohesion: 0.60
Nodes (5): err(), log(), setup-server.sh script, step(), warn()

### Community 37 - "shadow"
Cohesion: 0.47
Nodes (6): sm, shadow, sm, sm, $type, $value

### Community 38 - "voice-helper.js"
Cohesion: 0.50
Nodes (4): hasAnyTranscriber(), hasWhisperInstalled(), registerVoiceHelpers(), voiceFallbackKeyboard()

### Community 39 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 40 - "bonus.js"
Cohesion: 0.70
Nodes (4): copyPrompt(), fallbackCopy(), observer, showCopied()

### Community 41 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 42 - "md"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 43 - "none"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

### Community 44 - "lesson.js"
Cohesion: 1.00
Nodes (3): copyPrompt(), fallbackCopy(), showCopied()

### Community 45 - "getTodaySpend"
Cohesion: 0.67
Nodes (3): checkSpendLimit(), getTodaySpend(), settingsKeyboard()

### Community 46 - "transcribeVoice"
Cohesion: 0.67
Nodes (3): _deepgramTranscribe(), transcribeVoice(), _whisperTranscribe()

### Community 47 - "prefetchUrls"
Cohesion: 0.67
Nodes (3): httpGet(), prefetchUrls(), stripHtml()

## Knowledge Gaps
- **151 isolated node(s):** `WORKSPACE`, `PROJECTS`, `DATA_DIR`, `MEDIA_DIR`, `SESSIONS_FILE` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `primitive` connect `primitive` to `radius`, `gray`, `color`, `shadow`, `spacing`, `fontSize`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `color` connect `gray` to `primitive`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestTailwindConfigGenerator` and `.test_add_breakpoints()`) actually correct?**
  _`TailwindConfigGenerator` has 33 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `ShadcnInstaller` (e.g. with `TestShadcnInstaller` and `.test_add_all_components_dry_run()`) actually correct?**
  _`ShadcnInstaller` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `WORKSPACE`, `PROJECTS`, `DATA_DIR` to the rest of the system?**
  _343 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ShadcnInstaller` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `search` be split into smaller, more focused modules?**
  _Cohesion score 0.05519480519480519 - nodes in this community are weakly interconnected._