import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import {getUserId} from '../utils/storage';

// Import du module natif Flutter (sera créé plus tard)
const {FlutterModule} = NativeModules;

interface ProfileScreenProps {
  userId: string | null;
  refreshTrigger: number;
}

/**
 * Écran d'affichage du profil (Onglet 2)
 *
 * Affiche le profil utilisateur via le SDK Flutter intégré.
 * Se rafraîchit automatiquement quand l'userId change.
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userId,
  refreshTrigger,
}) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId);
  const [isFlutterReady, setIsFlutterReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserId();
  }, [refreshTrigger]);

  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId);
      if (isFlutterReady) {
        updateFlutterProfile(userId);
      }
    }
  }, [userId, isFlutterReady]);

  const loadUserId = async () => {
    try {
      const storedUserId = await getUserId();
      if (storedUserId) {
        setCurrentUserId(storedUserId);
        if (isFlutterReady) {
          updateFlutterProfile(storedUserId);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement du userId');
    }
  };

  const updateFlutterProfile = async (newUserId: string) => {
    try {
      if (FlutterModule && FlutterModule.updateUserId) {
        await FlutterModule.updateUserId(newUserId);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil Flutter:', err);
    }
  };

  const openFlutterModule = async () => {
    try {
      if (FlutterModule && FlutterModule.openFlutterView) {
        await FlutterModule.openFlutterView(currentUserId || '1');
        setIsFlutterReady(true);
      } else {
        setError('Le module Flutter n\'est pas disponible');
      }
    } catch (err) {
      setError('Erreur lors de l\'ouverture du module Flutter');
      console.error(err);
    }
  };

  if (!currentUserId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Aucun utilisateur sélectionné</Text>
          <Text style={styles.emptySubtitle}>
            Rendez-vous dans l'onglet "User ID" pour configurer l'identifiant
            utilisateur
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              loadUserId();
            }}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Affichage temporaire avant l'intégration Flutter
  // Cette section sera remplacée par le FlutterView
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Utilisateur</Text>
        <View style={styles.userIdBadge}>
          <Text style={styles.userIdText}>ID: {currentUserId}</Text>
        </View>
      </View>

      <View style={styles.flutterContainer}>
        {/* Le FlutterView sera intégré ici */}
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🚀</Text>
          <Text style={styles.placeholderTitle}>Flutter SDK</Text>
          <Text style={styles.placeholderSubtitle}>
            Le profil Flutter s'affichera ici
          </Text>

          <TouchableOpacity
            style={styles.launchButton}
            onPress={openFlutterModule}>
            <Text style={styles.launchButtonText}>
              Ouvrir le profil Flutter
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              UserId actuel: {currentUserId}
            </Text>
            <Text style={styles.infoTextSmall}>
              Refresh trigger: {refreshTrigger}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userIdBadge: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userIdText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  flutterContainer: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  launchButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  launchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  infoTextSmall: {
    fontSize: 12,
    color: '#64B5F6',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
