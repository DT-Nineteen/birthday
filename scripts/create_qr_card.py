from __future__ import annotations

import random
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
URL = "https://birthday.aiden190901.chatgpt.site/"
OUT = ROOT / "images" / "birthday-qr-card.png"
PORTRAIT = ROOT / "images" / "unnamed.png"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    for path in [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts/arial.ttf"),
    ]:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    image = image.convert("RGBA")
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def add_centered(draw: ImageDraw.ImageDraw, text: str, y: int, fnt: ImageFont.FreeTypeFont, fill: tuple[int, int, int]) -> None:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    draw.text(((1240 - (bbox[2] - bbox[0])) / 2, y), text, font=fnt, fill=fill)


def main() -> None:
    random.seed(807)

    width, height = 1240, 2080
    card = Image.new("RGB", (width, height), "#f7eadb")
    pixels = card.load()
    top = (250, 236, 219)
    bottom = (242, 206, 170)
    for y in range(height):
        t = y / (height - 1)
        color = tuple(round(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(width):
            pixels[x, y] = color

    draw = ImageDraw.Draw(card)
    ink = (91, 54, 35)
    soft = (183, 112, 70)
    gold = (211, 151, 74)
    cream = (255, 248, 238)

    for _ in range(95):
        x = random.randint(40, width - 40)
        y = random.randint(40, height - 40)
        r = random.randint(2, 7)
        color = random.choice([(238, 176, 89), (205, 127, 79), (255, 244, 214), (138, 91, 58)])
        draw.ellipse((x - r, y - r, x + r, y + r), fill=color)

    for x in range(-80, width + 80, 118):
        y = 92 + (x // 118 % 2) * 24
        draw.polygon([(x, y), (x + 45, y + 42), (x + 90, y)], fill=(224, 132, 83))
        draw.line((x, y, x + 90, y), fill=ink, width=3)

    title_font = font("ARLRDBD.TTF", 74)
    subtitle_font = font("arial.ttf", 32)
    small_font = font("arial.ttf", 26)
    label_font = font("arialbd.ttf", 34)

    add_centered(draw, "Hibeo Birthday", 165, title_font, ink)
    add_centered(draw, "Scan to open the birthday surprise", 260, subtitle_font, (115, 72, 46))
    add_centered(draw, "07 August", 312, small_font, soft)

    portrait_size = (760, 760)
    portrait = cover(Image.open(PORTRAIT), portrait_size)
    portrait = portrait.filter(ImageFilter.UnsharpMask(radius=1, percent=110, threshold=3))
    frame = Image.new("RGBA", (portrait_size[0] + 36, portrait_size[1] + 36), (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle((0, 0, frame.width - 1, frame.height - 1), radius=58, fill=(255, 251, 244, 255))
    frame_draw.rounded_rectangle((12, 12, frame.width - 13, frame.height - 13), radius=48, outline=(195, 119, 72, 255), width=5)
    frame.paste(portrait, (18, 18), rounded_mask(portrait_size, 42))
    card.paste(frame.convert("RGB"), ((width - frame.width) // 2, 390), frame)

    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#2f2118", back_color="#fffaf2").convert("RGBA")
    qr_img = qr_img.resize((520, 520), Image.Resampling.NEAREST)

    qr_frame = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    qr_draw = ImageDraw.Draw(qr_frame)
    qr_draw.rounded_rectangle((0, 0, 639, 639), radius=56, fill=(255, 250, 242, 255))
    qr_draw.rounded_rectangle((18, 18, 621, 621), radius=44, outline=(191, 116, 68, 255), width=6)
    qr_frame.alpha_composite(qr_img, (60, 58))
    card.paste(qr_frame.convert("RGB"), ((width - 640) // 2, 1198), qr_frame)

    add_centered(draw, "Open birthday card", 1876, label_font, ink)
    add_centered(draw, "birthday.aiden190901.chatgpt.site", 1930, small_font, (123, 77, 49))

    draw.rounded_rectangle((92, 92, width - 92, height - 92), radius=60, outline=(161, 98, 62), width=4)
    draw.rounded_rectangle((118, 118, width - 118, height - 118), radius=44, outline=(255, 247, 232), width=3)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.save(OUT, "PNG")
    print(OUT)


if __name__ == "__main__":
    main()
