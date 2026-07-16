#!/usr/bin/env python3
"""Import KoreParts price list Excel into lib/bot-products.json."""

from __future__ import annotations

import collections
import json
import re
import sys
from pathlib import Path

try:
    import openpyxl
except ImportError:
    print("pip install openpyxl", file=sys.stderr)
    raise

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SRC = Path(r"C:\Users\Windows\Downloads\2_5357174925197089460.xlsx")
OUT = ROOT / "lib" / "bot-products.json"
# Наценка к розничной цене из прайса (30%)
MARKUP = 1.30

# Themed Unsplash images (site already allows images.unsplash.com)
IMG = {
    "shock": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80",
    "brake": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    "filter": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80",
    "engine": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&q=80",
    "spark": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&q=80",
    "electric": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    "oil": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80",
    "body": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80",
    "default": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80",
}

# First matching rule wins. keywords are substrings of normalized name.
# (keywords, category, image_key)
RULES: list[tuple[list[str], str, str]] = [
    (["амортизатор багажника"], "chassis", "shock"),
    (["амортизатор"], "chassis", "shock"),
    (["колодка", "колодки тормоз", "тормозная колодка"], "brakes", "brake"),
    (["диск тормоз"], "brakes", "brake"),
    (["суппорт"], "brakes", "brake"),
    (["тормозной шланг", "шланг тормоз"], "brakes", "brake"),
    (["трос ручного", "ручник", "стояночн"], "brakes", "brake"),
    (["тормозной цилиндр", "главный тормозной", "вакуумный усилитель"], "brakes", "brake"),
    (["электромодулятор"], "brakes", "electric"),
    # датчики раньше «фильтра» — иначе «датчик топливного фильтра» уходит в filters
    (["датчик кислород", "лямбда"], "electric", "electric"),
    (["датчик abs", "датчик абс"], "electric", "electric"),
    (["датчик"], "electric", "electric"),
    (["фильтр салона", "салонный фильтр"], "filters", "filter"),
    (["фильтр воздушный", "воздушный фильтр"], "filters", "filter"),
    (["фильтр масляный", "масляный фильтр"], "filters", "filter"),
    (["фильтр топливный", "топливный фильтр"], "filters", "filter"),
    (["фильтр"], "filters", "filter"),
    (["катушка зажигания"], "electric", "electric"),
    (["свеча зажигания", "свеча накаливания", "свеча"], "engine", "spark"),
    (["генератор"], "electric", "electric"),
    (["стартер"], "electric", "electric"),
    (["шлейф"], "electric", "electric"),
    (["электропроводка", "проводка", "кабель", "фишка"], "electric", "electric"),
    (["подрулевой переключатель", "переключатель"], "electric", "electric"),
    (["электромагнитный клапан"], "electric", "electric"),
    (["блок управления", "блок кнопок", "блок реле"], "electric", "electric"),
    (["модуль"], "electric", "electric"),
    (["актуатор турбины", "турбокомпрессор", "турбин"], "engine", "engine"),
    (["компрессор кондиционера", "кондиционер"], "electric", "electric"),
    (["насос охл", "помпа", "водяной насос"], "engine", "engine"),
    (["насос топливный", "топливный насос", "модуль топливного"], "engine", "engine"),
    (["насос гур", "гур"], "chassis", "shock"),
    (["насос"], "engine", "engine"),
    (["форсунка"], "engine", "engine"),
    (["прокладка"], "engine", "filter"),
    (["цепь грм", "успокоитель цепи", "натяжитель цепи"], "engine", "engine"),
    (["рем/к грм", "комплект грм", "ремень грм"], "engine", "engine"),
    (["ремень приводной", "ремень"], "engine", "engine"),
    (["ролик", "натяжитель"], "engine", "engine"),
    (["вкладыши"], "engine", "engine"),
    (["кольца поршневые", "поршень", "шатун", "коленчатый", "маховик", "распредвал"], "engine", "engine"),
    (["колпачок маслосъемный", "колпачок"], "engine", "filter"),
    (["сальник"], "engine", "filter"),
    (["шкив"], "engine", "engine"),
    (["корпус термостата", "термостат"], "engine", "engine"),
    (["поддон масляный", "поддон"], "engine", "oil"),
    (["шестерня", "звездочка"], "engine", "engine"),
    (["клапан"], "engine", "engine"),
    (["дроссель"], "engine", "engine"),
    (["гидрокомпенсатор"], "engine", "engine"),
    (["радиатор", "патрубок"], "engine", "engine"),
    (["рем/к двс", "ремкомплект"], "engine", "engine"),
    (["двигатель в сборе", "двигатель "], "engine", "engine"),
    (["масло ", "масло мотор", "atf", "антифриз", "жидкость"], "oils", "oil"),
    (["рулевая рейка"], "chassis", "shock"),
    (["наконечник рулевой"], "chassis", "shock"),
    (["тяга рулевая"], "chassis", "shock"),
    (["рычаг"], "chassis", "shock"),
    (["линк"], "chassis", "shock"),
    (["сайлент"], "chassis", "shock"),
    (["втулка стабилизатора", "стабилизатор", "втулка"], "chassis", "shock"),
    (["шаровая"], "chassis", "shock"),
    (["ступица"], "chassis", "shock"),
    (["подшипник"], "chassis", "shock"),
    (["кулак поворотный"], "chassis", "shock"),
    (["привод", "приводной вал", "шрус", "кардан"], "chassis", "shock"),
    (["подушка крепления", "опора двигателя", "опора кпп"], "chassis", "shock"),
    (["болт развальный"], "chassis", "shock"),
    (["пружина"], "chassis", "shock"),
    (["фара", "птф", "противотуман", "стоп-сигнал", "повторитель", "лампа"], "body", "body"),
    (["зеркало"], "body", "body"),
    (["замок"], "body", "body"),
    (["мотор стеклоподъемника", "стеклоподъемник"], "body", "body"),
    (["механизм стеклоочистителя", "стеклоочистител", "щетки"], "body", "filter"),
    (["мотор бачка", "омывател", "моторчик"], "body", "filter"),
    (["бампер", "крыло", "капот", "решетка", "молдинг", "накладка", "ручка"], "body", "body"),
    (["муфта", "корзина сцепления", "сцепление"], "engine", "engine"),
]

