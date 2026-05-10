-- 1. Users (Farmers, Buyers, Drivers, Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'driver', 'admin')),
    language VARCHAR(20) DEFAULT 'telugu' CHECK (language IN ('telugu', 'hindi', 'english')),
    profile_photo TEXT,
    aadhar_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Farmer Profiles
CREATE TABLE farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Telangana',
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    farm_size_acres DECIMAL(6, 2),
    delivery_radius_km INTEGER DEFAULT 5,
    willing_to_deliver BOOLEAN DEFAULT FALSE,
    bank_account VARCHAR(20),
    ifsc_code VARCHAR(11),
    upi_id VARCHAR(50),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_orders INTEGER DEFAULT 0
);

-- 3. Buyer Profiles
CREATE TABLE buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200),
    business_type VARCHAR(50) CHECK (business_type IN ('restaurant', 'hotel', 'shop', 'supermarket', 'home', 'other')),
    gst_number VARCHAR(15),
    address TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    district VARCHAR(100),
    upi_id VARCHAR(50),
    rating DECIMAL(3, 2) DEFAULT 0.0
);

-- 4. Driver Profiles (GramFleet)
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(30) CHECK (vehicle_type IN ('bike', 'auto', 'tractor', 'van', 'tempo')),
    vehicle_number VARCHAR(15),
    license_number VARCHAR(20),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    is_available BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_deliveries INTEGER DEFAULT 0,
    upi_id VARCHAR(50)
);

-- 5. Products (Crop Listings)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    crop_name_telugu VARCHAR(100),
    crop_name_hindi VARCHAR(100),
    crop_photo TEXT,
    quantity_kg DECIMAL(10, 2) NOT NULL,
    price_per_kg DECIMAL(8, 2) NOT NULL,
    market_price_per_kg DECIMAL(8, 2),
    quality_grade VARCHAR(5) CHECK (quality_grade IN ('A', 'B', 'C')),
    available_from TIMESTAMP,
    available_till TIMESTAMP,
    is_organic BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'paused')),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    village VARCHAR(100),
    district VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    farmer_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    quantity_kg DECIMAL(10, 2) NOT NULL,
    price_per_kg DECIMAL(8, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(8, 2) NOT NULL,
    delivery_charge DECIMAL(8, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Delivery model (YOUR FLEXIBLE FULFILLMENT IDEA)
    delivery_type VARCHAR(20) CHECK (delivery_type IN ('driver', 'farmer', 'self_pickup')),
    delivery_earned_by UUID REFERENCES users(id),  -- farmer_id or driver_id
    delivery_distance_km DECIMAL(6, 2),

    -- Status
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'ready_for_pickup',
        'picked_up', 'in_transit', 'delivered', 'cancelled', 'disputed'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'released_to_farmer', 'refunded'
    )),

    -- Delivery proof
    delivery_photo TEXT,
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    delivered_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    payer_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cash')),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Payouts (Money sent to Farmer / Driver)
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    recipient_id UUID REFERENCES users(id),
    recipient_type VARCHAR(10) CHECK (recipient_type IN ('farmer', 'driver')),
    amount DECIMAL(10, 2) NOT NULL,
    upi_id VARCHAR(50),
    razorpay_payout_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 9. Ratings & Reviews
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    reviewer_id UUID REFERENCES users(id),
    reviewee_id UUID REFERENCES users(id),
    rating_type VARCHAR(20) CHECK (rating_type IN ('product_quality', 'delivery', 'buyer_behaviour')),
    score INTEGER CHECK (score BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. OTP Verifications
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Market Prices (Daily crop price reference)
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    min_price DECIMAL(8, 2),
    max_price DECIMAL(8, 2),
    modal_price DECIMAL(8, 2),
    date DATE DEFAULT CURRENT_DATE,
    source VARCHAR(50) DEFAULT 'agmarknet'
);

-- Indexes for performance
CREATE INDEX idx_products_location ON products USING GIST (point(lng, lat));
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_driver_available ON driver_profiles(is_available);
