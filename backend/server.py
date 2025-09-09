from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import openai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# OpenAI Configuration
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class Festival(BaseModel):
    name: str
    date: str
    description: str
    significance: str

class TravelInfo(BaseModel):
    best_time_to_visit: str
    nearest_airport: str
    accommodation: List[str]
    local_transport: str
    permits_required: str
    weather_info: str

class SikkimMonastery(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    district: str
    altitude: str
    tradition: str
    description: str
    founded: str
    architecture: str
    spiritual_significance: str
    main_image: str
    gallery_images: List[str]
    panoramic_images: List[str]
    coordinates: Dict[str, float]
    highlights: List[str]
    visiting_hours: str
    entrance_fee: str
    accessibility: str
    cultural_importance: str
    festivals: List[Festival]
    travel_info: TravelInfo
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MonasteryCreate(BaseModel):
    name: str
    location: str
    district: str
    altitude: str
    tradition: str
    description: str
    founded: str
    architecture: str
    spiritual_significance: str
    main_image: str
    gallery_images: List[str]
    panoramic_images: List[str]
    coordinates: Dict[str, float]
    highlights: List[str]
    visiting_hours: str
    entrance_fee: str
    accessibility: str
    cultural_importance: str
    festivals: List[Festival]
    travel_info: TravelInfo

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_message: str
    ai_response: str
    monastery_context: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: str
    monastery_id: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    monastery_id: str
    visitor_name: str
    visitor_email: str
    visitor_phone: str
    visit_date: str
    visit_time: str
    group_size: int
    tour_type: str  # 'self_guided', 'guided_tour', 'spiritual_session'
    special_requests: Optional[str] = None
    total_amount: float
    booking_status: str = 'confirmed'  # 'pending', 'confirmed', 'cancelled'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    monastery_id: str
    visitor_name: str
    visitor_email: str
    visitor_phone: str
    visit_date: str
    visit_time: str
    group_size: int
    tour_type: str
    special_requests: Optional[str] = None

class CulturalEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_type: str  # 'festival', 'ceremony', 'special_occasion', 'cultural_event'
    start_date: str  # ISO format date
    end_date: str    # ISO format date
    monastery_id: Optional[str] = None  # Associated monastery, if any
    monastery_name: Optional[str] = None
    location: str
    significance: str
    traditions: List[str]  # Associated Buddhist traditions
    activities: List[str]   # What happens during the event
    visitor_info: str      # Information for visitors
    image_url: Optional[str] = None
    is_recurring: bool = False  # Whether this event repeats annually
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CulturalEventCreate(BaseModel):
    title: str
    description: str
    event_type: str
    start_date: str
    end_date: str
    monastery_id: Optional[str] = None
    location: str
    significance: str
    traditions: List[str]
    activities: List[str]
    visitor_info: str
    image_url: Optional[str] = None
    is_recurring: bool = False

# Sikkim Monastery Data
sikkim_monasteries_data = [
    {
        "name": "Rumtek Monastery",
        "location": "Rumtek, East Sikkim",
        "district": "East Sikkim",
        "altitude": "1,550 meters",
        "tradition": "Kagyu School of Tibetan Buddhism",
        "description": "Also known as the Dharma Chakra Centre, Rumtek is one of the largest monasteries in Sikkim and serves as the seat-in-exile of the Karmapa Lama.",
        "founded": "1966 (originally 1734)",
        "architecture": "Traditional Tibetan architecture with intricate woodwork and colorful murals",
        "spiritual_significance": "Seat of the 16th Karmapa and center of Kagyu lineage in exile",
        "main_image": "https://images.pexels.com/photos/32010298/pexels-photo-32010298.jpeg",
        "gallery_images": [
            "https://images.pexels.com/photos/32010298/pexels-photo-32010298.jpeg",
            "https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg",
            "https://images.pexels.com/photos/19715251/pexels-photo-19715251.jpeg"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1574169208507-84376144848b?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2400&h=1200&fit=crop"
        ],
        "coordinates": {"lat": 27.2996, "lng": 88.5565},
        "highlights": ["Golden Stupa", "Shrine Hall", "Monastery Museum", "Sacred Dance Festival"],
        "visiting_hours": "6:00 AM - 6:00 PM",
        "entrance_fee": "₹0",
        "accessibility": "Road accessible, moderate walk from parking",
        "cultural_importance": "Most important Kagyu monastery in Sikkim, seat of Karmapa lineage",
        "festivals": [
            {
                "name": "Kagyu Monlam",
                "date": "February/March",
                "description": "Annual prayer festival with masked dances",
                "significance": "Important spiritual gathering for Kagyu practitioners"
            },
            {
                "name": "Buddha Purnima",
                "date": "May",
                "description": "Celebration of Buddha's birth, enlightenment, and death",
                "significance": "Most sacred day in Buddhist calendar"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "March to June, September to December",
            "nearest_airport": "Bagdogra Airport (124 km)",
            "accommodation": ["Hotel Sonam Delek", "Rumtek Monastery Guest House", "Gangtok Hotels"],
            "local_transport": "Shared jeeps, private taxis from Gangtok (24 km)",
            "permits_required": "Inner Line Permit for non-Indians",
            "weather_info": "Pleasant climate, avoid monsoon season (July-August)"
        }
    },
    {
        "name": "Pemayangtse Monastery",
        "location": "Pelling, West Sikkim",
        "district": "West Sikkim",
        "altitude": "2,085 meters",
        "tradition": "Nyingma School of Tibetan Buddhism",
        "description": "One of the oldest and most important monasteries in Sikkim, meaning 'Perfect Sublime Lotus'. It offers stunning views of Kanchenjunga.",
        "founded": "1705",
        "architecture": "Three-story structure with traditional Sikkimese architecture",
        "spiritual_significance": "Second most important monastery in Sikkim, head monastery of Nyingma sect",
        "main_image": "https://images.unsplash.com/photo-1634308670152-17f7f1aa4e79",
        "gallery_images": [
            "https://images.unsplash.com/photo-1634308670152-17f7f1aa4e79",
            "https://images.unsplash.com/photo-1687074106203-f3dad46d9eb6",
            "https://images.pexels.com/photos/33262249/pexels-photo-33262249.jpeg"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1591123720950-2ec8c92e3a02?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1605108176507-b4b5c4b91b51?w=2400&h=1200&fit=crop"
        ],
        "coordinates": {"lat": 27.3182, "lng": 88.2160},
        "highlights": ["Zangdog Palri Model", "Ancient Manuscripts", "Kanchenjunga Views", "Ta-tshog Festival"],
        "visiting_hours": "7:00 AM - 5:00 PM",
        "entrance_fee": "₹20 for Indians, ₹200 for foreigners",
        "accessibility": "Well-connected by road, short walk from parking",
        "cultural_importance": "Premier Nyingma monastery, showcases traditional Sikkimese Buddhism",
        "festivals": [
            {
                "name": "Chaam Dance Festival",
                "date": "January/February",
                "description": "Sacred masked dance performances",
                "significance": "Drives away evil spirits and brings good fortune"
            },
            {
                "name": "Saga Dawa",
                "date": "May/June",
                "description": "Celebrates Buddha's birth, enlightenment, and parinirvana",
                "significance": "Most sacred month in Buddhist calendar"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "October to May for clear mountain views",
            "nearest_airport": "Bagdogra Airport (160 km)",
            "accommodation": ["Hotel Garuda", "Pelling Tourist Lodge", "Norbu Ghang Resort"],
            "local_transport": "Shared jeeps from Pelling (2 km), taxis available",
            "permits_required": "Inner Line Permit for areas beyond Pelling",
            "weather_info": "Cool climate, heavy snowfall in winter, clear views in autumn"
        }
    },
    {
        "name": "Enchey Monastery",
        "location": "Gangtok, East Sikkim",
        "district": "East Sikkim",
        "altitude": "1,800 meters",
        "tradition": "Nyingma School of Tibetan Buddhism",
        "description": "Located on a hilltop overlooking Gangtok, this monastery is believed to be blessed by guardian spirits and offers panoramic views of the city.",
        "founded": "1909",
        "architecture": "Traditional Tibetan style with Chinese architectural influences",
        "spiritual_significance": "Important pilgrimage site, believed to be protected by tantric masters",
        "main_image": "https://images.unsplash.com/photo-1543341724-c6f823532cac",
        "gallery_images": [
            "https://images.unsplash.com/photo-1543341724-c6f823532cac",
            "https://images.unsplash.com/photo-1755011310512-38cfb597241c",
            "https://images.pexels.com/photos/2409032/pexels-photo-2409032.jpeg"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1591123720950-2ec8c92e3a02?w=1920",
            "https://images.unsplash.com/photo-1605108176507-b4b5c4b91b51?w=1920",
            "https://images.unsplash.com/photo-1634308654308-2d12cb6d0f47?w=1920"
        ],
        "coordinates": {"lat": 27.3389, "lng": 88.6065},
        "highlights": ["Prayer Hall", "Ancient Statues", "City Views", "Guardian Deities"],
        "visiting_hours": "6:00 AM - 6:00 PM",
        "entrance_fee": "₹0",
        "accessibility": "Easy road access from Gangtok city center",
        "cultural_importance": "Important urban monastery, center of Buddhist activities in Gangtok",
        "festivals": [
            {
                "name": "Chaam Festival",
                "date": "December/January",
                "description": "Annual masked dance festival with elaborate costumes",
                "significance": "Celebrates victory of good over evil"
            },
            {
                "name": "Losar",
                "date": "February/March",
                "description": "Tibetan New Year celebrations",
                "significance": "Beginning of new year in Tibetan calendar"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "March to June, September to December",
            "nearest_airport": "Bagdogra Airport (124 km)",
            "accommodation": ["Hotels in Gangtok city", "Mayfair Spa Resort", "Hotel Sonam Delek"],
            "local_transport": "Local taxis, walking distance from MG Road",
            "permits_required": "None for the monastery itself",
            "weather_info": "Pleasant climate year-round, avoid monsoon season"
        }
    },
    {
        "name": "Tashiding Monastery",
        "location": "Tashiding, West Sikkim",
        "district": "West Sikkim",
        "altitude": "1,465 meters",
        "tradition": "Nyingma School of Tibetan Buddhism",
        "description": "Perched on a hilltop between Rathong and Rangeet rivers, this monastery is considered one of the most sacred in Sikkim.",
        "founded": "1717",
        "architecture": "Traditional architecture harmoniously blended with the natural landscape",
        "spiritual_significance": "Most sacred monastery in Sikkim, blessed by Guru Padmasambhava",
        "main_image": "https://images.unsplash.com/photo-1633538028057-838fd4e027a4",
        "gallery_images": [
            "https://images.unsplash.com/photo-1633538028057-838fd4e027a4",
            "https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg",
            "https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1591123720950-2ec8c92e3a02?w=2400&h=1200&fit=crop"
        ],
        "coordinates": {"lat": 27.3433, "lng": 88.2167},
        "highlights": ["Sacred Chortens", "Holy Spring", "Bhumchu Festival", "River Confluence Views"],
        "visiting_hours": "6:00 AM - 6:00 PM",
        "entrance_fee": "₹0",
        "accessibility": "Moderate trek from road, scenic walking path",
        "cultural_importance": "Holiest site in Sikkim, significant for all Buddhist sects",
        "festivals": [
            {
                "name": "Bhumchu Festival",
                "date": "February/March",
                "description": "Sacred water ceremony predicting the year ahead",
                "significance": "Most important festival, determines fortune for the year"
            },
            {
                "name": "Kagyat Dance",
                "date": "December",
                "description": "Traditional masked dance performances",
                "significance": "Celebrates Buddha's teachings and drives away negativity"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "October to May, especially during Bhumchu Festival",
            "nearest_airport": "Bagdogra Airport (140 km)",
            "accommodation": ["Basic guest houses in Tashiding", "Hotels in nearby Geyzing"],
            "local_transport": "Shared jeeps from Geyzing, private taxis available",
            "permits_required": "Inner Line Permit for non-Indians",
            "weather_info": "Pleasant climate, can be misty, best visibility in winter"
        }
    },
    {
        "name": "Do-drul Chorten",
        "location": "Gangtok, East Sikkim",
        "district": "East Sikkim",
        "altitude": "1,650 meters",
        "tradition": "Nyingma School of Tibetan Buddhism",
        "description": "The most important stupa in Sikkim, surrounded by 108 prayer wheels and containing sacred relics and mantras.",
        "founded": "1945",
        "architecture": "Traditional Tibetan stupa architecture with golden spire",
        "spiritual_significance": "Important pilgrimage site, believed to subdue evil forces",
        "main_image": "https://images.pexels.com/photos/33262249/pexels-photo-33262249.jpeg",
        "gallery_images": [
            "https://images.pexels.com/photos/33262249/pexels-photo-33262249.jpeg",
            "https://images.pexels.com/photos/19715251/pexels-photo-19715251.jpeg",
            "https://images.unsplash.com/photo-1566499175117-c78fabf20b7d"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1605108176507-b4b5c4b91b51?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1634308654308-2d12cb6d0f47?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1563519007-3954c4fa2f7e?w=2400&h=1200&fit=crop"
        ],
        "coordinates": {"lat": 27.3178, "lng": 88.6094},
        "highlights": ["108 Prayer Wheels", "Golden Stupa", "Sacred Relics", "Prayer Flags"],
        "visiting_hours": "5:00 AM - 7:00 PM",
        "entrance_fee": "₹0",
        "accessibility": "Easy access from Gangtok, well-maintained paths",
        "cultural_importance": "Spiritual center of Gangtok, important meditation site",
        "festivals": [
            {
                "name": "Buddha Jayanti",
                "date": "May",
                "description": "Celebrates Buddha's birth with prayers and offerings",
                "significance": "Special prayers and circumambulation of the stupa"
            },
            {
                "name": "Tse Chu",
                "date": "October",
                "description": "Sacred day for accumulating merit through prayers",
                "significance": "Believed to multiply positive karma"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "Year-round, especially early morning for prayers",
            "nearest_airport": "Bagdogra Airport (124 km)",
            "accommodation": ["Hotels in Gangtok", "Nearby guest houses"],
            "local_transport": "Walking distance from city center, local taxis available",
            "permits_required": "None",
            "weather_info": "Pleasant climate, covered walkways for rainy season"
        }
    },
    {
        "name": "Khecheopalri Monastery",
        "location": "Khecheopalri, West Sikkim",
        "district": "West Sikkim",
        "altitude": "1,700 meters",
        "tradition": "Nyingma School of Tibetan Buddhism",
        "description": "Located near the sacred Khecheopalri Lake (Wishing Lake), this monastery is surrounded by pristine forests and is considered highly sacred.",
        "founded": "Unknown (ancient)",
        "architecture": "Simple traditional architecture in harmony with nature",
        "spiritual_significance": "Sacred lake monastery, fulfills devotees' wishes",
        "main_image": "https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg",
        "gallery_images": [
            "https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg",
            "https://images.unsplash.com/photo-1755011310512-38cfb597241c",
            "https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg"
        ],
        "panoramic_images": [
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1613773332572-7825c9f74049?w=2400&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2400&h=1200&fit=crop"
        ],
        "coordinates": {"lat": 27.3167, "lng": 88.2000},
        "highlights": ["Sacred Wishing Lake", "Forest Trek", "Bird Watching", "Prayer Flags"],
        "visiting_hours": "Dawn to Dusk",
        "entrance_fee": "₹0",
        "accessibility": "Moderate trek through forest, well-marked trail",
        "cultural_importance": "Sacred pilgrimage site, both Buddhist and Hindu significance",
        "festivals": [
            {
                "name": "Maghe Sankranti",
                "date": "January",
                "description": "Sacred bathing and prayers at the lake",
                "significance": "Purification of sins and fulfillment of wishes"
            },
            {
                "name": "Drupka Teshi",
                "date": "July/August",
                "description": "Celebrates Buddha's first teaching",
                "significance": "Special prayers and teachings at the monastery"
            }
        ],
        "travel_info": {
            "best_time_to_visit": "March to June, September to December",
            "nearest_airport": "Bagdogra Airport (150 km)",
            "accommodation": ["Eco-lodges near lake", "Hotels in Pelling (30 km)"],
            "local_transport": "Jeeps from Pelling, then 30-minute forest walk",
            "permits_required": "Inner Line Permit for non-Indians",
            "weather_info": "Cool and misty, leeches during monsoon, beautiful in winter"
        }
    }
]

# Cultural Events Data
cultural_events_data = [
    {
        "title": "Losar - Tibetan New Year",
        "description": "The most important festival in the Tibetan calendar, marking the beginning of the new year with prayers, festivities, and cultural performances.",
        "event_type": "festival",
        "start_date": "2024-02-10",
        "end_date": "2024-02-12",
        "location": "All Sikkim Monasteries",
        "significance": "Celebration of new beginnings, purification of negative karma, and welcoming prosperity",
        "traditions": ["Tibetan Buddhism", "Nyingma", "Kagyu"],
        "activities": ["Prayer ceremonies", "Cham dances", "Traditional music", "Feast preparation", "Monastery decorations"],
        "visitor_info": "Visitors welcome to observe ceremonies. Traditional dress appreciated. Photography may be restricted during sacred rituals.",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        "is_recurring": true
    },
    {
        "title": "Saga Dawa - Buddha's Enlightenment",
        "description": "Sacred month celebrating Buddha's birth, enlightenment, and parinirvana. The most holy period in Buddhist calendar.",
        "event_type": "festival",
        "start_date": "2024-05-23",
        "end_date": "2024-06-22",
        "location": "All Sikkim Monasteries",
        "significance": "Triple blessed month - merit from good deeds multiplied 100,000 times",
        "traditions": ["Tibetan Buddhism", "Nyingma", "Kagyu"],
        "activities": ["Continuous prayers", "Merit accumulation", "Butter lamp offerings", "Pilgrimage walks", "Vegetarian meals"],
        "visitor_info": "Ideal time for monastery visits. Many locals observe vegetarianism. Early morning prayers highly recommended.",
        "image_url": "https://images.unsplash.com/photo-1599735462307-c8842d0f6afe",
        "is_recurring": true
    },
    {
        "title": "Rumtek Monastery Annual Festival",
        "description": "Grand celebration at the seat of Karmapa with sacred Cham dances, traditional music, and spiritual teachings.",
        "event_type": "ceremony",
        "start_date": "2024-03-15",
        "end_date": "2024-03-17",
        "monastery_id": "",  # Will be set programmatically
        "monastery_name": "Rumtek Monastery",
        "location": "Rumtek, East Sikkim",
        "significance": "Annual purification and blessing ceremony for the Kagyu lineage",
        "traditions": ["Kagyu School"],
        "activities": ["Masked Cham dances", "Traditional horns and drums", "Blessing ceremonies", "Cultural exhibitions"],
        "visitor_info": "Arrive early for best viewing. Comfortable shoes recommended for standing. Local food stalls available.",
        "image_url": "https://images.unsplash.com/photo-1571931792680-4f7bba7bcd9d",
        "is_recurring": true
    },
    {
        "title": "Pang Lhabsol - Mount Khangchendzonga Festival",
        "description": "Unique Sikkimese festival honoring Mount Khangchendzonga, the guardian deity of Sikkim, with warrior dances and offerings.",
        "event_type": "cultural_event",
        "start_date": "2024-09-04",
        "end_date": "2024-09-04",
        "location": "All Sikkim Monasteries and Public Grounds",
        "significance": "Worship of Sikkim's patron deity and celebration of Sikkimese identity",
        "traditions": ["Sikkimese Buddhism", "Lepcha traditions"],
        "activities": ["Warrior dances", "Traditional archery", "Mountain blessing rituals", "Cultural performances"],
        "visitor_info": "State holiday in Sikkim. Spectacular views of Khangchendzonga weather permitting. Traditional Sikkimese attire common.",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        "is_recurring": true
    },
    {
        "title": "Drupka Teshi - First Sermon Festival",
        "description": "Celebrates Buddha's first teaching of the Four Noble Truths at Sarnath, marking the beginning of Buddhist doctrine.",
        "event_type": "festival",
        "start_date": "2024-07-21",
        "end_date": "2024-07-21",
        "location": "All Sikkim Monasteries",
        "significance": "Commemoration of the founding of Buddhist teachings and the Sangha community",
        "traditions": ["Tibetan Buddhism", "Nyingma", "Kagyu"],
        "activities": ["Teaching sessions", "Community prayers", "Merit-making activities", "Dharma discussions"],
        "visitor_info": "Excellent opportunity to hear Buddhist teachings. English translations often available. Respectful silence during sessions.",
        "image_url": "https://images.unsplash.com/photo-1544191696-15693072cfc5",
        "is_recurring": true
    },
    {
        "title": "Enchey Monastery Cham Dance",
        "description": "Traditional masked dance festival at Enchey Monastery, featuring elaborate costumes and ancient choreography.",
        "event_type": "ceremony",
        "start_date": "2024-12-18",
        "end_date": "2024-12-19",
        "monastery_id": "",  # Will be set programmatically
        "monastery_name": "Enchey Monastery",
        "location": "Enchey, Gangtok",
        "significance": "Ritual dance to ward off evil spirits and bring blessings for the new year",
        "traditions": ["Nyingma School"],
        "activities": ["Sacred Cham dances", "Ritual music", "Blessing ceremonies", "Monastery tours"],
        "visitor_info": "Winter clothing essential. Limited seating - arrive early. Hot butter tea served to visitors.",
        "image_url": "https://images.unsplash.com/photo-1578320339911-b3b8ba064e4b",
        "is_recurring": true
    },
    {
        "title": "Tashiding Monastery Sacred Water Festival",
        "description": "Holy water ceremony at Tashiding, where blessed water is believed to cleanse all sins with just a sip.",
        "event_type": "ceremony",
        "start_date": "2024-02-24",
        "end_date": "2024-02-24",
        "monastery_id": "",  # Will be set programmatically
        "monastery_name": "Tashiding Monastery",
        "location": "Tashiding, West Sikkim",
        "significance": "Sacred water blessing believed to purify sins and grant spiritual merit",
        "traditions": ["Nyingma School"],
        "activities": ["Water blessing ritual", "Sacred chanting", "Community prayers", "Pilgrimage walk"],
        "visitor_info": "Steep climb to monastery. Carry water bottles. Sacred water distribution after ceremony. Early morning ceremony.",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "is_recurring": true
    },
    {
        "title": "Khecheopalri Lake Blessing Ceremony",
        "description": "Annual blessing at the sacred wishing lake, combining Buddhist and Hindu traditions in a unique Sikkimese ceremony.",
        "event_type": "ceremony",
        "start_date": "2024-04-14",
        "end_date": "2024-04-14",
        "monastery_id": "",  # Will be set programmatically
        "monastery_name": "Khecheopalri Monastery",
        "location": "Khecheopalri Lake, West Sikkim",
        "significance": "Sacred lake ceremony for wish fulfillment and spiritual purification",
        "traditions": ["Nyingma School", "Hindu Traditions"],
        "activities": ["Lake blessing ritual", "Prayer flag installation", "Wish making ceremony", "Nature meditation"],
        "visitor_info": "30-minute forest walk to reach lake. Eco-friendly practices enforced. No littering. Peaceful atmosphere maintained.",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        "is_recurring": true
    }
]

@api_router.get("/")
async def root():
    return {"message": "Welcome to Sikkim Monasteries - Virtual Heritage Tours"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/monasteries/initialize")
async def initialize_sikkim_monasteries(force: bool = False):
    """Initialize the database with Sikkim monastery data"""
    try:
        # Check if monasteries already exist
        existing_count = await db.sikkim_monasteries.count_documents({})
        if existing_count > 0 and not force:
            return {"message": f"Database already contains {existing_count} Sikkim monasteries"}
        
        # Clear existing data if force=True
        if force:
            await db.sikkim_monasteries.delete_many({})
        
        # Insert monastery data
        monasteries = []
        for data in sikkim_monasteries_data:
            monastery = SikkimMonastery(**data)
            monasteries.append(monastery.dict())
        
        result = await db.sikkim_monasteries.insert_many(monasteries)
        return {"message": f"Successfully initialized {len(result.inserted_ids)} Sikkim monasteries"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/monasteries", response_model=List[SikkimMonastery])
async def get_sikkim_monasteries(
    district: Optional[str] = Query(None, description="Filter by district"),
    tradition: Optional[str] = Query(None, description="Filter by tradition"),
    search: Optional[str] = Query(None, description="Search in name or description")
):
    """Get all Sikkim monasteries with optional filtering"""
    query = {}
    
    if district:
        query["district"] = {"$regex": district, "$options": "i"}
    if tradition:
        query["tradition"] = {"$regex": tradition, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    monasteries = await db.sikkim_monasteries.find(query).to_list(length=None)
    return [SikkimMonastery(**monastery) for monastery in monasteries]

@api_router.get("/monasteries/{monastery_id}", response_model=SikkimMonastery)
async def get_monastery(monastery_id: str):
    """Get a specific Sikkim monastery by ID"""
    monastery = await db.sikkim_monasteries.find_one({"id": monastery_id})
    if not monastery:
        raise HTTPException(status_code=404, detail="Monastery not found")
    return SikkimMonastery(**monastery)

@api_router.post("/monasteries", response_model=SikkimMonastery)
async def create_monastery(monastery: MonasteryCreate):
    """Create a new Sikkim monastery"""
    new_monastery = SikkimMonastery(**monastery.dict())
    await db.sikkim_monasteries.insert_one(new_monastery.dict())
    return new_monastery

@api_router.post("/chat")
async def chat_with_monastery_guide(request: ChatRequest):
    """Chat with AI guide about Sikkim monasteries and Buddhist culture"""
    try:
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Get monastery context if monastery_id is provided
        monastery_context = ""
        if request.monastery_id:
            monastery = await db.sikkim_monasteries.find_one({"id": request.monastery_id})
            if monastery:
                monastery_context = f"""
Current Monastery Context:
Name: {monastery['name']}
Location: {monastery['location']}, {monastery['district']}
Altitude: {monastery['altitude']}
Tradition: {monastery['tradition']}
Founded: {monastery['founded']}
Description: {monastery['description']}
Architecture: {monastery['architecture']}
Spiritual Significance: {monastery['spiritual_significance']}
Cultural Importance: {monastery['cultural_importance']}
Highlights: {', '.join(monastery['highlights'])}
Visiting Hours: {monastery['visiting_hours']}
Festivals: {', '.join([f["name"] for f in monastery['festivals']])}
Travel Info: Best time - {monastery['travel_info']['best_time_to_visit']}
"""
        
        # Create system message with comprehensive knowledge
        system_message = f"""You are a knowledgeable AI assistant with expertise in multiple areas, with special focus on Sikkim monasteries and Buddhist culture. You can help users with:

**Primary Expertise - Sikkim & Buddhism:**
- All major monasteries in Sikkim (Rumtek, Pemayangtse, Enchey, Tashiding, Do-drul Chorten, Khecheopalri)
- Tibetan Buddhist traditions (Nyingma, Kagyu schools)
- Sikkim's unique Buddhist culture and festivals
- Himalayan geography and travel in Sikkim
- Local customs, permits, and travel logistics
- Sacred sites and pilgrimage routes
- Buddhist philosophy, practices, and teachings

**General Knowledge Areas:**
- Travel and tourism advice
- Cultural and historical information
- General questions about Buddhism and spirituality
- Geography, science, technology
- Lifestyle and wellness topics
- Educational content
- Current events and general knowledge

{monastery_context}

Guidelines:
- For Sikkim/Buddhist questions: Provide detailed, accurate information with practical travel advice
- For general questions: Give helpful, accurate answers while being concise
- Always be respectful when discussing religious or cultural topics
- If unsure about something, acknowledge the limitation
- Maintain a friendly, conversational tone
- When relevant, connect topics back to Buddhist wisdom or Sikkim culture
- Keep responses informative but engaging (2-4 paragraphs depending on complexity)
"""
        
        # Create OpenAI client and get response
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Save chat message to database
        chat_message = ChatMessage(
            session_id=request.session_id,
            user_message=request.message,
            ai_response=ai_response,
            monastery_context=request.monastery_id
        )
        await db.chat_messages.insert_one(chat_message.dict())
        
        return {
            "response": ai_response,
            "session_id": request.session_id,
            "monastery_context": bool(monastery_context)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 20):
    """Get chat history for a session"""
    messages = await db.chat_messages.find(
        {"session_id": session_id}
    ).sort("timestamp", -1).limit(limit).to_list(length=None)
    
    return {
        "messages": [ChatMessage(**msg) for msg in reversed(messages)],
        "session_id": session_id
    }

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    """Create a new monastery visit booking"""
    try:
        # Calculate total amount based on tour type and group size
        tour_prices = {
            'self_guided': 0,  # Free
            'guided_tour': 500,  # ₹500 per person
            'spiritual_session': 300  # ₹300 per person
        }
        
        base_price = tour_prices.get(booking.tour_type, 0)
        total_amount = base_price * booking.group_size
        
        new_booking = Booking(
            **booking.dict(),
            total_amount=total_amount
        )
        
        await db.bookings.insert_one(new_booking.dict())
        return new_booking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    """Get all bookings (admin endpoint)"""
    bookings = await db.bookings.find().sort("created_at", -1).to_list(length=None)
    return [Booking(**booking) for booking in bookings]

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    """Get a specific booking by ID"""
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)

@api_router.get("/bookings/email/{email}")
async def get_bookings_by_email(email: str):
    """Get bookings by visitor email"""
    bookings = await db.bookings.find({"visitor_email": email}).sort("created_at", -1).to_list(length=None)
    return {"bookings": [Booking(**booking) for booking in bookings]}

@api_router.delete("/bookings/{booking_id}")
async def cancel_booking(booking_id: str):
    """Cancel a booking"""
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"booking_status": "cancelled"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking cancelled successfully"}



@api_router.get("/districts")
async def get_districts():
    """Get list of districts with monasteries"""
    districts = await db.sikkim_monasteries.distinct("district")
    return {"districts": sorted(districts)}

@api_router.get("/traditions")
async def get_traditions():
    """Get list of Buddhist traditions"""
    traditions = await db.sikkim_monasteries.distinct("tradition")
    return {"traditions": sorted(traditions)}

@api_router.get("/festivals")
async def get_all_festivals():
    """Get all festivals celebrated across Sikkim monasteries"""
    monasteries = await db.sikkim_monasteries.find().to_list(length=None)
    all_festivals = []
    
    for monastery in monasteries:
        for festival in monastery.get('festivals', []):
            festival_info = {
                "name": festival['name'],
                "date": festival['date'],
                "description": festival['description'],
                "significance": festival['significance'],
                "monastery": monastery['name'],
                "location": monastery['location']
            }
            all_festivals.append(festival_info)
    
    return {"festivals": all_festivals}

@api_router.get("/travel-guide")
async def get_sikkim_travel_guide():
    """Get comprehensive travel guide for visiting Sikkim monasteries"""
    return {
        "permits": {
            "inner_line_permit": "Required for non-Indians visiting most areas",
            "how_to_get": "Online application or at checkpoints",
            "duration": "15-30 days",
            "documents": "Valid ID proof, passport photos"
        },
        "best_time": {
            "peak_season": "March to June, September to December",
            "monsoon": "July-August (avoid due to landslides)",
            "winter": "December-February (cold but clear views)",
            "festival_time": "February-March for major festivals"
        },
        "getting_there": {
            "nearest_airport": "Bagdogra Airport (West Bengal)",
            "nearest_railway": "New Jalpaiguri (NJP)",
            "road_access": "NH10 from West Bengal",
            "local_transport": "Shared jeeps, private taxis, government buses"
        },
        "accommodation": {
            "types": ["Luxury hotels", "Budget hotels", "Guest houses", "Homestays"],
            "booking_tips": "Book in advance during peak season",
            "monastery_stays": "Some monasteries offer basic accommodation"
        },
        "important_tips": [
            "Carry warm clothes even in summer",
            "Respect photography restrictions in monasteries",
            "Remove shoes before entering prayer halls",
            "Don't point feet towards Buddha statues",
            "Carry cash as ATMs are limited in remote areas",
            "Stay hydrated at high altitudes"
        ]
    }

@api_router.post("/cultural-events/initialize")
async def initialize_cultural_events(force: bool = False):
    """Initialize the database with cultural events data"""
    try:
        # Check if events already exist
        existing_count = await db.cultural_events.count_documents({})
        if existing_count > 0 and not force:
            return {"message": f"Database already contains {existing_count} cultural events"}
        
        # Clear existing data if force=True
        if force:
            await db.cultural_events.delete_many({})
        
        # Get monastery IDs for linking events
        monasteries = await db.sikkim_monasteries.find().to_list(length=None)
        monastery_map = {m['name']: m['id'] for m in monasteries}
        
        # Insert cultural events data
        events = []
        for data in cultural_events_data:
            # Set monastery_id if monastery_name exists
            if data.get('monastery_name') and data['monastery_name'] in monastery_map:
                data['monastery_id'] = monastery_map[data['monastery_name']]
            
            event = CulturalEvent(**data)
            events.append(event.dict())
        
        result = await db.cultural_events.insert_many(events)
        return {"message": f"Successfully initialized {len(result.inserted_ids)} cultural events"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/cultural-events", response_model=List[CulturalEvent])
async def get_cultural_events(
    start_date: Optional[str] = Query(None, description="Filter events after this date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter events before this date (YYYY-MM-DD)"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    monastery_id: Optional[str] = Query(None, description="Filter by monastery"),
    tradition: Optional[str] = Query(None, description="Filter by Buddhist tradition")
):
    """Get cultural events with optional filtering"""
    query = {}
    
    if start_date:
        query["start_date"] = {"$gte": start_date}
    if end_date:
        query["end_date"] = {"$lte": end_date}
    if event_type:
        query["event_type"] = event_type
    if monastery_id:
        query["monastery_id"] = monastery_id
    if tradition:
        query["traditions"] = {"$in": [tradition]}
    
    events = await db.cultural_events.find(query).sort("start_date", 1).to_list(length=None)
    return [CulturalEvent(**event) for event in events]

@api_router.get("/cultural-events/{event_id}", response_model=CulturalEvent)
async def get_cultural_event(event_id: str):
    """Get a specific cultural event by ID"""
    event = await db.cultural_events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Cultural event not found")
    return CulturalEvent(**event)

@api_router.post("/cultural-events", response_model=CulturalEvent)
async def create_cultural_event(event: CulturalEventCreate):
    """Create a new cultural event"""
    new_event = CulturalEvent(**event.dict())
    await db.cultural_events.insert_one(new_event.dict())
    return new_event

@api_router.get("/cultural-events/calendar/{year}/{month}")
async def get_monthly_events(year: int, month: int):
    """Get cultural events for a specific month"""
    # Create date range for the month
    start_date = f"{year:04d}-{month:02d}-01"
    if month == 12:
        end_date = f"{year+1:04d}-01-01"
    else:
        end_date = f"{year:04d}-{month+1:02d}-01"
    
    query = {
        "$or": [
            {"start_date": {"$gte": start_date, "$lt": end_date}},
            {"end_date": {"$gte": start_date, "$lt": end_date}},
            {"$and": [
                {"start_date": {"$lt": start_date}},
                {"end_date": {"$gte": end_date}}
            ]}
        ]
    }
    
    events = await db.cultural_events.find(query).sort("start_date", 1).to_list(length=None)
    return {
        "year": year,
        "month": month,
        "events": [CulturalEvent(**event) for event in events]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()