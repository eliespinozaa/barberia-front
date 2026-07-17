import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TABS = [
  { key: "Inicio", label: "Inicio", icon: "home-outline", route: "ClientHomeScreen" },
  { key: "Agendar", label: "Agendar", icon: "calendar-outline", route: "ClienteAgendarCitaScreen" },
  { key: "Citas", label: "Mis citas", icon: "time-outline", route: "ClienteCitasScreen" },
  { key: "Perfil", label: "Perfil", icon: "person-outline", route: "PerfilScreen" },
];

const BottomNavClient = ({ navigation, active, styles }) => {
  return (
    <View style={styles.bottomNav}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.bottomNavItem}
            onPress={() => {
              if (!isActive) navigation.navigate(tab.route);
            }}
          >
            <Ionicons
              name={isActive ? tab.icon.replace("-outline", "") : tab.icon}
              size={22}
              color={isActive ? "#C9A84C" : "#888"}
            />
            <Text
              style={[
                styles.bottomNavText,
                isActive && { color: "#C9A84C" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavClient;