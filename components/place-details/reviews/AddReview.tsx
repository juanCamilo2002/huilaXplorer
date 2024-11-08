import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { useSession } from '@/providers/SessionProvider';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useAxios from '@/hooks/useAxios';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Review } from '@/constants/ReviewsType';

type AddReviewProps = {
  spotId: number;
  fetchMyReview: () => void;
  initialData?: Review;
  setModeEditing?: (value: boolean) => void;
};

type FormValues = {
  comment: string;
  rating: number;
};

const validationSchema = Yup.object().shape({
  comment: Yup.string()
    .required('El comentario es obligatorio')
    .min(10, 'El comentario debe tener al menos 10 caracteres'),
  rating: Yup.number()
    .required('La calificación es obligatoria')
    .min(1, 'Debes dar una calificación de al menos 1 estrella')
    .max(5, 'La calificación máxima es de 5 estrellas'),
});

export default function AddReview({ spotId, fetchMyReview, initialData, setModeEditing }: AddReviewProps) {
  const { userProfile } = useSession();
  const colorScheme = useColorScheme();
  const { post, put } = useAxios();
  const [rating, setRating] = useState(0);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      comment: '',
      rating: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('comment', initialData.comment);
      setValue('rating', initialData.rating);
      setRating(initialData.rating);
    }
  }, [initialData]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (userProfile) {
        if (initialData) {
          await put(`/reviews/${initialData.id}/`, {
            comment: data.comment,
            rating: data.rating,
            tourist_spot: spotId,
          });
          fetchMyReview();
          setModeEditing && setModeEditing(false);
        } else {
          const { status } = await post('/reviews/', {
            comment: data.comment,
            rating: data.rating,
            tourist_spot: spotId,
          });
          if (status === 201) {
            fetchMyReview();
            reset();
            setRating(0);
          }
        }


      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStarPress = (value: number) => {
    setRating(value);
    setValue('rating', value);
  };

  return (
    <View style={styles.container}>
      <Image
        source={userProfile?.img_profile ? { uri: userProfile.img_profile } : require('@/assets/images/avatar.jpg')}
        style={styles.imgProfile}
      />
      <View style={styles.reviewContainer}>
        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.commentInput,
                { borderColor: errors.comment ? 'red' : Colors[colorScheme ?? 'light'].gray },
              ]}
              placeholder="Escribe tu comentario..."
              placeholderTextColor={Colors.light.gray}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
            />
          )}
        />
        {errors.comment && <Text style={styles.errorText}>{errors.comment.message}</Text>}

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
              <Text style={star <= rating ? [styles.starSelected, { color: Colors[colorScheme ?? 'light'].greenDark }] : styles.star}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.rating && <Text style={styles.errorText}>{errors.rating.message}</Text>}

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: Colors[colorScheme ?? 'light'].greenDark }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>Enviar Reseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewContainer: {
    flex: 1,
    marginLeft: 10,
  },
  commentInput: {
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 24,
    color: Colors.light.gray,
    marginRight: 5,
  },
  starSelected: {
    fontSize: 24,
    marginRight: 5,
  },
  submitButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});
