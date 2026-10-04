#!/usr/bin/env python3
"""Check the documentation contract without installing application dependencies."""
from collections import Counter
from pathlib import Path
import hashlib
import json
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
EXPECTED = ROOT / 'scripts' / 'docs-baseline.json'


def plain(text):
    return re.sub(r'<[^>]+>', '', text)


def anchors(text):
    result = set(re.findall(r'<a\s+id="([^"]+)"\s*>', text))
    counts = Counter()
    for heading in re.findall(r'^#{1,6}\s+(.+?)\s*#*$', text, re.M):
        heading = re.sub(r'\[([^]]+)\]\([^)]+\)', r'\1', plain(heading))
        base = re.sub(r'[^\w\-\s]', '', heading.lower()).replace(' ', '-')
        slug = base if counts[base] == 0 else f'{base}-{counts[base]}'
        counts[base] += 1
        result.add(slug)
    return result


def catalog(text):
    return re.findall(r'^\| ([A-Z]{3}-\d{2}) \| (Release 1|Expansion|Conditional) \| (.*) \|$', plain(text), re.M)


def normative_blocks(text):
    """Fingerprint complete FR/BR bodies, including exceptions outside tables."""
    blocks = {}
    text = plain(text)
    for match in re.finditer(r'^### ((?:FR|BR)-\d{3}):.*?(?=^### (?:FR|BR)-\d{3}:|^## |\Z)', text, re.M | re.S):
        normalized = ' '.join(match[0].split())
        blocks[match[1]] = hashlib.sha256(normalized.encode()).hexdigest()
    return blocks


