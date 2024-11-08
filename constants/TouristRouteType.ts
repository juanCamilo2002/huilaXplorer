type TouristRoute = {
    id: number;
    name: string;
    description: string;
    date_start: string ;
    date_end: string ;
    activity_routes: ActivityRoute[];
}

type ActivityRoute = {
    activity: string;
    spot: any;
    id: number;
    date: string;
    tourist_spot: number;
}

export type { TouristRoute, ActivityRoute };