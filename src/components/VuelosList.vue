<template>
  <div class="list-container">
    <div class="list-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4l3 3V8l-3 3zM13.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 12c0-3.53-2.04-6.58-5-8.05v16.11c2.96-1.48 5-4.53 5-8.06z" stroke="currentColor" stroke-width="2"/>
        </svg>
        Lista de Vuelos ({{ vuelos.length }})
      </h2>
    </div>

    <div v-if="vuelos.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.8 19.2 16 18l-1.8-1.2-1.8 1.2L16 18l1.8 1.2z" stroke="currentColor" stroke-width="2"/>
        <path d="M2 9h20L12 2 2 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 22V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>No hay vuelos registrados</p>
    </div>

    <div v-else class="vuelos-grid">
      <div v-for="vuelo in vuelos" :key="vuelo.id" class="vuelo-card">
        <div class="vuelo-header">
          <div class="vuelo-numero">{{ vuelo.numero }}</div>
          <button @click="eliminarVuelo(vuelo.id)" class="btn-eliminar" title="Eliminar vuelo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="ruta">
          <div class="origen">
            <span class="label">Origen</span>
            <span class="ciudad">{{ vuelo.origen }}</span>
          </div>
          <div class="flecha">→</div>
          <div class="destino">
            <span class="label">Destino</span>
            <span class="ciudad">{{ vuelo.destino }}</span>
          </div>
        </div>

        <div class="detalles">
          <div class="detalle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>{{ formatearFecha(vuelo.fecha) }}</span>
          </div>
          <div class="detalle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>{{ vuelo.hora }}</span>
          </div>
          <div class="detalle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ vuelo.pasajeros ? vuelo.pasajeros.length : 0 }}/{{ vuelo.capacidad }} pasajeros</span>
          </div>
        </div>

        <div v-if="vuelo.pasajeros && vuelo.pasajeros.length > 0" class="pasajeros">
          <h4>Pasajeros asignados:</h4>
          <div class="pasajeros-list">
            <div v-for="pasajero in vuelo.pasajeros" :key="pasajero.pasajeroId" class="pasajero-item">
              <span class="pasajero-nombre">{{ pasajero.nombre }}</span>
              <span class="pasajero-asiento">Asiento: {{ pasajero.asiento }}</span>
            </div>
          </div>
        </div>

        <div class="estado-vuelo" :class="getEstadoVuelo(vuelo)">
          {{ getTextoEstado(vuelo) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../main.js'

export default {
  name: 'VuelosList',
  props: {
    vuelos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['vuelo-eliminado'],
  setup(props, { emit }) {
    const eliminarVuelo = async (vueloId) => {
      if (confirm('¿Estás seguro de que quieres eliminar este vuelo?')) {
        try {
          await deleteDoc(doc(db, 'vuelos', vueloId))
          emit('vuelo-eliminado')
        } catch (error) {
          console.error('Error al eliminar vuelo:', error)
          alert('Error al eliminar el vuelo')
        }
      }
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return ''
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getEstadoVuelo = (vuelo) => {
      const ocupacion = vuelo.pasajeros ? vuelo.pasajeros.length : 0
      const porcentaje = (ocupacion / vuelo.capacidad) * 100
      
      if (porcentaje === 100) return 'completo'
      if (porcentaje >= 75) return 'casi-completo'
      if (porcentaje >= 25) return 'medio'
      return 'disponible'
    }

    const getTextoEstado = (vuelo) => {
      const ocupacion = vuelo.pasajeros ? vuelo.pasajeros.length : 0
      const porcentaje = (ocupacion / vuelo.capacidad) * 100
      
      if (porcentaje === 100) return 'Vuelo Completo'
      if (porcentaje >= 75) return 'Casi Completo'
      if (porcentaje >= 25) return 'Disponible'
      return 'Muchos Asientos'
    }

    return {
      eliminarVuelo,
      formatearFecha,
      getEstadoVuelo,
      getTextoEstado
    }
  }
}
</script>

<style scoped>
.list-container {
  max-width: 100%;
}

.list-header {
  margin-bottom: 25px;
}

.list-header h2 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-header svg {
  color: #4299e1;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #718096;
}

.empty-state svg {
  margin-bottom: 15px;
  opacity: 0.5;
}

.vuelos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.vuelo-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.vuelo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4299e1, #3182ce);
}

.vuelo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.vuelo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.vuelo-numero {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  background: linear-gradient(45deg, #4299e1, #3182ce);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-eliminar {
  background: #fed7d7;
  color: #e53e3e;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-eliminar:hover {
  background: #feb2b2;
  transform: scale(1.1);
}

.ruta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(66, 153, 225, 0.05);
  border-radius: 8px;
}

.origen, .destino {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.label {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ciudad {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.flecha {
  font-size: 1.5rem;
  color: #4299e1;
  font-weight: bold;
  margin: 0 15px;
}

.detalles {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.detalle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;
  font-size: 0.9rem;
}

.detalle svg {
  color: #718096;
}

.pasajeros {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.pasajeros h4 {
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pasajeros-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pasajero-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(56, 161, 105, 0.05);
  border-radius: 6px;
  font-size: 0.85rem;
}

.pasajero-nombre {
  font-weight: 600;
  color: #2d3748;
}

.pasajero-asiento {
  color: #718096;
  font-size: 0.8rem;
}

.estado-vuelo {
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 15px;
}

.estado-vuelo.disponible {
  background: #c6f6d5;
  color: #22543d;
}

.estado-vuelo.medio {
  background: #fef5e7;
  color: #744210;
}

.estado-vuelo.casi-completo {
  background: #fed7d7;
  color: #742a2a;
}

.estado-vuelo.completo {
  background: #e2e8f0;
  color: #2d3748;
}

@media (max-width: 768px) {
  .vuelos-grid {
    grid-template-columns: 1fr;
  }
  
  .ruta {
    flex-direction: column;
    gap: 10px;
  }
  
  .flecha {
    transform: rotate(90deg);
    margin: 10px 0;
  }
}
</style>