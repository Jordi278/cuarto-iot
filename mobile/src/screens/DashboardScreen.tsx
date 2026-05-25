import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IoT Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Temperatura</Text>
        <Text style={styles.value}>24°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Humedad</Text>
        <Text style={styles.value}>68%</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  label: {
    color: '#94A3B8',
    fontSize: 18,
  },

  value: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
})