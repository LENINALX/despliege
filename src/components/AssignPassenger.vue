<template>
  <div class="form-container">
    <div class="form-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Asignar Pasajero a Vuelo
      </h2>
    </div>
    
    <form @submit.prevent="asignarPasajero" class="form">
      <div class="form-group">
        <label for="vuelo">Seleccionar Vuelo</label>
        <select id="vuelo" v-model="asignacion.vueloId" required>
          <option value="">Seleccionar vuelo</option>
          <option 
            v-for="vuelo in vuelos" 
            :key="vuelo.id" 
            :value="vuelo.id"
            :disabled="vuelo.pasajeros && vuelo.pasajeros.length >= vuelo.capacidad"
          >
            {{ vuelo.numero }} - {{ vuelo.origen }} → {{ vuelo.destino }} 
            ({{ vuelo.pasajeros ? vuelo.pasajeros.length : 0 }}/{{ vuelo.capacidad }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="pasajero">Seleccionar Pasajero</label>
        <select id="pasajero" v-model="asignacion.pasajeroId" required>
          <option value="">Seleccionar pasajero</option>
          <option 
            v-for="pasajero in pasajeros" 
            :key="pasajero.id" 
            :value="pasajero.id"
          >
            {{ pasajero.nombre }} - {{ pasajero.documento }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="asiento">Número de Asiento</label>
        <input
          id="asiento"
          v-model="asignacion.asiento"
          type="boolean"
          placeholder="Ej: 12A"
          required
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="cargando || !puedeAsignar">
        <span v-if="cargando">Asignando...</span>
        <span v-else>Asignar Pasajero</span>
      </button>
    </form>

    <div v-if="mensaje" class="mensaje" :class="mensaje.tipo">
      {{ mensaje.texto }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../main.js'

export default {
  name: 'AsignacionForm',
  props: {
    vuelos: {
      type: Array,
      default: () => []
    },
    pasajeros: {
      type: Array,
      default: () => []
    }
  },
  emits: ['asignacion-realizada'],
  setup(props, { emit }) {
    const asignacion = ref({
      vueloId: '',
      pasajeroId: '',
      asiento: ''
    })

    const cargando = ref(false)
    const mensaje = ref(null)

    const puedeAsignar = computed(() => {
      if (!asignacion.value.vueloId) return false
      
      const vuelo = props.vuelos.find(v => v.id === asignacion.value.vueloId)
      if (!vuelo) return false
      
      const pasajerosActuales = vuelo.pasajeros ? vuelo.pasajeros.length : 0
      return pasajerosActuales < vuelo.capacidad
    })

    const asignarPasajero = async () => {
      cargando.value = true
      mensaje.value = null

      try {
        const vuelo = props.vuelos.find(v => v.id === asignacion.value.vueloId)
        const pasajero = props.pasajeros.find(p => p.id === asignacion.value.pasajeroId)

        if (!vuelo || !pasajero) {
          throw new Error('Vuelo o pasajero no encontrado')
        }

        // Verificar si el pasajero ya está asignado a este vuelo
        if (vuelo.pasajeros && vuelo.pasajeros.some(p => p.pasajeroId === asignacion.value.pasajeroId)) {
          mensaje.value = {
            texto: 'El pasajero ya está asignado a este vuelo',
            tipo: 'error'
          }
          return
        }

        // Actualizar el vuelo agregando el pasajero
        await updateDoc(doc(db, 'vuelos', asignacion.value.vueloId), {
          pasajeros: arrayUnion({
            pasajeroId: asignacion.value.pasajeroId,
            nombre: pasajero.nombre,
            documento: pasajero.documento,
            asiento: asignacion.value.asiento,
            fechaAsignacion: new Date()
          })
        })

        // Actualizar el pasajero agregando el vuelo
        await updateDoc(doc(db, 'pasajeros', asignacion.value.pasajeroId), {
          vuelosAsignados: arrayUnion({
            vueloId: asignacion.value.vueloId,
            numeroVuelo: vuelo.numero,
            origen: vuelo.origen,
            destino: vuelo.destino,
            fecha: vuelo.fecha,
            hora: vuelo.hora,
            asiento: asignacion.value.asiento,
            fechaAsignacion: new Date()
          })
        })

        mensaje.value = {
          texto: 'Pasajero asignado exitosamente',
          tipo: 'success'
        }

        // Limpiar formulario
        asignacion.value = {
          vueloId: '',
          pasajeroId: '',
          asiento: ''
        }

        emit('asignacion-realizada')

        setTimeout(() => {
          mensaje.value = null
        }, 3000)

      } catch (error) {
        console.error('Error al asignar pasajero:', error)
        mensaje.value = {
          texto: 'Error al asignar el pasajero',
          tipo: 'error'
        }
      } finally {
        cargando.value = false
      }
    }

    return {
      asignacion,
      cargando,
      mensaje,
      puedeAsignar,
      asignarPasajero
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 100%;
}

.form-header {
  margin-bottom: 25px;
}

.form-header h2 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-header svg {
  color: #805ad5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

input, select {
  padding: 12px 16px;
  border: 2px solid #3c6ba9 ;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #805ad5;
  box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.1);
}

input::placeholder {
  color: #a0aec0;
}

select {
  cursor: pointer;
}

select option:disabled {
  color: #a0aec0;
}

.btn-primary {
  background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(128, 90, 213, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensaje {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

.mensaje.success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.mensaje.error {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #feb2b2;
}
</style>