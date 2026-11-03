"""Zet een versienummer in alle verwijzingen naar css/js en in de voet van elke pagina.

Waarom: GitHub Pages laat de browser bestanden 10 minuten bewaren. Op een iPad of telefoon
kan daardoor een oude versie blijven staan. Met ?v=<stempel> achter elke bestandsnaam haalt
de browser na elke publicatie vanzelf de nieuwe versie op.

Gebruik (voor elke publicatie, in de map van de site):  python tools/stempel.py
"""
import datetime
import glob
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
nu = datetime.datetime.now()
STEMPEL = nu.strftime("%Y%m%d%H%M")
LEESBAAR = nu.strftime("%Y-%m-%d %H:%M")


def lees(p):
    return io.open(p, encoding="utf-8").read()


def schrijf(p, s):
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)


aantal = 0
for pad in glob.glob(os.path.join(ROOT, "*.html")):
    s = lees(pad)
    nieuw = re.sub(r'((?:href|src)=")(assets/[^"?]+\.(?:css|js))(?:\?v=\d+)?(")', r"\1\2?v=" + STEMPEL + r"\3", s)
    nieuw = re.sub(r"<!--versie-->.*?<!--/versie-->", "<!--versie-->Versie " + LEESBAAR + "<!--/versie-->", nieuw)
    if nieuw != s:
        schrijf(pad, nieuw)
        aantal += 1

# modules die elkaar importeren
for naam in ("live-host.js", "live.js", "meedoen.js"):
    pad = os.path.join(ROOT, "assets", naam)
    s = lees(pad)
    nieuw = re.sub(r'(from\s+")(\./[^"?]+\.js)(?:\?v=\d+)?(")', r"\1\2?v=" + STEMPEL + r"\3", s)
    if nieuw != s:
        schrijf(pad, nieuw)
        aantal += 1

print("Versie", LEESBAAR, "gezet in", aantal, "bestanden")
