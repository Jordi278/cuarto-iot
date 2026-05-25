import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

const API_URL = 'https://cuarto-iot.cleverapps.io/sensors'

export default function App() {

  const [temperature, setTemperature] = useState(24)
  const [current, setCurrent] = useState(1.5)
  const [motion, setMotion] = useState(false)
  const [led, setLed] = useState(true)

  const [tempHistory, setTempHistory] = useState([20, 22, 24, 23, 25])
  const [currentHistory, setCurrentHistory] = useState([1, 2, 1.5, 2.5, 2])

  const [status, setStatus] = useState('ONLINE')

  useEffect(() => {

    const loadData = async () => {

      try {

        const res = await fetch(API_URL)

        if (!res.ok) {
          throw new Error('API ERROR')
        }

        const data = await res.json()

        const temp = Number(data.temperature) || 24
        const curr = Number(data.current) || 1.5

        setTemperature(temp)
        setCurrent(curr)

        setMotion(Boolean(data.motion))
        setLed(Boolean(data.led))

        setStatus('ONLINE')

        setTempHistory(prev => {
          const updated = [...prev, temp]
          return updated.slice(-10)
        })

        setCurrentHistory(prev => {
          const updated = [...prev, curr]
          return updated.slice(-10)
        })

      } catch (error) {

        console.log('Error API:', error)

        setStatus('OFFLINE')

        // DATOS FAKE
        const fakeTemp = 20 + Math.floor(Math.random() * 10)
        const fakeCurrent = 1 + Math.random() * 2

        setTemperature(fakeTemp)
        setCurrent(Number(fakeCurrent.toFixed(1)))

        setMotion(Math.random() > 0.5)
        setLed(Math.random() > 0.5)

        setTempHistory(prev => {
          const updated = [...prev, fakeTemp]
          return updated.slice(-10)
        })

        setCurrentHistory(prev => {
          const updated = [...prev, fakeCurrent]
          return updated.slice(-10)
        })
      }
    }

    loadData()

    const interval = setInterval(loadData, 3000)

    return () => clearInterval(interval)

  }, [])

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Cuarto IoT PRO</Text>

      <Text
        style={[
          styles.status,
          {
            color:
              status === 'ONLINE'
                ? '#22C55E'
                : '#EF4444'
          }
        ]}
      >
        ● {status}
      </Text>

      {/* TARJETAS */}

      <View style={styles.grid}>

        <View style={styles.card}>
          <Text style={styles.label}>Temperatura</Text>

          <Text style={styles.value}>
            {temperature}°C
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Corriente</Text>

          <Text style={styles.value}>
            {current}A
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Movimiento</Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  motion
                    ? '#22C55E'
                    : '#EF4444'
              }
            ]}
          >
            {motion ? 'DETECTADO' : 'SIN MOVIMIENTO'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>LED</Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  led
                    ? '#FACC15'
                    : '#64748B'
              }
            ]}
          >
            {led ? 'ENCENDIDO' : 'APAGADO'}
          </Text>
        </View>

      </View>

      {/* GRAFICA TEMPERATURA */}

      <Text style={styles.chartTitle}>
        Gráfica Temperatura
      </Text>

      <View style={styles.chartContainer}>

        {
          tempHistory.map((item, index) => (

            <View
              key={index}
              style={styles.barWrapper}
            >

              <View
                style={[
                  styles.barGreen,
                  {
                    height: item * 5
                  }
                ]}
              />

              <Text style={styles.barLabel}>
                {item}
              </Text>

            </View>
          ))
        }

      </View>

      {/* GRAFICA CORRIENTE */}

      <Text style={styles.chartTitle}>
        Gráfica Corriente
      </Text>

      <View style={styles.chartContainer}>

        {
          currentHistory.map((item, index) => (

            <View
              key={index}
              style={styles.barWrapper}
            >

              <View
                style={[
                  styles.barBlue,
                  {
                    height: item * 40
                  }
                ]}
              />

              <Text style={styles.barLabel}>
                {item.toFixed(1)}
              </Text>

            </View>
          ))
        }

      </View>

      {/* HISTORIAL */}

      <Text style={styles.chartTitle}>
        Historial reciente
      </Text>

      <View style={styles.historyCard}>

        <Text style={styles.historyText}>
          🌡 Temperatura: {temperature}°C
        </Text>

        <Text style={styles.historyText}>
          ⚡ Corriente: {current}A
        </Text>

        <Text style={styles.historyText}>
          🚶 Movimiento: {motion ? 'Sí' : 'No'}
        </Text>

        <Text style={styles.historyText}>
          💡 LED: {led ? 'Encendido' : 'Apagado'}
        </Text>

      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
    padding: 14,
  },

  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
  },

  status: {
    marginTop: 8,
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#111827',
    width: '48%',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  label: {
    color: '#94A3B8',
    fontSize: 13,
  },

  value: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },

  chartTitle: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  chartContainer: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  barWrapper: {
    alignItems: 'center',
  },

  barGreen: {
    width: 24,
    backgroundColor: '#22C55E',
    borderRadius: 10,
  },

  barBlue: {
    width: 24,
    backgroundColor: '#38BDF8',
    borderRadius: 10,
  },

  barLabel: {
    color: 'white',
    marginTop: 6,
    fontSize: 12,
  },

  historyCard: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  historyText: {
    color: 'white',
    marginBottom: 10,
    fontSize: 15,
  },

})