<template>
  <div class="list-container">
    <div class="list-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Lista de Pasajeros ({{ pasajeros.length }})
      </h2>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando pasajeros...</p>
    </div>
    
    <div v-else-if="pasajeros.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>No hay pasajeros registrados</p>
    </div>
    
    <div v-else class="pasajeros-grid">
      <div v-for="pasajero in pasajeros" :key="pasajero.id" class="pasajero-card">
        <div class="pasajero-header">
          <div class="avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <button @click="eliminarPasajero(pasajero.id)" class="btn-eliminar" title="Eliminar pasajero">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="pasajero-info">
          <h3 class="nombre">{{ pasajero.nombre }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ pasajero.email }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ pasajero.telefono }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ formatearFecha(pasajero.fechaRegistro) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/main.js'

export default {
  name: 'PasajerosList',
  setup() {
    const pasajeros = ref([])
    const loading = ref(true)



    // Escuchar cambios en tiempo real
    const escucharCambios = () => {
      try {
        console.log('Iniciando escucha de cambios...')
        console.log('db:', db)
        
        const pasajerosRef = collection(db, 'pasajeros')
        console.log('pasajerosRef:', pasajerosRef)
        
        onSnapshot(pasajerosRef, (snapshot) => {
          console.log('Snapshot recibido:', snapshot)
          pasajeros.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          loading.value = false
        }, (error) => {
          console.error('Error al escuchar cambios:', error)
          loading.value = false
        })
      } catch (error) {
        console.error('Error en escucharCambios:', error)
        loading.value = false
      }
    }

    // Eliminar pasajero
    const eliminarPasajero = async (id) => {
      if (confirm('¿Estás seguro de que quieres eliminar este pasajero?')) {
        try {
          const docRef = doc(db, 'pasajeros', id)
          await deleteDoc(docRef)
          console.log('Pasajero eliminado correctamente')
        } catch (error) {
          console.error('Error al eliminar pasajero:', error)
          alert('Error al eliminar el pasajero')
        }
      }
    }

    // Formatear fecha
    const formatearFecha = (timestamp) => {
      if (!timestamp) return 'Sin fecha'
      
      let fecha
      if (timestamp.toDate) {
        // Es un timestamp de Firestore
        fecha = timestamp.toDate()
      } else {
        // Es una fecha normal
        fecha = new Date(timestamp)
      }
      
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    onMounted(() => {
      // Usar escucha en tiempo real en lugar de carga única
      escucharCambios()
    })

    return {
      pasajeros,
      loading,
      eliminarPasajero,
      formatearFecha
    }
  }
}
</script>

<style scoped>
.list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.list-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
}

.list-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state svg {
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

.pasajeros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.pasajero-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.pasajero-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.pasajero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.btn-eliminar {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-eliminar:hover {
  background: #c82333;
}

.pasajero-info {
  padding: 15px 20px 20px 20px;
}

.nombre {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6c757d;
  font-size: 0.9rem;
}

.info-item svg {
  flex-shrink: 0;
  color: #007bff;
}

.info-item span {
  word-break: break-word;
}

/* Responsivo */
@media (max-width: 768px) {
  .list-container {
    padding: 15px;
  }
  
  .pasajeros-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .list-header h2 {
    font-size: 1.5rem;
  }
}
</style>