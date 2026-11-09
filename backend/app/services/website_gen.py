<<<<<<< HEAD
import json
from typing import Dict, Any, List

# Standard NYC Local SEO Matrix matching the Grexa Teardown Case Study
NYC_SERVICES = [
    {
        "id": "balayage-highlights",
        "title": "Balayage & Blonde Highlights",
        "category": "Hair Color",
        "price": "$280",
        "duration": "180 mins",
        "description": "Hand-painted, sun-kissed dimensional lightening customized for your hair texture and tone.",
    },
    {
        "id": "hydrafacial-glow",
        "title": "HydraFacial & Skin Rejuvenation",
        "category": "Skincare",
        "price": "$220",
        "duration": "60 mins",
        "description": "Patented vortex-fusion technology that deeply cleanses, exfoliates, extracts, and hydrates with antioxidant serums.",
    },
    {
        "id": "precision-haircut",
        "title": "Precision Haircut & Blowout",
        "category": "Hair Styling",
        "price": "$125",
        "duration": "60 mins",
        "description": "Bespoke dry and wet cutting techniques tailored to your facial structure, followed by our signature blowout.",
    },
    {
        "id": "keratin-treatment",
        "title": "Keratin Smoothing Treatment",
        "category": "Hair Care",
        "price": "$350",
        "duration": "150 mins",
        "description": "Formaldehyde-free smoothing therapy that eliminates 95% of frizz and seals in moisture for up to 5 months.",
    },
    {
        "id": "bridal-makeup",
        "title": "Bridal Hair & Luxury Makeup",
        "category": "Bridal",
        "price": "$320",
        "duration": "120 mins",
        "description": "High-definition bridal styling and camera-ready makeup designed to last all day and photograph flawlessly.",
    },
]

NYC_NEIGHBORHOODS = [
    {
        "id": "soho",
        "name": "SoHo, Manhattan",
        "borough": "Manhattan",
        "zip": "10012",
        "landmarks": "Prince St, Broadway shopping corridor, and Spring St cobblestones",
        "metro": "N, R, W at Prince St or C, E at Spring St",
    },
    {
        "id": "west-village",
        "name": "West Village, NYC",
        "borough": "Manhattan",
        "zip": "10014",
        "landmarks": "Bleecker St brownstones, Perry St, and Washington Square Park",
        "metro": "1, 2 at Christopher St or A, C, E, B, D, F, M at W 4th St",
    },
    {
        "id": "tribeca",
        "name": "Tribeca, NY",
        "borough": "Manhattan",
        "zip": "10013",
        "landmarks": "Greenwich St luxury lofts, Franklin St, and Hudson River Park",
        "metro": "1, 2, 3 at Chambers St or A, C, E at Canal St",
    },
    {
        "id": "chelsea",
        "name": "Chelsea, Manhattan",
        "borough": "Manhattan",
        "zip": "10011",
        "landmarks": "The High Line park, 8th Avenue galleries, and Chelsea Market",
        "metro": "A, C, E, L at 14th St / 8th Ave or 1 at 23rd St",
    },
    {
        "id": "midtown",
        "name": "Midtown Manhattan, NYC",
        "borough": "Manhattan",
        "zip": "10018",
        "landmarks": "Fifth Avenue luxury district, Bryant Park, and Grand Central",
        "metro": "B, D, F, M, 7 at 42nd St - Bryant Park",
    },
]