# keyword -> brand, model_id  (order: more specific first)
MODELS: list[tuple[list[str], str, str]] = [
    (["кайрон", "kyron"], "ssangyong", "kyron"),
    (["рекстон", "rexton"], "ssangyong", "rexton"),
    (["корандо", "korando", "нью актион", "new actyon"], "ssangyong", "korando"),
    (["актион", "actyon"], "ssangyong", "actyon"),
    (["родиус", "rodius", "stavic"], "ssangyong", "rodius"),
    (["ssy", "ssangyong", "сангйонг"], "ssangyong", "other"),
    (["carnival", "карнивал"], "kia", "carnival"),
    (["sportage", "спортаж"], "kia", "sportage"),
    (["sorento", "соренто"], "kia", "sorento"),
    (["seltos", "селтос"], "kia", "seltos"),
    (["kx7"], "kia", "kx7"),
    (["k5", "оптима", "optima"], "kia", "k5"),
    (["soul", "соул"], "kia", "soul"),
    (["ceed", "сид"], "kia", "ceed"),
    (["cerato", "церато", "forte", "форте"], "kia", "cerato"),
    (["rio", "рио"], "kia", "rio"),
    (["stonic", "стоник"], "kia", "stonic"),
    (["picanto", "пиканто"], "kia", "picanto"),
    (["палисад", "palisade"], "hyundai", "palisade"),
    (["santa fe", "santafe", "сантафе", "санта фе", "санта-фе"], "hyundai", "santafe"),
    (["tucson", "туксон", "ix35"], "hyundai", "tucson"),
    (["creta", "крета", "ix25"], "hyundai", "creta"),
    (["solaris", "солярис"], "hyundai", "solaris"),
    (["elantra", "элантра", "аванта", "avante"], "hyundai", "elantra"),
    (["sonata", "соната"], "hyundai", "sonata"),
    (["starex", "старекс", "h-1", " grand starex"], "hyundai", "starex"),
    (["staria", "стария"], "hyundai", "staria"),
    (["getz", "гетц"], "hyundai", "getz"),
    (["accent", "акцент"], "hyundai", "accent"),
    (["veloster", "велостер"], "hyundai", "veloster"),
    (["porter", "портер"], "hyundai", "porter"),
    (["i20"], "hyundai", "i20"),
    (["i30"], "hyundai", "i30"),
    (["i40"], "hyundai", "i40"),
    (["genesis g70", "g70"], "genesis", "g70"),
    (["genesis g80", "g80"], "genesis", "g80"),
    (["gv70"], "genesis", "gv70"),
    (["gv80"], "genesis", "gv80"),
    (["genesis"], "genesis", "other"),
]


def norm(s: str) -> str:
    s = s.lower().replace("ё", "е")
    return re.sub(r"\s+", " ", s).strip()


def norm_ru(s: str) -> str:
    """Normalize + fix Latin lookalikes mixed into Russian words (Cтабилизатор)."""
    s = norm(s)
    # only map latin letters that often replace cyrillic in this price list
    trans = str.maketrans("acekopxyhmbt", "асекорхунмвт")
    return s.translate(trans)


def detect_category_image(name: str) -> tuple[str, str]:
    n = norm_ru(name)
    for keys, cat, imgk in RULES:
        for k in keys:
            if k in n:
                return cat, IMG.get(imgk, IMG["default"])
    return "engine", IMG["default"]


