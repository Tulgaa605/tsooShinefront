import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // jwt-decode сан нэмэх ёстой: npm install jwt-decode

const UserProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Токен алга, нэвтрэх дэлгэц рүү шилжинэ');
        navigation.navigate('Login');
        return;
      }

      let fetchedUserId = userId;
      if (!fetchedUserId) {
        try {
          const decoded = jwtDecode(token); // Токеноос userId-г авна
          fetchedUserId = decoded.userId; // JWT-д userId байгаа гэж таамаглав
          console.log('Токеноос авсан userId:', fetchedUserId);
        } catch (e) {
          console.error('Токен декод хийхэд алдаа:', e);
          navigation.navigate('Login');
          return;
        }
      }

      if (fetchedUserId) {
        dispatch(fetchUserProfile(fetchedUserId));
      } else {
        console.log('Хэрэглэгчийн ID алга');
      }
    };
    checkAuthAndFetchProfile();
  }, [dispatch, userId, navigation]);

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text style={styles.error}>Алдаа: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Нэр: {profile?.name || 'Тодорхойгүй'}</Text>
      <Text style={styles.text}>Имэйл: {profile?.email || 'Тодорхойгүй'}</Text>
      <Text style={styles.text}>Профайлын зураг: {profile?.profileImage || 'Байхгүй'}</Text>
      <Button title="Постууд руу шилжих" onPress={() => navigation.navigate('PostList')} />
      <Button title="Бүтээгдэхүүн рүү шилжих" onPress={() => navigation.navigate('ProductList')} />
      <Button title="Ангилал руу шилжих" onPress={() => navigation.navigate('CategoryList')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
  error: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default UserProfileScreen;