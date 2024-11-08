export type Review = {
    tourist_spot: number;
    id: number;
    user : {
        email : string;
        first_name : string;
        last_name : string;
        img_profile: string;
    },
    comment: string;
    rating: number;
    created_at: string;
}