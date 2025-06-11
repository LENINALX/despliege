<template>
  <div id="app">
    <Header />
    <main class="main-container">
      <div class="content-wrapper">
        <div class="dashboard-grid">
          <div class="section-card">
            <VueloForm @vuelo-agregado="handleVueloAgregado" />
          </div>
          <div class="section-card">
            <PasajeroForm @pasajero-agregado="handlePasajeroAgregado" />
          </div>
          <div class="section-card full-width">
            <AsignacionForm 
              :vuelos="vuelos" 
              :pasajeros="pasajeros" 
              @asignacion-realizada="handleAsignacionRealizada" 
            />
          </div>
          <div class="section-card full-width">
            <VuelosList 
              :vuelos="vuelos" 
              @vuelo-eliminado="handleVueloEliminado" 
            />
          </div>
          <div class="section-card full-width">
            <PasajerosList 
              :pasajeros="pasajeros" 
              @pasajero-eliminado="handlePasajeroEliminado" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './main.js'
import Header from './components/Header.vue'
import VueloForm from './components/VueloForm.vue'
import PasajeroForm from './components/PasajeroForm.vue'
import AsignacionForm from './components/AsignacionForm.vue'
import VuelosList from './components/VuelosList.vue'
import PasajerosList from './components/PasajerosList.vue'

export default {
  name: 'App',
  components: {
    Header,
    VueloForm,
    PasajeroForm,
    AsignacionForm,
    VuelosList,
    PasajerosList
  },
  setup() {
    const vuelos = ref([])
    const pasajeros = ref([])

    const handleVueloAgregado = () => {
      // Los datos se actualizan automáticamente con onSnapshot
    }

    const handlePasajeroAgregado = () => {
      // Los datos se actualizan automáticamente con onSnapshot
    }

    const handleAsignacionRealizada = () => {
      // Los datos se actualizan automáticamente con onSnapshot
    }

    const handleVueloEliminado = () => {
      // Los datos se actualizan automáticamente con onSnapshot
    }

    const handlePasajeroEliminado = () => {
      // Los datos se actualizan automáticamente con onSnapshot
    }

    onMounted(() => {
      // Escuchar cambios en vuelos
      const unsubscribeVuelos = onSnapshot(collection(db, 'vuelos'), (snapshot) => {
        vuelos.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      })

      // Escuchar cambios en pasajeros
      const unsubscribePasajeros = onSnapshot(collection(db, 'pasajeros'), (snapshot) => {
        pasajeros.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      })

      // Limpiar subscripciones al desmontar
      return () => {
        unsubscribeVuelos()
        unsubscribePasajeros()
      }
    })

    return {
      vuelos,
      pasajeros,
      handleVueloAgregado,
      handlePasajeroAgregado,
      handleAsignacionRealizada,
      handleVueloEliminado,
      handlePasajeroEliminado
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.main-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  align-items: start;
}

.section-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    padding: 15px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
  
  .section-card {
    padding: 20px;
  }
}
</style>