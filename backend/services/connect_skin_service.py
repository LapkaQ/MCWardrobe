from PIL import Image
import io
import base64
from fastapi import HTTPException

def cut_skins(image):
    # Upewnij się, że obraz ma kanał alfa
    if image.mode != 'RGBA':
        image = image.convert("RGBA")

    data = image.getdata()
    new_data = []

    for y in range(image.height):
        for x in range(image.width):
            if (0 <= x < 64 and 32 <= y < 48) or \
               (0 <= x < 16 and 32 <= y < 64) or \
               (48 <= x < 64 and 32 <= y < 64):
                new_data.append((0, 0, 0, 0))  # Przezroczysty piksel
            else:
                new_data.append(data.getpixel((x, y)))

    image.putdata(new_data)
    return image
def cut_clotches(image):
    # Upewnij się, że obraz ma kanał alfa
    if image.mode != 'RGBA':
        image = image.convert("RGBA")

    data = image.getdata()
    new_data = []

    for y in range(image.height):
        for x in range(image.width):
            if (47 <= x < 48 and 16 <= y < 20) or \
               (54 <= x < 56 and 20 <= y < 32) or \
               (39 <= x < 40 and 47 <= y < 52) or \
                (46 <= x < 48 and 52 <= y < 64):
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(data.getpixel((x, y)))

    image.putdata(new_data)
    return image
def overlay_images(base_image, overlay_image):
    # Upewnij się, że oba obrazy mają kanał alfa
    if base_image.mode != 'RGBA':
        base_image = base_image.convert("RGBA")
    if overlay_image.mode != 'RGBA':
        overlay_image = overlay_image.convert("RGBA")

    # Nakładanie obrazów
    base_image.paste(overlay_image, (0, 0), overlay_image)
    return base_image

def cut_and_overlay_skins(image1_bytes, image2_bytes, model):
    try:
        # Otwórz obrazy z danych binarnych
        image1 = Image.open(io.BytesIO(image1_bytes))
        image2 = Image.open(io.BytesIO(image2_bytes))

        # Przetwórz pierwszy obraz
        image1 = cut_skins(image1)
        if (model != "classic"):
            image2 = cut_clotches(image2)
        # Nakładanie drugiego obrazu na pierwszy
        result_image = overlay_images(image1, image2)

        # Zapisz wynikowy obraz do bufora
        buf = io.BytesIO()
        result_image.save(buf, format="PNG")
        buf.seek(0)

        # Zwróć wynikowy obraz w base64
        return {"image": base64.b64encode(buf.getvalue()).decode('utf-8')}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Błąd przetwarzania obrazów: {str(e)}")