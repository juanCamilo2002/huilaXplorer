import CardSpot from '@/components/explore/CardSpot';
import Map from '@/components/explore/Map';
import SearchHeader from '@/components/layout/SearchHeader';
import { Colors } from '@/constants/Colors';
import { SpotsData, Activity } from '@/constants/SpotsType';
import useAxios from '@/hooks/useAxios';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FAB, Skeleton } from '@rneui/base'; 
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';

export default function Explore() {
  const colorScheme = useColorScheme();
  const { get } = useAxios();
  const [modeView, setModeView] = useState<'list' | 'map'>('list');
  const [spots, setSpots] = useState<SpotsData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '', activity: '', average_rating: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalSpots, setTotalSpots] = useState(0);
  const [loading, setLoading] = useState(true); 
  const totalPages = Math.ceil(totalSpots / limit);

  const scrollViewRef = useRef<ScrollView>(null);

  const fetchSpots = async (offset = 0) => {
    setLoading(true); 
    try {
      if (modeView=== "list"){
        const { data } = await get('/tourist-spots/', {
          params: {
            name: searchQuery,
            ...filters,
            limit,
            offset,
          },
        });
        setSpots(data.results);
        setTotalSpots(data.count);
      } else {
        const { data } = await get('/tourist-spots/?all=true' );

        const filteredData = data.results.filter((spot: SpotsData) => {
          const name = spot.name.toLowerCase();
          const search = searchQuery.toLowerCase();

          if(filters.location){
            if(spot.location.id !== Number(filters.location)){
              return false;
            }
          }

          if(filters.activity){
            if(spot.activities.filter((activity: Activity) => activity.id ===Number( filters.activity)).length === 0){
              return false;
            }
          }

          if(filters.average_rating){
            if(spot.average_rating < Number(filters.average_rating)){
              return false;
            }
          }

          return name.includes(search);
        });

        setSpots(filteredData);
      }
    } catch (error) {
      console.error("Error fetching spots:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const offset = (currentPage - 1) * limit;
    fetchSpots(offset);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [searchQuery, filters, currentPage, limit, modeView]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleNextPage = () => {
    if ((currentPage - 1) * limit + spots.length < totalSpots) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const range = 2;
  const startPage = Math.max(1, currentPage - range);
  const endPage = Math.min(totalPages, currentPage + range);
  let pagesToShow = [];
  if (endPage - startPage + 1 < 5) {
    pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    if (startPage > 1) {
      pagesToShow.unshift(1);
    }
    if (endPage < totalPages) {
      pagesToShow.push(totalPages);
    }
  } else {
    pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <SearchHeader onSearch={setSearchQuery} setFilters={setFilters} filters={filters} />
      {modeView === 'list' ? (
        <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollViewRef}>
          {loading ?  
            Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={[styles.skeletonContainer, { backgroundColor: Colors[colorScheme ?? "light"].ligthgray }]}>

                <Skeleton style={styles.skeletonImage} />
                <Skeleton style={styles.skeletonText} width={200} />
                <Skeleton style={styles.skeletonText} width={100} />
              </View>
            )
            ) : spots.length > 0 ? (
              spots.map((item) => <CardSpot key={item.id} spot={item} />)
            ) : (
            <View style={[styles.noResultsContainer, { backgroundColor: Colors[colorScheme ?? "light"].ligthgray }]}>
              <Icon name="search-off" size={60} color={Colors[colorScheme ?? "light"].greenDark} />
              <Text style={[styles.noResultsText, { color: Colors[colorScheme ?? "light"].greenDark }]}>No se encontraron resultados</Text>
              <Text style={[styles.suggestionText, { color: Colors[colorScheme ?? "light"].gray }]}>
                Prueba con otros términos o ajusta tus filtros.
              </Text>
              <View style={styles.tipsContainer}>
                <Icon name="filter-alt" color={Colors[colorScheme ?? "light"].gray} size={24} />
                <Text style={[styles.tipText, { color: Colors[colorScheme ?? 'light'].gray }]}>Verifica tus filtros de ubicación y actividad</Text>
              </View>
              <View style={styles.tipsContainer}>
                <Icon name="refresh" color={Colors[colorScheme ?? "light"].gray} size={24} />
                <Text style={[styles.tipText, { color: Colors[colorScheme ?? "light"].gray }]}>Intenta refrescar la búsqueda</Text>
              </View>
            </View>
          )}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.paginationButton, { backgroundColor: currentPage === 1 ? Colors[colorScheme ?? 'light'].gray : Colors[colorScheme ?? 'light'].greenDark }]}
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <Icon name="arrow-back" size={20} color={currentPage === 1 ? 'white' : 'black'} />
            </TouchableOpacity>

            <View style={styles.pageNumbersContainer}>
              {pagesToShow.map(page => (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageNumberButton, currentPage === page && { backgroundColor: Colors[colorScheme ?? 'light'].greenDark }]}
                  onPress={() => setCurrentPage(page)}
                >
                  <Text style={[styles.buttonText, { color: currentPage === page ? 'white' : Colors[colorScheme ?? 'light'].greenDark }]}>
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.paginationButton, { backgroundColor: currentPage === totalPages ? Colors[colorScheme ?? 'light'].gray : Colors[colorScheme ?? "light"].greenDark }]}
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <Icon name="arrow-forward" size={20} color={currentPage === totalPages ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Map markers={spots} />
      )}

      <FAB
        title={modeView === 'list' ? 'Mapa' : 'Lista'}
        upperCase
        icon={{ name: modeView === 'list' ? 'map' : 'list', color: 'white' }}
        style={styles.fab}
        color={Colors[colorScheme ?? 'light'].greenDark}
        onPress={() => setModeView(modeView === 'list' ? 'map' : 'list')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 150,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
 
  skeletonContainer: {
    marginVertical: 10,
    width: '90%',
    padding: 20,
    borderRadius: 8,
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  skeletonText: {
    height: 20,
    marginVertical: 5,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    borderRadius: 15,
    margin: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  suggestionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  tipText: {
    marginLeft: 5,
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    borderRadius: 20,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumberButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});
