#!/usr/bin/env python3
"""Build compact US street samples from Census TIGER/Line ADDRFEAT + GeoNames postal."""
from __future__ import annotations
import gzip, json, os, random, re, shutil, tempfile, zipfile
from collections import defaultdict
import shapefile

# Default: use /tmp/oa-build cache if present; else scripts/../.cache/oa-build
_REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_CACHE = os.environ.get("OA_CACHE", "/tmp/oa-build" if os.path.isdir("/tmp/oa-build") else os.path.join(_REPO, ".cache/oa-build"))
ROOT = _CACHE
TIGER = os.path.join(ROOT, "tiger")
GEONAMES = os.path.join(ROOT, "US.txt")
OUT_DIR = os.path.join(_REPO, "public/data")
os.makedirs(OUT_DIR, exist_ok=True)
print(f"cache={ROOT} out={OUT_DIR}")
random.seed(42)

STATE_META = {
  "AK": {"name":"Alaska","nameZh":"阿拉斯加","areaCodes":["907"]},
  "AL": {"name":"Alabama","nameZh":"阿拉巴马","areaCodes":["205","251","256"]},
  "AR": {"name":"Arkansas","nameZh":"阿肯色","areaCodes":["501","870"]},
  "AZ": {"name":"Arizona","nameZh":"亚利桑那","areaCodes":["480","520","602","623"]},
  "CA": {"name":"California","nameZh":"加利福尼亚","areaCodes":["213","310","415","408","619","714","818"]},
  "CO": {"name":"Colorado","nameZh":"科罗拉多","areaCodes":["303","720"]},
  "CT": {"name":"Connecticut","nameZh":"康涅狄格","areaCodes":["203","860"]},
  "DC": {"name":"District of Columbia","nameZh":"华盛顿特区","areaCodes":["202"]},
  "DE": {"name":"Delaware","nameZh":"特拉华","areaCodes":["302"]},
  "FL": {"name":"Florida","nameZh":"佛罗里达","areaCodes":["305","407","561","813","904"]},
  "GA": {"name":"Georgia","nameZh":"佐治亚","areaCodes":["404","678","770"]},
  "HI": {"name":"Hawaii","nameZh":"夏威夷","areaCodes":["808"]},
  "IA": {"name":"Iowa","nameZh":"艾奥瓦","areaCodes":["319","515"]},
  "ID": {"name":"Idaho","nameZh":"爱达荷","areaCodes":["208"]},
  "IL": {"name":"Illinois","nameZh":"伊利诺伊","areaCodes":["312","773","847"]},
  "IN": {"name":"Indiana","nameZh":"印第安纳","areaCodes":["317","812"]},
  "KS": {"name":"Kansas","nameZh":"堪萨斯","areaCodes":["316","785"]},
  "KY": {"name":"Kentucky","nameZh":"肯塔基","areaCodes":["502","859"]},
  "LA": {"name":"Louisiana","nameZh":"路易斯安那","areaCodes":["504","225"]},
  "MA": {"name":"Massachusetts","nameZh":"马萨诸塞","areaCodes":["617","508","781"]},
  "MD": {"name":"Maryland","nameZh":"马里兰","areaCodes":["301","410"]},
  "ME": {"name":"Maine","nameZh":"缅因","areaCodes":["207"]},
  "MI": {"name":"Michigan","nameZh":"密歇根","areaCodes":["313","248","734"]},
  "MN": {"name":"Minnesota","nameZh":"明尼苏达","areaCodes":["612","651"]},
  "MO": {"name":"Missouri","nameZh":"密苏里","areaCodes":["314","816"]},
  "MS": {"name":"Mississippi","nameZh":"密西西比","areaCodes":["601"]},
  "MT": {"name":"Montana","nameZh":"蒙大拿","areaCodes":["406"]},
  "NC": {"name":"North Carolina","nameZh":"北卡罗来纳","areaCodes":["704","919"]},
  "ND": {"name":"North Dakota","nameZh":"北达科他","areaCodes":["701"]},
  "NE": {"name":"Nebraska","nameZh":"内布拉斯加","areaCodes":["402"]},
  "NH": {"name":"New Hampshire","nameZh":"新罕布什尔","areaCodes":["603"]},
  "NJ": {"name":"New Jersey","nameZh":"新泽西","areaCodes":["201","609","732"]},
  "NM": {"name":"New Mexico","nameZh":"新墨西哥","areaCodes":["505"]},
  "NV": {"name":"Nevada","nameZh":"内华达","areaCodes":["702","775"]},
  "NY": {"name":"New York","nameZh":"纽约","areaCodes":["212","718","917","516"]},
  "OH": {"name":"Ohio","nameZh":"俄亥俄","areaCodes":["216","614","513"]},
  "OK": {"name":"Oklahoma","nameZh":"俄克拉荷马","areaCodes":["405","918"]},
  "OR": {"name":"Oregon","nameZh":"俄勒冈","areaCodes":["503","541","971"]},
  "PA": {"name":"Pennsylvania","nameZh":"宾夕法尼亚","areaCodes":["215","412","717"]},
  "RI": {"name":"Rhode Island","nameZh":"罗得岛","areaCodes":["401"]},
  "SC": {"name":"South Carolina","nameZh":"南卡罗来纳","areaCodes":["803","843"]},
  "SD": {"name":"South Dakota","nameZh":"南达科他","areaCodes":["605"]},
  "TN": {"name":"Tennessee","nameZh":"田纳西","areaCodes":["615","901"]},
  "TX": {"name":"Texas","nameZh":"得克萨斯","areaCodes":["214","512","713","210","817"]},
  "UT": {"name":"Utah","nameZh":"犹他","areaCodes":["801"]},
  "VA": {"name":"Virginia","nameZh":"弗吉尼亚","areaCodes":["703","804","757"]},
  "VT": {"name":"Vermont","nameZh":"佛蒙特","areaCodes":["802"]},
  "WA": {"name":"Washington","nameZh":"华盛顿州","areaCodes":["206","425","253"]},
  "WI": {"name":"Wisconsin","nameZh":"威斯康星","areaCodes":["414","608"]},
  "WV": {"name":"West Virginia","nameZh":"西弗吉尼亚","areaCodes":["304"]},
  "WY": {"name":"Wyoming","nameZh":"怀俄明","areaCodes":["307"]},
}

