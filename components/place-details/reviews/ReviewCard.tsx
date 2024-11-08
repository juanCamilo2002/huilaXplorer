import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Review } from '@/constants/ReviewsType';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatDate } from '@/app/utils/formatDate';
import useAxios from '@/hooks/useAxios';
import AddReview from './AddReview';

type ReviewCardProps = {
  review: Review;
  owned?: boolean;
  fetchMyReview?: () => void;
}

export const ReviewCard = ({ review, owned = false, fetchMyReview = () => { } }: ReviewCardProps) => {
  const { remove } = useAxios();
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let iconName: 'star-outline' | 'star' | 'star-half' = 'star-outline';
      if (i <= review.rating) {
        iconName = 'star';
      } else if (i - 0.5 <= review.rating) {
        iconName = 'star-half';
      }
      stars.push(
        <Ionicons
          key={i}
          name={iconName}
          size={20}
          color={Colors[colorScheme ?? 'light'].greenLight}
          style={{ marginRight: 1 }}
        />
      );
    }
    return stars;
  };

  const userImage = useMemo(() => {
    return review.user.img_profile ? { uri: review.user.img_profile } : require('@/assets/images/avatar.jpg');
  }, [review.user.img_profile]);

  const handleEdit = () => {
    setMenuVisible(false);
    setEditVisible(true);
  };

  const handleDelete = async () => {
    try {
      await remove(`/reviews/${review.id}/`);
      setConfirmDeleteVisible(false);
      fetchMyReview && fetchMyReview();
    } catch (error) {
      console.log(error);
    }
    setMenuVisible(false);
  };

  const openDeleteConfirmation = () => {
    setConfirmDeleteVisible(true);
    setMenuVisible(false);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteVisible(false);
  };

  return (
    editVisible ? (
      <AddReview
        spotId={review.tourist_spot}
        fetchMyReview={fetchMyReview}
        initialData={review}
        setModeEditing={setEditVisible}
      />
    ) : (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerUserInfo}>
            <Image source={userImage} style={styles.imgProfile} />
            <Text style={styles.username}>{owned ? 'Tú' : `${review.user.first_name} ${review.user.last_name}`}</Text>
          </View>
          {owned && (
            <View>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <Ionicons name="ellipsis-vertical" size={20} color={Colors[colorScheme ?? 'light'].gray} />
              </TouchableOpacity>
              {menuVisible && (
                <View style={[styles.menu, { backgroundColor: Colors[colorScheme ?? 'light'].ligthgray }]}>
                  <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
                    <Text style={[styles.menuText, { color: Colors[colorScheme ?? 'light'].gray }]}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openDeleteConfirmation} style={styles.menuItem}>
                    <Text style={[styles.menuText, { color: Colors[colorScheme ?? 'light'].gray }]}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.details}>
          <View style={styles.rating}>{renderStars()}</View>
          <Text>{formatDate(review.created_at)}</Text>
        </View>
        <Text style={styles.comment}>{review.comment}</Text>

        {/* Modal de confirmación para eliminar */}
        <Modal
          transparent={true}
          visible={confirmDeleteVisible}
          animationType="slide"
          onRequestClose={closeDeleteConfirmation}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].white }]}>
              <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta reseña?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={closeDeleteConfirmation} style={[styles.modalButton, { backgroundColor: Colors[colorScheme ?? "light"].gray }]}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[styles.modalButton, styles.deleteButton]}>
                  <Text style={styles.modalButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  comment: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  menu: {
    position: 'absolute',
    width: 100,
    right: 0,
    top: 25,
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    color: Colors.light.white,
    fontWeight: 'bold',
  },
});
