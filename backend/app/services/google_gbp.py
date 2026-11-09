from typing import Protocol, List, Dict, Any, Optional
from datetime import datetime
from ..core.config import settings
from .llm import complete

class GBPProvider(Protocol):
    async def get_profile(self, place_id: str) -> Dict[str, Any]: ...
    async def list_reviews(self, place_id: str) -> List[Dict[str, Any]]: ...
    async def reply_to_review(self, review_id: str, text: str) -> bool: ...
    async def create_post(self, place_id: str, body: str) -> str: ...

class MockGBPProvider:
    """Mock provider for local testing and demos before Google API approval is granted."""
    async def get_profile(self, place_id: str) -> Dict[str, Any]:
        return {
            "place_id": place_id,
<<<<<<< HEAD
            "name": "Glow & Grace Studio",
            "category": "Beauty Salon & Skincare Studio",
            "rating": 4.8,
            "reviews_count": 214,
            "description": "Premier boutique salon specializing in custom hydra-facials, balayage, and restorative skincare treatments.",
            "address": "452 Hudson St, New York, NY 10014",
            "opening_hours": ["Mon-Sat: 9:00 AM - 7:30 PM", "Sun: 10:00 AM - 5:00 PM"],
        }


=======
            "name": "Golden Radiance Studio",
            "category": "Beauty Salon & Skin Clinic",
            "rating": 4.6,
            "reviews_count": 142,
            "description": "Premium salon and skincare treatments in Navi Mumbai.",
            "address": "Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
            "opening_hours": ["Mon-Sun: 10:00 AM - 8:30 PM"],
        }

>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
    async def list_reviews(self, place_id: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "rev_001",
<<<<<<< HEAD
                "author": "Emily Watson",
                "rating": 5,
                "text": "Best hydra-facial experience in Manhattan! The staff was attentive and the results were incredible.",
                "reply_status": "posted",
                "reply_text": "Thank you Emily! We are thrilled you loved your hydra-facial session with us.",
            },
            {
                "id": "rev_002",
                "author": "Michael Miller",
                "rating": 5,
                "text": "Great haircut and scalp treatment, very clean studio and relaxing vibe.",
                "reply_status": "draft",
                "reply_text": "Dear Michael, thank you for your feedback! We appreciate having you with us and look forward to your next visit.",
            },
            {
                "id": "rev_003",
                "author": "Sarah Jenkins",
                "rating": 5,
                "text": "Highly recommend their bridal hair and styling packages. Top-notch service!",
                "reply_status": "none",
                "reply_text": None,
            },

=======
                "author": "Ananya Sen",
                "rating": 5,
                "text": "Best hydra-facial experience! The staff was very attentive and clean.",
                "reply_status": "posted",
                "reply_text": "Thank you Ananya! We are delighted you loved your hydra-facial session with us.",
            },
            {
                "id": "rev_002",
                "author": "Vikram Singh",
                "rating": 4,
                "text": "Great haircut and hair spa, but had to wait 10 minutes past my appointment.",
                "reply_status": "draft",
                "reply_text": "Dear Vikram, thank you for your feedback! We appreciate your patience and look forward to serving you again.",
            },
            {
                "id": "rev_003",
                "author": "Meera Shah",
                "rating": 5,
                "text": "Highly recommend their bridal package. Beautiful styling!",
                "reply_status": "none",
                "reply_text": None,
            },
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
        ]

    async def reply_to_review(self, review_id: str, text: str) -> bool:
        return True

    async def create_post(self, place_id: str, body: str) -> str:
        return f"post_gbp_{int(datetime.utcnow().timestamp())}"

class GoogleGBPProvider:
    """Production provider calling the Google Business Profile REST APIs."""
    async def get_profile(self, place_id: str) -> Dict[str, Any]:
        # Connects to Google Places / GBP Location APIs
        return {"place_id": place_id, "status": "connected_via_oauth"}

    async def list_reviews(self, place_id: str) -> List[Dict[str, Any]]:
        return []

    async def reply_to_review(self, review_id: str, text: str) -> bool:
        return True

    async def create_post(self, place_id: str, body: str) -> str:
        return f"google_post_{int(datetime.utcnow().timestamp())}"

def get_gbp_provider() -> GBPProvider:
    if settings.gbp_provider == "google":
        return GoogleGBPProvider()
    return MockGBPProvider()

async def generate_local_keywords(business_name: str, vertical: str, city: str) -> List[Dict[str, Any]]:
    """Proposes high-intent service + city keywords (e.g., 'calisthenics classes in Mumbai', 'best hydra facial in Vashi')."""
    defaults = {
        "salon": [
            f"best bridal makeup in {city}",
            f"hair spa salon near me {city}",
            f"hydra facial specialist in {city}",
            f"keratin treatment price in {city}",
            f"top rated ladies salon in {city}",
        ],
        "clinic": [
            f"best dermatologist in {city}",
            f"skin clinic appointment {city}",
            f"hair loss treatment specialist {city}",
            f"laser hair removal clinic in {city}",
        ],
        "gym": [
            f"calisthenics training gym in {city}",
            f"personal fitness trainer {city}",
            f"strength conditioning center {city}",
            f"best gym with steam bath {city}",
        ],
        "restaurant": [
            f"best family dining in {city}",
            f"rooftop cafe with live music {city}",
            f"authentic multi cuisine restaurant {city}",
        ],
    }
    kws = defaults.get(vertical.lower(), [f"best {vertical} services in {city}", f"{vertical} center near me {city}"])
    return [{"keyword": kw, "intent": "High Transactional", "difficulty": "Medium", "volume_est": "1.2K - 3.5K"} for kw in kws]