TAXFREE = ["AK","DE","MT","NH","OR"]

FIPS2ST = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE",
  "11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA",
  "20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN",
  "28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM",
  "36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI",
  "45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA",
  "54":"WV","55":"WI","56":"WY",
}

SKIP_NAME = re.compile(r"(?i)^(county boundary|state boundary|null|unnamed|unknown|private road|alley)$")

def parse_hn(s):
    if not s:
        return None
    m = re.match(r"^(\d+)", str(s).strip())
    if not m:
        return None
    n = int(m.group(1))
    return n if 1 <= n <= 99999 else None

def load_zip_city():
    zmap = {}
    with open(GEONAMES, encoding="utf-8", errors="replace") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 5:
                continue
            zipc, city, st = parts[1], parts[2], parts[4]
            if len(zipc) == 5 and st in STATE_META and zipc not in zmap:
                zmap[zipc] = (city, st)
    print(f"zip->city entries: {len(zmap)}")
    return zmap

def extract_zip(path, zip_city):
    m = re.search(r"tl_2024_(\d{2})\d{3}_addrfeat", os.path.basename(path))
    if not m:
        return
    st = FIPS2ST.get(m.group(1))
    if not st:
        return
    tmp = tempfile.mkdtemp(prefix="shp_")
    try:
        with zipfile.ZipFile(path) as zf:
            zf.extractall(tmp)
        dbf = None
        for root, _, files in os.walk(tmp):
            for fn in files:
                if fn.endswith(".dbf"):
                    dbf = os.path.join(root, fn[:-4])
                    break
            if dbf:
                break
        if not dbf:
            return
        r = shapefile.Reader(dbf)
        fields = [f[0] for f in r.fields[1:]]
        idx = {name: i for i, name in enumerate(fields)}
        need = ["FULLNAME", "ZIPL", "ZIPR", "LFROMHN", "LTOHN", "RFROMHN", "RTOHN"]
        if any(n not in idx for n in need):
            print("missing fields", path)
            return
        for rec in r.iterRecords():
            name = (rec[idx["FULLNAME"]] or "").strip()
            if not name or SKIP_NAME.match(name) or len(name) > 48:
                continue
            for zf_name, a, b in (("ZIPL", "LFROMHN", "LTOHN"), ("ZIPR", "RFROMHN", "RTOHN")):
                zc = (rec[idx[zf_name]] or "").strip()
                if len(zc) != 5 or not zc.isdigit():
                    continue
                lo = parse_hn(rec[idx[a]])
                hi = parse_hn(rec[idx[b]])
                if lo is None and hi is None:
                    lo, hi = 100, 9999
                elif lo is None:
                    lo = hi
                elif hi is None:
                    hi = lo
                if hi < lo:
                    lo, hi = hi, lo
                if hi - lo > 20000:
                    hi = lo + 2000
                city_st = zip_city.get(zc)
                if not city_st:
                    continue
                city, st2 = city_st
                if st2 != st:
                    continue
                yield st, name, city, zc, lo, hi
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

