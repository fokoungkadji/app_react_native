import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {saveUserId, getUserId} from '../utils/storage';

interface UserIdScreenProps {
  onUserIdSaved: (userId: string) => void;
}

/**
 * Écran de saisie de l'userId (Onglet 1)
 *
 * Permet à l'utilisateur d'entrer un userId qui sera sauvegardé
 * et utilisé pour afficher le profil dans l'onglet 2.
 */
const UserIdScreen: React.FC<UserIdScreenProps> = ({onUserIdSaved}) => {
  const [userId, setUserId] = useState<string>('');
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadSavedUserId();
  }, []);

  const loadSavedUserId = async () => {
    const storedUserId = await getUserId();
    if (storedUserId) {
      setSavedUserId(storedUserId);
      setUserId(storedUserId);
    }
  };

  const handleSave = async () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      Alert.alert('Erreur', 'Veuillez entrer un userId valide');
      return;
    }

    setIsLoading(true);

    try {
      await saveUserId(trimmedUserId);
      setSavedUserId(trimmedUserId);
      onUserIdSaved(trimmedUserId);
      Alert.alert('Succès', `UserId "${trimmedUserId}" sauvegardé avec succès`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le userId');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Configuration du Profil</Text>
        <Text style={styles.subtitle}>
          Entrez l'identifiant de l'utilisateur pour afficher son profil
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>User ID</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="Entrez le userId (ex: 1 ou 3)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>

        {savedUserId && (
          <View style={styles.savedContainer}>
            <Text style={styles.savedLabel}>UserId actuel :</Text>
            <View style={styles.savedBadge}>
              <Text style={styles.savedValue}>{savedUserId}</Text>
            </View>
          </View>
        )}

        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>Hint</Text>
          <Text style={styles.hintText}>
            Vous pouvez tester avec les userId : 1 ou 3
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#FFB366',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  savedContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  savedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  savedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  hintContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserIdScreen;