def detect_brand_model(name: str) -> tuple[str, str]:
    n_lat = norm(name)  # keep Latin brand tokens: kia, hyundai, ssy
    n_ru = norm_ru(name)
    has_kia = bool(re.search(r"\bkia\b|\bкиа\b", n_lat)) or "киа" in n_ru
    has_hyundai = bool(re.search(r"\bhyundai\b|хендай|хундай", n_lat)) or "хендай" in n_ru
    has_ssy = "ssy" in n_lat or "ssang" in n_lat or "санг" in n_ru

    matches: list[tuple[str, str, str]] = []
    for keys, brand, mid in MODELS:
        for k in keys:
            if k in n_lat or k in n_ru:
                matches.append((brand, mid, k))
                break

    if matches:
        if has_ssy:
            for brand, mid, _ in matches:
                if brand == "ssangyong":
                    return brand, mid
        if has_kia:
            for brand, mid, _ in matches:
                if brand == "kia":
                    return brand, mid
        if has_hyundai:
            for brand, mid, _ in matches:
                if brand == "hyundai":
                    return brand, mid

        best = None
        best_pos = 10**9
        for brand, mid, k in matches:
            if mid == "other":
                continue
            pos = n_lat.find(k)
            if pos < 0:
                pos = n_ru.find(k)
            if 0 <= pos < best_pos:
                best_pos = pos
                best = (brand, mid)
        if best:
            return best
        return matches[0][0], matches[0][1]

    if has_ssy:
        return "ssangyong", "other"
    if has_kia:
        return "kia", "other"
    if has_hyundai:
        return "hyundai", "other"
    return "hyundai", "other"


def clean_name(name: str) -> str:
    n = re.sub(r",\s*шт\.?\s*$", "", name, flags=re.I).strip()
    n = re.sub(r"\s*[#@]+\s*$", "", n).strip()
    return re.sub(r"\s+", " ", n)


def make_id(oem: str, used: set[str]) -> str:
    base = re.sub(r"[^a-zA-Z0-9]+", "-", oem).strip("-").lower() or "p"
    cid = base
    i = 2
    while cid in used:
        cid = f"{base}-{i}"
        i += 1
    used.add(cid)
    return cid


def make_desc(name: str, brand: str, stock: int) -> str:
    titles = {
        "hyundai": "Hyundai",
        "kia": "Kia",
        "genesis": "Genesis",
        "ssangyong": "SsangYong",
    }
    bt = titles.get(brand, brand)
    stock_txt = "В наличии" if stock > 0 else "Под заказ"
    return f"{clean_name(name)}. {bt}. {stock_txt}. Подбор по OEM-артикулу."


def parse_rows(src: Path) -> list[tuple[str, str, int, int]]:
    wb = openpyxl.load_workbook(src, data_only=True)
    ws = wb.active
    rows: list[tuple[str, str, int, int]] = []
    for i, row in enumerate(ws.iter_rows(values_only=True), 1):
        if i < 7:
            continue
        art, name, price, stock = row[0], row[4], row[13], row[14]
        if not art or not name or price is None or not isinstance(price, (int, float)):
            continue
        art_s = str(art).strip()
        name_s = str(name).strip()
        if art_s == name_s:
            continue
        if art_s.lower().startswith("артикул") or "номенклатура" in art_s.lower():
            continue
        st = int(stock) if stock is not None and str(stock).strip() != "" else 0
        pr = int(price) if isinstance(price, int) else int(float(price))
        # +30% к цене из прайса, округление до целых рублей
        pr = max(1, int(round(pr * MARKUP)))
        rows.append((art_s, name_s, pr, st))
    return rows


def build_products(rows: list[tuple[str, str, int, int]]) -> list[dict]:
    used: set[str] = set()
    products: list[dict] = []
    for art, name, price, stock in rows:
        brand, model = detect_brand_model(name)
        cat, image = detect_category_image(name)
        products.append(
            {
                "id": make_id(art, used),
                "name": clean_name(name),
                "brand": brand,
                "model": model,
                "category": cat,
                "price": price,
                "oem": art,
                "stock": stock,
                "desc": make_desc(name, brand, stock),
                "image": image,
                "popular": False,
            }
        )

    # mark ~80 hits: high stock, reasonable price
    scored = sorted(products, key=lambda p: (-p["stock"], p["price"]))
    hits = 0
    for p in scored:
        if p["stock"] >= 15 and p["price"] <= 20000 and hits < 80:
            p["popular"] = True
            hits += 1
    return products


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.exists():
        raise SystemExit(f"File not found: {src}")

    rows = parse_rows(src)
    products = build_products(rows)

    cats = collections.Counter(p["category"] for p in products)
    brands = collections.Counter(p["brand"] for p in products)
    models = collections.Counter(f"{p['brand']}/{p['model']}" for p in products)
    images = collections.Counter(p["image"] for p in products)

    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"products: {len(products)}")
    print(f"cats: {dict(cats)}")
    print(f"brands: {dict(brands)}")
    print(f"top models: {models.most_common(20)}")
    print(f"unique images: {len(images)}")
    print(f"popular: {sum(1 for p in products if p['popular'])}")
    print(f"wrote: {OUT} ({OUT.stat().st_size / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