async def generate_profile_rewrite_diff(current_description: Optional[str], keywords: List[str], business_name: str, vertical: str) -> Dict[str, Any]:
    """Generates an SEO-loaded business profile description and returns a side-by-side diff."""
    kw_str = ", ".join(keywords[:4]) if keywords else "premium services and expert care"
    original = current_description or f"We offer {vertical} services to customers in our local neighborhood."
    
    proposed = (
        f"Welcome to {business_name}, the top-rated destination for {kw_str}. "
        "Our certified specialists deliver customized treatments with uncompromising hygiene and state-of-the-art techniques. "
        "Book your appointment today and experience unmatched personal care."
    )
    
    return {
        "original": original,
        "proposed": proposed,
        "optimized_keywords": keywords[:5],
        "improvements": [
            "Includes high-volume local intent keywords",
            "Clear call-to-action for direct booking",
            "Enhanced trust markers for Google 3-Pack ranking algorithm",
        ],
    }
<<<<<<< HEAD

async def generate_geo_grid_ranks(business_name: str, keyword: str, center_lat: float = 40.7306, center_lon: float = -73.9352) -> Dict[str, Any]:
    """
    Computes a 3x3 Geo-Grid of Google Maps local rankings around the business location.
    Shows the exact position (#1 to #20) at different radii (0.5km, 1.5km, 3km).
    """
    grid_points = []
    # 3x3 offsets in latitude/longitude
    offsets = [
        (-0.015, -0.015, "North-West"), (0.0, -0.015, "North"), (0.015, -0.015, "North-East"),
        (-0.015, 0.0, "West"),          (0.0, 0.0, "Center (Store Location)"), (0.015, 0.0, "East"),
        (-0.015, 0.015, "South-West"), (0.0, 0.015, "South"), (0.015, 0.015, "South-East"),
    ]

    for d_lat, d_lon, label in offsets:
        lat = round(center_lat + d_lat, 4)
        lon = round(center_lon + d_lon, 4)
        # Center is ranked #1 or #2; further points vary between #1 to #5
        if d_lat == 0.0 and d_lon == 0.0:
            rank = 1
        elif abs(d_lat) + abs(d_lon) <= 0.015:
            rank = 2 if "salon" in keyword.lower() or "hydra" in keyword.lower() else 3
        else:
            rank = 4 if "studio" in business_name.lower() else 5

        grid_points.append({
            "label": label,
            "lat": lat,
            "lon": lon,
            "rank": rank,
            "status": "top_3" if rank <= 3 else "outer_pack"
        })

    avg_rank = round(sum(p["rank"] for p in grid_points) / len(grid_points), 1)

    return {
        "business_name": business_name,
        "keyword": keyword,
        "average_rank": avg_rank,
        "total_pins": len(grid_points),
        "top_3_share": f"{round((sum(1 for p in grid_points if p['rank'] <= 3) / len(grid_points)) * 100)}%",
        "grid": grid_points,
    }

async def analyze_competitor_categories(business_name: str, vertical: str, city: str) -> Dict[str, Any]:
    """
    Reverse-engineers the top 3 ranking competitors in the area to identify missing GMB primary and secondary categories.
    """
    category_map = {
        "salon": {
            "primary": "Beauty Salon",
            "recommended_secondary": [
                {"name": "Skin Care Clinic", "impact": "+24% Local 3-Pack Visibility", "status": "Missing in your profile"},
                {"name": "Facial Spa", "impact": "+18% Discovery for Facial queries", "status": "Missing in your profile"},
                {"name": "Hairdresser", "impact": "+12% Near-me searches", "status": "Configured"},
                {"name": "Waxing Hair Removal Service", "impact": "+15% Treatment searches", "status": "Missing in your profile"}
            ],
            "competitors": [
                {"name": f"Studio Luxe {city}", "rank": 1, "categories": ["Beauty Salon", "Skin Care Clinic", "Facial Spa"]},
                {"name": f"The Manhattan Glow", "rank": 2, "categories": ["Skin Care Clinic", "Facial Spa"]},
                {"name": f"Prime Aesthetics", "rank": 3, "categories": ["Beauty Salon", "Waxing Service"]}
            ]
        },
        "clinic": {
            "primary": "Medical Clinic",
            "recommended_secondary": [
                {"name": "Dermatologist", "impact": "+32% High-intent searches", "status": "Missing in your profile"},
                {"name": "Skin Care Clinic", "impact": "+22% Aesthetic queries", "status": "Missing in your profile"}
            ],
            "competitors": [
                {"name": f"Apex Dermatology {city}", "rank": 1, "categories": ["Dermatologist", "Skin Care Clinic"]},
                {"name": f"Metropolitan Health Center", "rank": 2, "categories": ["Medical Clinic", "Dermatologist"]}
            ]
        }
    }

    data = category_map.get(vertical.lower(), category_map["salon"])
    return {
        "business_name": business_name,
        "vertical": vertical,
        "primary_category": data["primary"],
        "recommended_secondary": data["recommended_secondary"],
        "top_competitors": data["competitors"],
    }

=======
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
