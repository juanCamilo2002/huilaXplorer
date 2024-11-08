import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Review } from '@/constants/ReviewsType';
import useAxios from '@/hooks/useAxios';
import { ReviewCard } from './reviews/ReviewCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/providers/SessionProvider';
import AddReview from './reviews/AddReview';
import ReviewsSkeleton from './reviews/skeletons/ReviewsSkeleton';

type ReviewsProps = {
  spotId: number;
};

export default function Reviews({ spotId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const { get } = useAxios();
  const colorScheme = useColorScheme();
  const { userProfile, session } = useSession();
  const [hasMyReview, setHasMyReview] = useState<Review>();

  const fetchMyReview = async () => {
    try {
      const { data, status } = await get(`/reviews/user-review/?tourist_spot=${spotId}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      if (status === 200) {
        setHasMyReview(data);
      }
    } catch (error) {
      setHasMyReview(undefined);
    }
  }

  useEffect(() => {
    if (userProfile) {
      fetchMyReview();
    }
  }, [userProfile, reviews, spotId]);

  const fetchReviews = async (reset = false) => {

    try {
      if (reset) {
        setReviews([]);
        setOffset(0);
        setHasMore(true);
        setLoading(true);
      }
      const { data } = await get(`/reviews/?tourist_spot=${spotId}&limit=${limit}&offset=${reset ? 0 : offset}`);
      const reviewsData = data.results.filter((review: Review) => review.user.email !== userProfile?.email);
      setReviews(prevReviews => reset ? reviewsData : [...prevReviews, ...reviewsData]);
      setHasMore(data.next !== null);
      setOffset(prevOffset => prevOffset + limit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(true);
  }, []);

  const renderLoading = () => (
    <ReviewsSkeleton />
  );

  const renderContent = () => (
    <>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].gray }]}>Reseñas</Text>
      {!hasMyReview && (
        <AddReview spotId={spotId} fetchMyReview={fetchMyReview} />
      )}
      {hasMyReview && (
        <ReviewCard review={hasMyReview} owned fetchMyReview={fetchMyReview}/>
      )}
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {hasMore && (
        <TouchableOpacity style={[styles.loadMoreButton, { backgroundColor: Colors[colorScheme ?? 'light'].greenDark }]} onPress={() => fetchReviews()}>
          <Text style={styles.loadMoreButtonText}>Cargar más</Text>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {loading ? renderLoading() : renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadMoreButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
