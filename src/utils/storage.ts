import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@azeoo_user_id';

/**
 * Sauvegarde l'userId dans le stockage persistant
 */
export const saveUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du userId:', error);
    throw error;
  }
};

/**
 * Récupère l'userId depuis le stockage persistant
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Erreur lors de la récupération du userId:', error);
    return null;
  }
};

/**
 * Supprime l'userId du stockage persistant
 */
export const clearUserId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du userId:', error);
    throw error;
  }
};
