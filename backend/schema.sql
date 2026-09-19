-- ============================================
-- FOODBRIDGE AI DATABASE SCHEMA
-- ============================================

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (
        role IN ('donor', 'recipient', 'volunteer', 'admin')
    ),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- RECIPIENT PROFILES
CREATE TABLE recipient_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(200),
    organization_type VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    people_supported INTEGER DEFAULT 0,
    verification_status VARCHAR(30) DEFAULT 'pending'
);


-- DONOR PROFILES
CREATE TABLE donor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(200),
    organization_type VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7)
);


-- VOLUNTEER PROFILES
CREATE TABLE volunteer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    availability_status VARCHAR(30) DEFAULT 'available'
);


-- FOOD DONATIONS
CREATE TABLE food_donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    food_name VARCHAR(200) NOT NULL,
    food_type VARCHAR(100) NOT NULL,
    description TEXT,

    quantity DECIMAL(10, 2) NOT NULL,
    quantity_unit VARCHAR(30) NOT NULL,

    prepared_at TIMESTAMP,
    expiry_time TIMESTAMP,

    freshness_score INTEGER CHECK (
        freshness_score >= 0 AND freshness_score <= 100
    ),

    urgency_score INTEGER CHECK (
        urgency_score >= 0 AND urgency_score <= 100
    ),

    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,

    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),

    status VARCHAR(30) DEFAULT 'available' CHECK (
        status IN (
            'available',
            'matched',
            'reserved',
            'picked_up',
            'delivered',
            'expired',
            'cancelled'
        )
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- RECIPIENT FOOD NEEDS
CREATE TABLE recipient_needs (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    food_type VARCHAR(100) NOT NULL,
    quantity_needed DECIMAL(10, 2) NOT NULL,
    quantity_unit VARCHAR(30) NOT NULL,

    urgency_score INTEGER DEFAULT 50 CHECK (
        urgency_score >= 0 AND urgency_score <= 100
    ),

    people_to_feed INTEGER DEFAULT 0,

    status VARCHAR(30) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- AI MATCHES
CREATE TABLE food_matches (
    id SERIAL PRIMARY KEY,

    donation_id INTEGER NOT NULL REFERENCES food_donations(id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    match_score DECIMAL(5, 2) NOT NULL,

    distance_score DECIMAL(5, 2),
    food_type_score DECIMAL(5, 2),
    quantity_score DECIMAL(5, 2),
    freshness_score DECIMAL(5, 2),
    urgency_score DECIMAL(5, 2),

    ai_reason TEXT,

    status VARCHAR(30) DEFAULT 'suggested' CHECK (
        status IN (
            'suggested',
            'accepted',
            'rejected',
            'completed'
        )
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- PICKUPS / DELIVERIES
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,

    match_id INTEGER NOT NULL REFERENCES food_matches(id) ON DELETE CASCADE,

    volunteer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,

    status VARCHAR(30) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'assigned',
            'picked_up',
            'in_transit',
            'delivered',
            'cancelled'
        )
    ),

    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- IMPACT RECORDS
CREATE TABLE impact_records (
    id SERIAL PRIMARY KEY,

    donation_id INTEGER REFERENCES food_donations(id) ON DELETE SET NULL,
    match_id INTEGER REFERENCES food_matches(id) ON DELETE SET NULL,

    meals_rescued INTEGER DEFAULT 0,
    food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    people_supported INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- INDEXES
CREATE INDEX idx_food_donations_city
ON food_donations(city);

CREATE INDEX idx_food_donations_status
ON food_donations(status);

CREATE INDEX idx_food_donations_food_type
ON food_donations(food_type);

CREATE INDEX idx_food_matches_donation
ON food_matches(donation_id);

CREATE INDEX idx_food_matches_recipient
ON food_matches(recipient_id);

CREATE INDEX idx_deliveries_status
ON deliveries(status);

CREATE INDEX idx_users_role
ON users(role);