def generate_instant_site_html(business_data: Dict[str, Any]) -> str:
    """
    Renders a fast-loading, mobile-first, high-converting HTML microsite
    for a local business with 1-tap WhatsApp booking and LocalBusiness Schema.
    """
    name = business_data.get("name", "Glow & Grace Studio")
    address = business_data.get("address", "482 Broome St, New York, NY 10013")
    phone = business_data.get("phone", "+1 (212) 555-0198")
    clean_phone = phone.replace(" ", "").replace("+", "").replace("(", "").replace(")", "").replace("-", "")
    rating = business_data.get("rating", 4.9)
    reviews_count = business_data.get("reviews_count", 184)
    category = business_data.get("category", "Luxury Hair Salon & MedSpa")

    schema_json = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "name": name,
        "image": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
        "telephone": phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "482 Broome St",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10013",
            "addressCountry": "US",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": str(rating),
            "reviewCount": str(reviews_count),
        },
        "priceRange": "$$$",
    }

    services_html = "".join([
        f"""
        <div style="background:#FFF; padding:24px; border-radius:16px; border:1px solid #EFE4D4; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(42,26,14,0.03);">
          <div>
            <div style="font-size:11px; font-weight:700; color:#B4590B; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">{s['category']} · {s['duration']}</div>
            <h3 style="margin:0 0 6px; font-size:18px; color:#2A1A0E; font-weight:700;">{s['title']}</h3>
            <p style="margin:0; font-size:14px; color:#6B5A4A; max-width:480px;">{s['description']}</p>
          </div>
          <div style="text-align:right; min-width:130px; margin-left:16px;">
            <div style="font-size:22px; font-weight:800; color:#2A1A0E;">{s['price']}</div>
            <a href="https://wa.me/{clean_phone}?text=Hi%20Glow%20%26%20Grace!%20I%20would%20like%20to%20book%20an%20appointment%20for%20{s['title'].replace(' ', '%20')}" style="display:inline-block; margin-top:8px; padding:8px 16px; background:#1F6B45; color:#FFF; text-decoration:none; border-radius:999px; font-size:12px; font-weight:700; transition:background 0.2s;">
              💬 Book on WhatsApp
            </a>
          </div>
        </div>
        """ for s in NYC_SERVICES
=======
from typing import Dict, Any, List

def generate_instant_site_html(business_data: Dict[str, Any]) -> str:
    """
    Renders a fast-loading, SEO-ready standalone HTML website for a local business
    derived directly from its Google listing profile.
    """
    name = business_data.get("name", "Local Premium Business")
    address = business_data.get("address", "Sector 30A, Vashi, Navi Mumbai")
    phone = business_data.get("phone", "+91 98000 00000")
    rating = business_data.get("rating", 4.8)
    reviews_count = business_data.get("reviews_count", 150)
    category = business_data.get("category", "Professional Services")
    services = business_data.get("services", [
        {"title": "Signature Consultation & Care", "price": "₹1,500"},
        {"title": "Comprehensive Treatment Package", "price": "₹4,200"},
        {"title": "VIP Express Service", "price": "₹2,800"},
    ])

    services_html = "".join([
        f"""
        <div style="background:#FFF; padding:24px; border-radius:16px; border:1px solid #EFE4D4; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin:0 0 6px; font-size:18px; color:#2A1A0E;">{s['title']}</h3>
            <p style="margin:0; font-size:14px; color:#6B5A4A;">Top-rated localized service delivered with certified care.</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:20px; font-weight:800; color:#B4590B;">{s['price']}</div>
            <a href="https://wa.me/{phone.replace(' ', '').replace('+', '')}?text=Hi%2C%20I%20would%20like%20to%20book%20{s['title'].replace(' ', '%20')}" style="display:inline-block; margin-top:8px; padding:6px 14px; background:#B4590B; color:#FFF; text-decoration:none; border-radius:999px; font-size:12px; font-weight:700;">Book on WhatsApp</a>
          </div>
        </div>
        """ for s in services
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
    ])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<<<<<<< HEAD
  <title>{name} — Premier Salon & Aesthetics in SoHo, Manhattan</title>
  <meta name="description" content="Experience bespoke hair coloring, HydraFacials, and bridal styling at {name}. Rated {rating} stars by {reviews_count}+ verified clients in NYC.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {json.dumps(schema_json, indent=2)}
  </script>
  <style>
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:'Plus Jakarta Sans',sans-serif; background:#FFFBF5; color:#2A1A0E; line-height:1.5; }}
    .container {{ max-width:860px; margin:0 auto; padding:40px 20px; }}
    .badge {{ display:inline-block; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#B4590B; background:#FBF3E6; padding:6px 14px; border-radius:999px; border:1px solid #EFE4D4; }}
    .btn-wa {{ background:#1F6B45; color:#FFF; padding:16px 32px; border-radius:999px; text-decoration:none; font-weight:800; font-size:16px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 8px 24px rgba(31,107,69,0.25); }}
=======
  <title>{name} — Official Website & Bookings</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ margin:0; font-family:'Plus Jakarta Sans',sans-serif; background:#FFFBF5; color:#2A1A0E; line-height:1.5; }}
    .container {{ max-width:860px; margin:0 auto; padding:40px 20px; }}
    .btn-wa {{ background:#25D366; color:#FFF; padding:14px 28px; border-radius:999px; text-decoration:none; font-weight:800; display:inline-block; box-shadow:0 8px 24px rgba(37,211,102,0.25); }}
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
  </style>
</head>
<body>
  <div class="container">
<<<<<<< HEAD
    <header style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EFE4D4; padding-bottom:24px; flex-wrap:wrap; gap:16px;">
      <div>
        <span class="badge">{category}</span>
        <h1 style="margin:10px 0 6px; font-size:32px; font-weight:800; color:#2A1A0E;">{name}</h1>
        <p style="margin:0; font-size:14px; color:#6B5A4A;">📍 {address} · 📞 {phone}</p>
      </div>
      <div style="background:#FBF3E6; padding:14px 22px; border-radius:14px; text-align:center; border:1px solid #EFE4D4;">
        <div style="font-size:26px; font-weight:800; color:#B4590B;">{rating} ★★★★★</div>
        <div style="font-size:12px; font-weight:700; color:#6B5A4A;">{reviews_count} Verified Google Reviews</div>
      </div>
    </header>

    <section style="margin:54px 0; text-align:center;">
      <div style="display:inline-block; background:#E8F5E9; color:#1F6B45; font-size:12px; font-weight:700; padding:6px 14px; border-radius:999px; margin-bottom:16px;">
        ⚡ Instant WhatsApp Concierge & Bookings
      </div>
      <h2 style="font-size:40px; font-weight:800; margin:0 0 16px; letter-spacing:-0.02em;">Effortless Luxury Care in SoHo</h2>
      <p style="font-size:17px; color:#5C4A3A; max-width:580px; margin:0 auto 32px; line-height:1.6;">
        Skip the phone tag. Message our master stylists directly on WhatsApp for real-time consultation, transparent pricing, and instant calendar confirmation.
      </p>
      <a class="btn-wa" href="https://wa.me/{clean_phone}?text=Hi%20Glow%20%26%20Grace!%20I%20found%20your%20website%20and%20would%20like%20to%20book%20an%20appointment">
        <span>💬</span> Chat & Book Instantly on WhatsApp
      </a>
      <div style="font-size:12px; color:#8A7A6A; margin-top:12px;">Average response time: <strong>under 15 seconds</strong> · Open 7 days</div>
    </section>

    <section style="margin:48px 0;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px;">
        <div>
          <h2 style="font-size:24px; font-weight:800; margin:0;">Signature Salon Menu</h2>
          <p style="margin:4px 0 0; font-size:14px; color:#6B5A4A;">Transparent NYC pricing with complimentary botanical refreshment and consultation.</p>
        </div>
      </div>
=======
    <header style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EFE4D4; padding-bottom:20px;">
      <div>
        <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#B4590B;">{category}</span>
        <h1 style="margin:4px 0; font-size:32px; font-weight:800;">{name}</h1>
        <p style="margin:0; font-size:14px; color:#6B5A4A;">📍 {address} · 📞 {phone}</p>
      </div>
      <div style="background:#FBF3E6; padding:12px 20px; border-radius:14px; text-align:center; border:1px solid #EFE4D4;">
        <div style="font-size:24px; font-weight:800; color:#B4590B;">{rating} ★</div>
        <div style="font-size:12px; font-weight:600; color:#6B5A4A;">{reviews_count} Google Reviews</div>
      </div>
    </header>

    <section style="margin:48px 0; text-align:center;">
      <h2 style="font-size:36px; font-weight:800; margin-bottom:12px;">Instant Appointment & Inquiry</h2>
      <p style="font-size:16px; color:#5C4A3A; max-width:560px; margin:0 auto 28px;">Connect directly with our team on WhatsApp for immediate booking confirmations, price quotes, and service inquiries.</p>
      <a class="btn-wa" href="https://wa.me/{phone.replace(' ', '').replace('+', '')}?text=Hi%2C%20I%20found%20you%20on%20your%20website%20and%20would%20like%20to%20book%20an%20appointment">💬 Book Instantly on WhatsApp</a>
    </section>

    <section style="margin:48px 0;">
      <h2 style="font-size:24px; font-weight:800; margin-bottom:20px;">Popular Services</h2>
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
      <div style="display:flex; flex-direction:column; gap:16px;">
        {services_html}
      </div>
    </section>

<<<<<<< HEAD
    <footer style="margin-top:60px; padding-top:24px; border-top:1px solid #EFE4D4; text-align:center; font-size:13px; color:#8A7A6A;">
      <p style="margin:0 0 8px;"><strong>{name}</strong> · 482 Broome St, New York, NY 10013 · (212) 555-0198</p>
      <p style="margin:0; font-size:11px;">Powered by Golden Reindeer Autonomous Flywheel · Programmatic Local SEO Engine</p>
    </footer>
  </div>
</body>
</html>
"""


def generate_local_seo_page_html(
    business_data: Dict[str, Any],
    service: Dict[str, Any],
    neighborhood: Dict[str, Any],
) -> str:
    """
    Renders a programmatic local landing page optimized for high Google Search intent:
    Target: "[Service] in [Neighborhood], NYC"
    Includes localized landmarks, transportation proximity, LocalBusiness schema, and WhatsApp conversion.
    """
    biz_name = business_data.get("name", "Glow & Grace Studio")
    phone = business_data.get("phone", "+1 (212) 555-0198")
    clean_phone = phone.replace(" ", "").replace("+", "").replace("(", "").replace(")", "").replace("-", "")
    service_title = service["title"]
    neigh_name = neighborhood["name"]
    landmarks = neighborhood["landmarks"]
    metro = neighborhood["metro"]
    zip_code = neighborhood["zip"]

    # Schema JSON-LD
    schema_json = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": service_title,
        "provider": {
            "@type": "BeautySalon",
            "name": biz_name,
            "telephone": phone,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "482 Broome St",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "postalCode": zip_code,
                "addressCountry": "US",
            },
        },
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": neigh_name,
        },
        "offers": {
            "@type": "Offer",
            "price": service["price"].replace("$", ""),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
        },
    }

    wa_msg = f"Hi {biz_name}! I found your {service_title} service for {neigh_name} and would like to check availability."
    wa_url = f"https://wa.me/{clean_phone}?text={wa_msg.replace(' ', '%20')}"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top-Rated {service_title} in {neigh_name} | {biz_name}</title>
  <meta name="description" content="Looking for expert {service_title} in {neigh_name}? Located near {landmarks}. Book your personalized session at {biz_name} in under 30 seconds via WhatsApp.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {json.dumps(schema_json, indent=2)}
  </script>
  <style>
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:'Plus Jakarta Sans',sans-serif; background:#FFFBF5; color:#2A1A0E; line-height:1.6; }}
    .container {{ max-width:840px; margin:0 auto; padding:36px 20px; }}
    .pill {{ display:inline-block; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#8A4408; background:#F6E7CF; padding:6px 14px; borderRadius:999px; }}
    .btn-wa {{ background:#1F6B45; color:#FFF; padding:16px 32px; border-radius:999px; text-decoration:none; font-weight:800; font-size:16px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 8px 24px rgba(31,107,69,0.22); }}
    .card {{ background:#FFF; border:1px solid #EFE4D4; border-radius:18px; padding:24px; margin-bottom:20px; box-shadow:0 2px 10px rgba(42,26,14,0.03); }}
  </style>
</head>
<body>
  <div class="container">
    <nav style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:16px; border-bottom:1px solid #EFE4D4;">
      <a href="/" style="font-weight:800; font-size:16px; color:#2A1A0E; text-decoration:none;">✨ {biz_name}</a>
      <span style="font-size:13px; color:#6B5A4A; font-weight:600;">Serving {neigh_name} · NYC</span>
    </nav>

    <header style="margin-bottom:36px;">
      <div class="pill">Localized Neighborhood Special · {neighborhood['borough']}</div>
      <h1 style="font-size:38px; font-weight:800; color:#2A1A0E; margin:14px 0 12px; line-height:1.2;">
        {service_title} in {neigh_name}
      </h1>
      <p style="font-size:18px; color:#5C4A3A; margin:0 0 24px;">
        Discover luxury, tailored {service['category'].lower()} services right by {landmarks}.
      </p>
      
      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <a class="btn-wa" href="{wa_url}">
          <span>💬</span> Book {service_title} on WhatsApp
        </a>
        <div style="font-size:15px; font-weight:700; color:#B4590B;">
          Starts at {service['price']} · {service['duration']}
        </div>
      </div>
    </header>

    <div class="card">
      <h3 style="margin:0 0 12px; font-size:18px; font-weight:700;">Why Clients in {neigh_name} Choose {biz_name}</h3>
      <p style="margin:0 0 16px; color:#5C4A3A; font-size:15px;">
        {service['description']} Crafted specifically for clients living or working near {landmarks}. We prioritize healthy hair integrity, personalized consultations, and flexible scheduling.
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:12px; border-top:1px solid #F5EFE6;">
        <div>
          <div style="font-size:12px; font-weight:700; color:#8A4408; text-transform:uppercase;">Subway & Transit</div>
          <div style="font-size:14px; color:#2A1A0E; margin-top:2px;">🚇 {metro}</div>
        </div>
        <div>
          <div style="font-size:12px; font-weight:700; color:#8A4408; text-transform:uppercase;">Neighborhood Landmark</div>
          <div style="font-size:14px; color:#2A1A0E; margin-top:2px;">📍 Steps from {landmarks}</div>
        </div>
      </div>
    </div>

    <div class="card" style="background:#FBF3E6; border-color:#EFE4D4;">
      <h3 style="margin:0 0 8px; font-size:18px; font-weight:700; color:#8A4408;">Verified Client Review from {neigh_name}</h3>
      <p style="margin:0 0 10px; font-style:italic; font-size:15px; color:#2A1A0E;">
        "Finding a trustworthy place for {service_title} in {neigh_name} used to take weeks. Glow & Grace was recommended by a friend on Perry St. The consultation was thorough and the result was stunning. Being able to text on WhatsApp to confirm everything made it so effortless!"
      </p>
      <div style="font-size:13px; font-weight:700; color:#B4590B;">★★★★★ — Emma R., {neigh_name} Resident</div>
    </div>

    <div style="text-align:center; margin:40px 0;">
      <h3 style="font-size:22px; font-weight:800; margin:0 0 8px;">Ready to Book Your Session?</h3>
      <p style="color:#6B5A4A; font-size:14px; margin:0 0 20px;">No long waitlists. Real-time availability verified instantly by our AI concierge.</p>
      <a class="btn-wa" href="{wa_url}">
        <span>💬</span> Reserve Your {neigh_name} Slot Now
      </a>
    </div>

    <footer style="margin-top:50px; padding-top:20px; border-top:1px solid #EFE4D4; text-align:center; font-size:12px; color:#8A7A6A;">
      <p style="margin:0 0 4px;">{biz_name} · Localized Programmatic SEO Landing Page</p>
      <p style="margin:0;">Target Keyword: <strong>{service_title.lower()} {neigh_name.lower()}</strong> · Zip: {zip_code}</p>
=======
    <footer style="margin-top:60px; padding-top:24px; border-top:1px solid #EFE4D4; text-align:center; font-size:12px; color:#8A7A6A;">
      Powered by Golden Reindeer AI Platform · Official listing website
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
    </footer>
  </div>
</body>
</html>
"""
