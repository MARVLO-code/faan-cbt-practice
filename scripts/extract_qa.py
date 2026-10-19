import fitz, re, json, sys

def extract_pairs(path):
    doc = fitz.open(path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text

def parse_qa(text):
    """
    Parses text of form:
    SECTION HEADER (1-25)
    1. Question text...?
    Answer: answer text
    2. Question...
    Answer: ...
    """
    lines = text.split('\n')
    sections = []
    current_section = "General"
    items = []
    i = 0
    # Join lines into a single text first, then regex split on "N. " patterns at start of question
    joined = "\n".join(lines)
    # Find section headers: lines in ALL CAPS (with possible range like (1-25)) not starting with digit.
    # Find all question blocks using regex: number. ... ? \n Answer: ...
    pattern = re.compile(r'(\d+)\.\s*(.+?)\?\s*\n\s*Answer:\s*(.+?)(?=\n\d+\.|\n[A-Z][A-Z \-&,\.\/]{4,}\(|\Z)', re.DOTALL)
    # First, find section header positions
    header_pattern = re.compile(r'\n([A-Z][A-Z0-9 ,&\-\./]{5,}?)\s*\((\d+)[–\-](\d+)\)')
    headers = [(m.start(), m.group(1).strip()) for m in header_pattern.finditer('\n' + joined)]

    matches = list(pattern.finditer(joined))
    results = []
    for m in matches:
        qnum = int(m.group(1))
        question = re.sub(r'\s+', ' ', m.group(2)).strip() + '?'
        answer = re.sub(r'\s+', ' ', m.group(3)).strip()
        # trim trailing stuff like page numbers / headers leaking in
        answer = answer.split('\n')[0].strip()
        # find section: last header before this match's position
        pos = m.start()
        sec = "General"
        for hpos, hname in headers:
            if hpos <= pos + 1:
                sec = hname
            else:
                break
        results.append({"num": qnum, "section": sec, "question": question, "answer": answer})
    return results

if __name__ == "__main__":
    path = sys.argv[1]
    outpath = sys.argv[2]
    text = extract_pairs(path)
    results = parse_qa(text)
    with open(outpath, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"wrote {len(results)} items to {outpath}")
