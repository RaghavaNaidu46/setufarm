from sqlalchemy import select, update
from sqlalchemy.orm import selectinload, joinedload
import base64
from app.models.all_models import Product, User, FarmerProfile, ProductPhoto
from app.core.utils import haversine_distance

class ProductService:
    def __init__(self, db):
        self.db = db

    def _serialize_product(self, product, buyer_lat=None, buyer_lng=None):
        """Helper to convert binary photos to base64 strings for response"""
        photos = [
            f"data:image/jpeg;base64,{base64.b64encode(p.image_data).decode()}"
            for p in product.photos
        ]
        
        farmer_info = None
        distance_km = 0
        
        if product.farmer:
            farmer_info = {
                "id": str(product.farmer.id),
                "name": product.farmer.name or "Local Farmer",
                "profile_photo": product.farmer.profile_photo,
                "village": product.village or "Nearby",
                "district": product.district or "",
                "rating": float(product.farmer.farmer_profile.rating) if (product.farmer.farmer_profile and product.farmer.farmer_profile.rating) else 0.0
            }
            
            # Calculate distance if buyer coordinates are provided
            if buyer_lat is not None and buyer_lng is not None and product.lat and product.lng:
                distance_km = haversine_distance(buyer_lat, buyer_lng, product.lat, product.lng)
            elif product.farmer.farmer_profile and product.farmer.farmer_profile.lat and product.farmer.farmer_profile.lng:
                # Fallback to farmer profile location if product location is missing
                distance_km = haversine_distance(buyer_lat, buyer_lng, product.farmer.farmer_profile.lat, product.farmer.farmer_profile.lng)

        return {
            "id": product.id,
            "crop_name": product.crop_name,
            "quantity_kg": float(product.quantity_kg),
            "price_per_kg": float(product.price_per_kg),
            "status": product.status,
            "photos": photos,
            "village": product.village,
            "district": product.district,
            "farmer": farmer_info,
            "distance_km": distance_km
        }


    async def create_product(self, product_data, user_id):
        # Fetch farmer's location to pre-fill product location
        stmt = select(FarmerProfile).where(FarmerProfile.user_id == user_id)
        res = await self.db.execute(stmt)
        profile = res.scalar_one_or_none()

        new_product = Product(
            farmer_id=user_id,
            crop_name=product_data.crop_name,
            quantity_kg=product_data.quantity_kg,
            price_per_kg=product_data.price_per_kg,
            status="active",
            village=profile.village if profile else None,
            district=profile.district if profile else None
        )
        self.db.add(new_product)
        await self.db.flush() # Get ID before adding photos

        # Handle BLOB photos
        if product_data.crop_photos:
            for b64_str in product_data.crop_photos:
                try:
                    # Clean up base64 string if it has headers (data:image/png;base64,...)
                    if ',' in b64_str:
                        b64_str = b64_str.split(',')[1]
                    
                    image_binary = base64.b64decode(b64_str)
                    photo = ProductPhoto(
                        product_id=new_product.id,
                        image_data=image_binary
                    )
                    self.db.add(photo)
                except Exception as e:
                    print(f"Error decoding photo: {e}")

        await self.db.commit()
        
        # Fetch the newly created product with its photos and farmer profile eager-loaded
        stmt = select(Product).options(
            selectinload(Product.photos),
            joinedload(Product.farmer).joinedload(User.farmer_profile)
        ).where(Product.id == new_product.id)
        res = await self.db.execute(stmt)
        return res.scalar_one()




    async def process_voice_listing(self, audio, language):
        # In production: call Google Speech-to-Text -> LLM -> JSON
        return {"crop_name": "Tomato", "quantity": 100, "price": 20}

    async def get_nearby_products(self, lat, lng, radius, crop_type, min_price, max_price):
        stmt = select(Product).options(
            selectinload(Product.photos),
            joinedload(Product.farmer).joinedload(User.farmer_profile)
        ).where(Product.status == "active")
        
        # Add spatial filters if needed
        if crop_type:
            stmt = stmt.where(Product.crop_name == crop_type)
        if min_price:
            stmt = stmt.where(Product.price_per_kg >= min_price)
        if max_price:
            stmt = stmt.where(Product.price_per_kg <= max_price)
            
        res = await self.db.execute(stmt)
        products = res.scalars().unique().all()
        return {"products": [self._serialize_product(p, lat, lng) for p in products]}

    async def get_market_price(self, crop_name, district):
        # In production: fetch from agmarknet or internal trends
        return {"min_price": 10, "max_price": 25, "modal_price": 18}

    async def get_farmer_listings(self, user_id):
        stmt = select(Product).options(
            selectinload(Product.photos),
            joinedload(Product.farmer).joinedload(User.farmer_profile)
        ).where(Product.farmer_id == user_id).order_by(Product.created_at.desc())
        res = await self.db.execute(stmt)
        products = res.scalars().unique().all()
        return {"products": [self._serialize_product(p) for p in products]}


    async def update_status(self, product_id, status, user_id):
        stmt = update(Product).where(
            Product.id == product_id, 
            Product.farmer_id == user_id
        ).values(status=status).returning(Product)
        res = await self.db.execute(stmt)
        await self.db.commit()
        return res.scalar_one_or_none()
