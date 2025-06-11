<template>
  <div class="form-container">
    <div class="form-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.8 19.2 16 18l-1.8-1.2-1.8 1.2L16 18l1.8 1.2z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 9h20L12 2 2 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 22V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Agregar Vuelo
      </h2>
    </div>
    
    <form @submit.prevent="agregarVuelo" class="form">
      <div class="form-group">
        <label for="numero">Número de Vuelo</label>
        <input
          id="numero"
          v-model="vuelo.numero"
          type="text"
          placeholder="Ej: AA123"
          required
        />
      </div>

      <div class="form-group">
        <label for="origen">Origen</label>
        <input
          id="origen"
          v-model="vuelo.origen"
          type="text"
          placeholder="Ciudad de origen"
          required
        />
      </div>

      <div class="form-group">
        <label for="destino">Destino</label>
        <input
          id="destino"
          v-model="vuelo.destino"
          type="text"
          placeholder="Ciudad de destino"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="fecha">Fecha</label>
          <input
            id="fecha"
            v-model="vuelo.fecha"
            type="date"
            required
          />
        </div>

        <div class="form-group">
          <label for="hora">Hora</label>
          <input
            id="hora"
            v-model="vuelo.hora"
            type="time"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="capacidad">Capacidad</label>
        <input
          id="capacidad"
          v-model.number="vuelo.capacidad"
          type="number"
          min="1"
          placeholder="Número de asientos"
          required
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="cargando">
        <span v-if="cargando">Agregando...</span>
        <span v-else>Agregar Vuelo</span>
      </button>
    </form>

    <div v-if="mensaje" class="mensaje" :class="mensaje.tipo">
      {{ mensaje.texto }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../main.js'

export default {
  name: 'VueloForm',
  emits: ['vuelo-agregado'],
  setup(props, { emit }) {
    const vuelo = ref({
      numero: '',
      origen: '',
      destino: '',
      fecha: '',
      hora: '',
      capacidad: null
    })

    const cargando = ref(false)
    const mensaje = ref(null)

    const agregarVuelo = async () => {
      cargando.value = true
      mensaje.value = null

      try {
        await addDoc(collection(db, 'vuelos'), {
          ...vuelo.value,
          pasajeros: [],
          fechaCreacion: new Date()
        })

        mensaje.value = {
          texto: 'Vuelo agregado exitosamente',
          tipo: 'success'
        }

        // Limpiar formulario
        vuelo.value = {
          numero: '',
          origen: '',
          destino: '',
          fecha: '',
          hora: '',
          capacidad: null
        }

        emit('vuelo-agregado')

        setTimeout(() => {
          mensaje.value = null
        }, 3000)

      } catch (error) {
        console.error('Error al agregar vuelo:', error)
        mensaje.value = {
          texto: 'Error al agregar el vuelo',
          tipo: 'error'
        }
      } finally {
        cargando.value = false
      }
    }

    return {
      vuelo,
      cargando,
      mensaje,
      agregarVuelo
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
  color: #4299e1;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

input {
  padding: 12px 16px;
  border: 2px solid #3c6ba9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

input::placeholder {
  color: #a0aec0;
}

.btn-primary {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
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
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>