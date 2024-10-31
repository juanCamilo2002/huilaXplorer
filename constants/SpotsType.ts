export type SpotsData = {
    id: number;
    name: string;
    images: SpotImageData[];
    location: {
        id: number;
        name: string;
    };
    average_rating: number;
    num_reviews: number;
    latitude: number;
    longitude: number;
    description: string;
    activities: Activity[];
}

type SpotImageData = {
    image: string;
}


export type Activity = {
    id: number;
    name: string;
} 

