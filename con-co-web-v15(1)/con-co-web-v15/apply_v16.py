#!/usr/bin/env python3
from pathlib import Path
import re, shutil, sys

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 apply_v16.py /path/to/con-co-web-v15")
        raise SystemExit(2)
    target = Path(sys.argv[1]).expanduser().resolve()
    patch = Path(__file__).resolve().parent
    if not target.is_dir() or not (target / "assets" / "js" / "exam.js").exists():
        print("ERROR: The target must be the extracted V15 website folder (it must contain assets/js/exam.js).")
        raise SystemExit(1)

    # Copy updated assets and supporting files.
    for rel in ("assets/js/questions.js", "assets/js/document.js", "assets/js/conco-game.js", "assets/css/v16-content.css"):
        dest = target / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(patch / rel, dest)

    # Replace the pages whose main content is updated for V16.
    for name in ("home.html", "journey.html", "document.html", "exam.html", "game.html", "sources.html", "gallery.html", "unity.html"):
        shutil.copy2(patch / "pages" / name, target / name)

    # Update the exam storage version so a previous V15 attempt cannot keep the old questions.
    exam_js = target / "assets" / "js" / "exam.js"
    text = exam_js.read_text(encoding="utf-8")
    text = text.replace("conco_history_exam_once_v2", "conco_history_exam_once_v16")
    text = text.replace("quizVersion === 32", "quizVersion === 33")
    text = text.replace("memory.quizVersion = 32", "memory.quizVersion = 33")
    exam_js.write_text(text, encoding="utf-8")

    # Keep the general site progress panel in sync with seven reading modules.
    site_js = target / "assets" / "js" / "site.js"
    if site_js.exists():
        text = site_js.read_text(encoding="utf-8")
        text = text.replace("quizVersion: 32", "quizVersion: 33")
        text = text.replace("saved.quizVersion !== 32", "saved.quizVersion !== 33")
        text = text.replace("saved.quizVersion = 32", "saved.quizVersion = 33")
        text = text.replace(" + '/5'", " + '/7'")
        site_js.write_text(text, encoding="utf-8")

    # Inject the V16 stylesheet into remaining legacy pages, and revise the visible progress denominator.
    for html in target.glob("*.html"):
        content = html.read_text(encoding="utf-8", errors="replace")
        if "v16-content.css" not in content and "site.css" in content:
            content = re.sub(r'(<link[^>]+site\.css[^>]*>)', r'\1<link rel="stylesheet" href="assets/css/v16-content.css">', content, count=1, flags=re.I)
        content = content.replace("0/5", "0/7").replace("5 hồ sơ lịch sử", "7 chuyên đề")
        if html.name == "progress.html":
            content = content.replace("0/5", "0/7")
        html.write_text(content, encoding="utf-8")

    # Add Gallery and Unity to navigation on any other existing root pages (research, progress, video).
    nav_links = [
        ("gallery.html", "Thư viện ảnh"),
        ("unity.html", "Unity 3D"),
    ]
    for html in target.glob("*.html"):
        if html.name in {"home.html","journey.html","document.html","exam.html","game.html","sources.html","gallery.html","unity.html"}:
            continue
        content = html.read_text(encoding="utf-8", errors="replace")
        if "<nav" not in content or "unity.html" in content:
            continue
        def add_links(match):
            nav = match.group(0)
            extra = ''.join(f'<a href="{href}">{label}</a>' for href,label in nav_links)
            return nav.replace("</nav>", extra + "</nav>")
        content = re.sub(r'<nav\b[^>]*>[\s\S]*?</nav>', add_links, content, count=1, flags=re.I)
        html.write_text(content, encoding="utf-8")

    # Replace nested route copies with redirects to the root pages, keeping old folder URLs usable.
    routes = ["home","journey","document","exam","game","gallery","unity","sources","research","progress","video"]
    for route in routes:
        folder = target / route
        if folder.is_dir():
            dest = {
                "video":"document"
            }.get(route, route)
            (folder / "index.html").write_text(
                '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../'
                + dest + '.html"><title>Đang chuyển trang</title></head><body><a href="../'
                + dest + '.html">Mở trang</a></body></html>', encoding="utf-8"
            )
    for route in ("gallery","unity"):
        folder = target / route
        folder.mkdir(exist_ok=True)
        dest = route
        (folder / "index.html").write_text(
            '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../'
            + dest + '.html"><title>Đang chuyển trang</title></head><body><a href="../'
            + dest + '.html">Mở trang</a></body></html>', encoding="utf-8"
        )

    # Create a dedicated Unity WebGL insertion folder without overwriting any existing build.
    unity_dest = target / "unity-build"
    unity_dest.mkdir(exist_ok=True)
    placeholder = unity_dest / "README.txt"
    if not placeholder.exists():
        shutil.copy2(patch / "unity-build" / "README.txt", placeholder)
    keep = unity_dest / ".gitkeep"
    if not keep.exists():
        keep.write_text("", encoding="utf-8")

    print("V16 content patch applied successfully.")
    print("Updated: 30 questions, 7 reading topics, 7 sustainability scenarios, Gallery, separate Unity 3D tab.")
    print("Unity build location:", unity_dest)
    print("Note: The Unity player will stay empty until you copy your WebGL export into unity-build/.")
    print("Open the site through the project's local server, not by double-clicking an HTML file.")

if __name__ == "__main__":
    main()