def check():
    errors = []
    files = sorted(DOCS.rglob('*.md'))
    texts = {p: p.read_text() for p in files}
    targets = {p: anchors(t) for p, t in texts.items()}
    def require(ok, message):
        if not ok:
            errors.append(message)
    for p, text in texts.items():
        explicit = re.findall(r'<a\s+id="([^"]+)"\s*>', text)
        require(len(explicit) == len(set(explicit)), f'{p.relative_to(ROOT)}: duplicate explicit anchors')
        require(text.count('```') % 2 == 0, f'{p.name}: unclosed code fence')
        table_width = None
        for line_no, line in enumerate(text.splitlines(), 1):
            if line.startswith('|'):
                width = len(re.split(r'(?<!\\)\|', line)) - 2
                require(table_width is None or width == table_width, f'{p.name}:{line_no}: inconsistent table columns')
                table_width = width
            else:
                table_width = None
            for _, url in re.findall(r'\[([^\]]*)\]\(([^)]+)\)', line):
                if urlsplit(url).scheme:
                    continue
                path, _, fragment = unquote(url).partition('#')
                destination = (p.parent / path).resolve() if path else p
                require(destination.exists(), f'{p.relative_to(ROOT)}:{line_no}: missing {url}')
                if fragment and destination.exists() and destination.suffix == '.md':
                    require(fragment in targets.get(destination, set()), f'{p.relative_to(ROOT)}:{line_no}: missing anchor {url}')
        require(not re.search(r'\]\([^)]*PLANNING-DECISIONS\.md', text), f'{p.name}: broken retired decision link')
        # Historical section numbers are intentionally retained only in the migration map.
        if p.name != 'TRACEABILITY.md':
            require(not re.search(r'\b(?:section|sections) \d+', text, re.I), f'{p.name}: stale numbered-section reference')
        for stale in ['Q-02 policy omissions remain', 'Verified unit prices and explicit scenarios supplied', 'whether an external identity provider participates remains Needs Decision', 'No cloud vendor, region, database engine', 'No additional standalone design-document set is required', 'No separate ADR files']:
            require(stale not in text, f'{p.name}: stale statement: {stale}')
    baseline = json.loads(EXPECTED.read_text())
    req = texts[DOCS / 'reference/REQUIREMENTS.md']
    rows = catalog(req)
    actual = {id: release for id, release, _ in rows}
    require(len(rows) == len(actual) == 205, 'Catalog must have exactly 205 unique definitions')
    require(actual == baseline['catalog'], 'Catalog identifiers or release classifications changed')
    expected_counts = {'Release 1': 135, 'Expansion': 52, 'Conditional': 18}
    require(dict(Counter(actual.values())) == expected_counts, 'Release classification counts differ')
    owners = {
        'FR': ('reference/REQUIREMENTS.md', r'^### (FR-\d{3}):'),
        'BR': ('reference/PRODUCT-RULES.md', r'^### (BR-\d{3}):'),
        'QLT': ('reference/ACCEPTANCE.md', r'^\| (QLT-\d{2}) \|'),
        'T': ('reference/ACCEPTANCE.md', r'^\| (T\d{2}) \|'),
        'X': ('reference/ACCEPTANCE.md', r'^\| (X\d{2}) \|'),
        'F': ('reference/ACCEPTANCE.md', r'^### (F\d{2}) '),
        'V': ('reference/TRACEABILITY.md', r'^\| (V\d{2}) '),
        'DAR': ('reference/APPLICATION-DESIGN.md', r'^### (DAR-\d{3})$'),
    }
    for family, (file, pattern) in owners.items():
        found = re.findall(pattern, plain(texts[DOCS / file]), re.M)
        require(sorted(found) == baseline['identifiers'][family], f'{family}: missing/duplicate/changed definitions')
    acceptance = texts[DOCS / 'reference/ACCEPTANCE.md']
    for journey in baseline['additional_journeys']:
        require(f'### {journey}' in acceptance, f'Missing additional journey: {journey}')
    trace = texts[DOCS / 'reference/TRACEABILITY.md']
    mapped = re.findall(r'^\| \[([A-Z]{3}-\d{2})\]\(REQUIREMENTS\.md#', trace, re.M)
    require(sorted(mapped) == sorted(actual), 'Traceability must map each catalog ID exactly once')
    for line in trace.splitlines():
        if re.match(r'^\| \[[A-Z]{3}-\d{2}\]', line):
            cells = line.split('|')
            require(all(x.strip() for x in cells[1:-1]), 'Empty catalog traceability field')
            require(bool(re.search(r'\[V\d{2}\.[A-Z]{3}-\d{2}\]', line)), 'Missing requirement-level acceptance subcase')
    register = texts[DOCS / 'reference/DECISIONS-AND-GATES.md']
    for family, count, width in [('Q', 9, 2), ('AD', 17, 3), ('RD', 11, 3), ('TD', 8, 3)]:
        for n in range(1, count + 1):
            alias = f'{family}-{n:0{width}}'
            require(f'id="{alias.lower()}"' in register, f'Missing decision alias {alias}')
    for n in range(11):
        require(f'id="phase-{n}"' in acceptance, f'Missing Phase {n} exit gate')
    adr_files = list((DOCS / 'adr').glob('[0-9]*.md'))
    require({p.name[:3] for p in adr_files} == {f'{n:03}' for n in [*range(1, 11), 13]}, 'ADR set differs; 011 and 012 must stay reserved')
    for p in adr_files:
        for field in ['**Status:**', '**Validation:**', '## Context', '## Decision', '## Alternatives', '## Consequences', '## Reconsideration trigger', '## Requirements and evidence']:
            require(field in texts[p], f'{p.name}: missing {field}')
    total = 0
    for name in ['PRODUCT-PLAN.md', 'ARCHITECTURE.md', 'ROADMAP.md', 'TECH-STACK.md']:
        words = len(texts[DOCS / name].split())
        total += words
        require(1000 <= words <= 2000, f'{name}: {words} words outside core target')
    require(len(list((DOCS / 'reference').glob('*.md'))) == 9, 'Expected nine topic references')
    # A snapshot catches accidental migration losses; intentional future changes update this baseline explicitly.
    for file, digest in baseline.get('protected_table_hashes', {}).items():
        t = plain(texts[DOCS / file])
        protected = '\n'.join(line for line in t.splitlines() if re.match(r'^\| (?:[A-Z]{3}-\d{2}|QLT-\d{2}|T\d{2}|X\d{2}) \|', line))
        require(hashlib.sha256(protected.encode()).hexdigest() == digest, f'{file}: protected requirement/scenario rows changed; review before updating baseline')
    for file, expected_blocks in baseline.get('protected_block_hashes', {}).items():
        require(normative_blocks(texts[DOCS / file]) == expected_blocks, f'{file}: FR/BR policy text changed; review before updating baseline')
    corpus = '\n'.join(texts.values())
    for quantity in baseline.get('numeric_quantities', []):
        require(quantity in corpus, f'Missing inherited numeric quantity: {quantity}')
    if errors:
        print('\n'.join(errors))
        print(f'FAIL: {len(errors)} documentation errors')
        return 1
    print(f'PASS: {len(files)} documents; local links/anchors; 205 catalog rows (135/52/18); FR/BR/QLT/T/X/F/V/DAR; aliases; 11 ADRs; phase gates.')
    print(f'Core documents: {total:,} words (baseline 81,199; reduction {100*(1-total/81199):.1f}%).')
    print('Application checks run separately through pnpm check. External sources and runtime gates are not validated by this documentation check.')
    return 0


if __name__ == '__main__':
    sys.exit(check())