def sample_state(rows, target):
    if len(rows) <= target:
        return rows[:]
    by_city = defaultdict(list)
    for r in rows:
        by_city[r[1]].append(r)
    cities = list(by_city.keys())
    random.shuffle(cities)
    out = []
    ptrs = {c: 0 for c in cities}
    while len(out) < target and cities:
        progress = False
        for c in list(cities):
            i = ptrs[c]
            bucket = by_city[c]
            if i >= len(bucket):
                cities.remove(c)
                continue
            out.append(bucket[i])
            ptrs[c] = i + 1
            progress = True
            if len(out) >= target:
                break
        if not progress:
            break
    return out

def build():
    zip_city = load_zip_city()
    agg = {}
    zips = sorted(f for f in os.listdir(TIGER) if f.endswith(".zip") and "addrfeat" in f)
    print(f"processing {len(zips)} county files...")
    for i, fn in enumerate(zips):
        path = os.path.join(TIGER, fn)
        n = 0
        for st, street, city, zc, lo, hi in extract_zip(path, zip_city):
            key = (st, street, city, zc)
            if key in agg:
                agg[key][0] = min(agg[key][0], lo)
                agg[key][1] = max(agg[key][1], hi)
            else:
                agg[key] = [lo, hi]
            n += 1
        if (i + 1) % 10 == 0 or i == len(zips) - 1:
            print(f"  [{i+1}/{len(zips)}] {fn}: +{n} rows, unique={len(agg)}")

    by_state = defaultdict(list)
    for (st, street, city, zc), (lo, hi) in agg.items():
        by_state[st].append([street, city, zc, lo, hi])
    for st in by_state:
        by_state[st].sort(key=lambda r: (r[1], r[0], r[2]))

    LARGE = {"CA","TX","NY","FL","IL","PA","OH","GA","NC","MI","WA","AZ","CO","MA","NJ","VA","TN","IN","MO","MD","WI","MN","OR"}
    counts = {}
    sampled = {}
    for st, rows in by_state.items():
        if st in TAXFREE:
            t = 3500
        elif st in LARGE:
            t = 1200
        else:
            t = 500
        sampled[st] = sample_state(rows, t)
        counts[st] = len(sampled[st])

    meta_note = {
        "label": "测试样例 / sample test data — not real identity",
        "geoSource": "US Census TIGER/Line ADDRFEAT 2024 (public domain) street+ZIP ranges; city via GeoNames postal (CC-BY). House numbers randomized in-range at generation.",
        "disclaimer": "Not a government endorsement. Not for fraud, impersonation, or ToS violations.",
    }

    def pack_states(codes):
        states = {}
        for code in codes:
            meta = STATE_META[code]
            rows = sampled.get(code, [])
            states[code] = {
                "name": meta["name"],
                "nameZh": meta["nameZh"],
                "areaCodes": meta["areaCodes"],
                "streets": rows,
            }
        return states

    tax = {"meta": meta_note, "states": pack_states(TAXFREE), "taxFreeCodes": TAXFREE}
    usa = {"meta": meta_note, "states": pack_states(sorted(STATE_META.keys()))}

    def write_js(name, obj):
        body = (
            "/** Sample/test dataset — MiniSpaceX Address. 测试样例 — not real identity. */\n"
            "window.MSA_DATA = window.MSA_DATA || {};\n"
            f"window.MSA_DATA[{json.dumps(name)}] = {json.dumps(obj, ensure_ascii=False, separators=(',',':'))};\n"
        )
        path = os.path.join(OUT_DIR, f"{name}.js")
        with open(path, "w", encoding="utf-8") as f:
            f.write(body)
        raw = len(body.encode())
        gz = len(gzip.compress(body.encode(), compresslevel=9))
        print(f"wrote {name}: {raw:,} bytes raw, ~{gz:,} gzipped")

    write_js("us-taxfree", tax)
    write_js("us", usa)

    print("\n=== Record counts per state ===")
    for st in sorted(counts):
        tag = " TAXFREE" if st in TAXFREE else ""
        print(f"  {st}: {counts[st]:,}{tag}")
    print(f"TOTAL unique sampled: {sum(counts.values()):,}")
    print(f"TAXFREE total: {sum(counts.get(s,0) for s in TAXFREE):,}")

if __name__ == "__main__":
    build()
