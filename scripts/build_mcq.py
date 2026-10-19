import json, random, re, sys

random.seed(42)

STOP = set(
    'the a an of and or to for in on at is are was were be been being with as by from '
    'into that this these those which who whom what when where how not no all'.split()
)


def _words(s):
    return set(w for w in re.findall(r"[a-zA-Z']+", s.lower()) if w not in STOP and len(w) > 2)


def too_similar(a, b):
    """True if two answer strings are near-duplicates/synonymous enough that
    using one as a distractor for the other would make the question ambiguous."""
    if a.strip().lower() == b.strip().lower():
        return True
    wa, wb = _words(a), _words(b)
    if not wa or not wb:
        return False
    overlap = len(wa & wb) / max(1, min(len(wa), len(wb)))
    return overlap >= 0.6 and min(len(wa), len(wb)) >= 2


def build_mcq(items, id_prefix, category, qtype):
    out = []
    by_section = {}
    for it in items:
        by_section.setdefault(it['section'], []).append(it)

    for it in items:
        sec = it['section']
        pool = [
            x['answer'] for x in by_section[sec]
            if x['num'] != it['num'] and not too_similar(x['answer'], it['answer'])
        ]
        # dedupe pool while preserving order
        seen = set()
        uniq_pool = []
        for a in pool:
            if a not in seen:
                seen.add(a)
                uniq_pool.append(a)
        random.shuffle(uniq_pool)
        distractors = uniq_pool[:3]
        # fallback if section pool too small
        if len(distractors) < 3:
            other = [x['answer'] for x in items if not too_similar(x['answer'], it['answer'])]
            seen2 = set(distractors)
            for a in other:
                if a not in seen2:
                    distractors.append(a)
                    seen2.add(a)
                if len(distractors) >= 3:
                    break
        options = distractors[:3] + [it['answer']]
        random.shuffle(options)
        correct_index = options.index(it['answer'])
        out.append({
            "id": f"{id_prefix}-{it['num']}",
            "category": category,
            "type": qtype,
            "section": sec,
            "question": it['question'],
            "options": options,
            "correctIndex": correct_index
        })
    return out

if __name__ == "__main__":
    ca = json.load(open('scripts/current_affairs.json', encoding='utf-8'))
    mp = json.load(open('scripts/mechanical_practice.json', encoding='utf-8'))

    ca_mcq = build_mcq(ca, "GEN-PQ", "general", "past")
    mp_mcq = build_mcq(mp, "MEC-PQ", "mechanical", "past")

    all_q = ca_mcq + mp_mcq
    with open('scripts/past_questions.json', 'w', encoding='utf-8') as f:
        json.dump(all_q, f, indent=2, ensure_ascii=False)
    print("general past:", len(ca_mcq), "mechanical past:", len(mp_mcq))
