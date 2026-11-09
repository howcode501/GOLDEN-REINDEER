import io
import qrcode

def review_qr_png(place_id: str) -> bytes:
    """Generates a high-resolution review QR code PNG directing to Google Review prompt."""
    url = f"https://search.google.com/local/writereview?placeid={place_id}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#2A1A0E", back_color="#FFFBF5")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
