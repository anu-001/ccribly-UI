export interface Property {
    id: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: string;
    longitude: string;
    bedrooms: number;
    bathrooms: string;
    squareFeet: number;
    propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'STUDIO' | 'BASEMENT';
    amenities: string[];
    imageUrls: string[];
    availableFrom: string;
    status: 'ACTIVE' | 'INACTIVE';
    ownerId: string;
    owner: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        verificationStatus: string;
    };
}

export interface Roommate {
    id: string;
    userId: string;
    bio: string;
    occupation: string;
    employer: string;
    ageRange: string;
    minBudget: string;
    maxBudget: string;
    preferredMoveInDate: string;
    leaseTerm: number;
    smoker: boolean;
    hasPets: boolean;
    petTypes: string[];
    cleanliness: string;
    sleepSchedule: string;
    guestsFrequency: string;
    workFromHome: boolean;
    socialLevel: string;
    preferredGender: string[];
    preferredPropertyTypes: string[];
    preferredCities: string[];
    preferredNeighborhoods: string[];
    preferredAmenities: string[];
    dealBreakers: string[];
    interests: string[];
    languages: string[];
    hobbies: string[];
    isActive: boolean;
    hasListing: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        verificationStatus: string;
    };
}

export interface ExploreItem {
    type: 'roommate' | 'property';
    item: Property | Roommate;
    score: number;
}

export interface ExploreResponse {
    statusCode: number;
    message: string;
    data: ExploreItem[];
    timestamp: string;
    requestId: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    avatarUrl?: string;
    role: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED';
    createdAt?: string;
}

// Authentication types
export interface SignUpData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    bio?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        user: User;
    };
    timestamp: string;
    requestId: string;
}

export interface SearchFilters {
    priceRange?: string;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    location?: string;
    radius?: number;
}