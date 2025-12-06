import React, {useState, useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet} from 'react-native';

import UserIdScreen from '../screens/UserIdScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({name, focused}: {name: string; focused: boolean}) => {
  const icons: Record<string, string> = {
    UserId: '⚙️',
    Profile: '👤',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleUserIdSaved = useCallback((userId: string) => {
    setCurrentUserId(userId);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#333',
      })}>
      <Tab.Screen
        name="UserId"
        options={{
          title: 'User ID',
          headerTitle: 'Configuration',
        }}>
        {() => <UserIdScreen onUserIdSaved={handleUserIdSaved} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          title: 'Profil',
          headerTitle: 'Profil Utilisateur',
        }}>
        {() => (
          <ProfileScreen
            userId={currentUserId}
            refreshTrigger={refreshTrigger}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});

export default TabNavigator;
