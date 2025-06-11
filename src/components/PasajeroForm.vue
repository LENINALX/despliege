<template>
  <div class="form-container">
    <div class="form-header">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Agregar Pasajero
      </h2>
    </div>
    
    <form @submit.prevent="agregarPasajero" class="form">
      <div class="form-group">
        <label for="nombre">Nombre Completo</label>
        <input
          id="nombre"
          v-model="pasajero.nombre"
          type="text"
          placeholder="Nombre y apellidos"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="pasajero.email"
          type="email"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input
          id="telefono"
          v-model="pasajero.telefono"
          type="tel"
          placeholder="+1234567890"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="documento">Documento</label>
          <input
            id="documento"
            v-model="pasajero.documento"
            type="text"
            placeholder="Cédula o pasaporte"
            required
          />
        </div>

        <div class="form-group">
          <label for="fechaNacimiento">Fecha de Nacimiento</label>
          <input
            id="fechaNacimiento"
            v-model="pasajero.fechaNacimiento"
            type="date"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="nacionalidad">Nacionalidad</label>
        <select id="nacionalidad" v-model="pasajero.nacionalidad" required>
          <option value="">Seleccionar nacionalidad</option>
          <option value="Argentina">Argentina</option>
          <option value="Brasil">Brasil</option>
          <option value="Chile">Chile</option>
          <option value="Colombia">Colombia</option>
          <option value="Ecuador">Ecuador</option>
          <option value="España">España</option>
          <option value="Estados Unidos">Estados Unidos</option>
          <option value="México">México</option>
          <option value="Perú">Perú</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Venezuela">Venezuela</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <button type="submit" class="btn-primary" :disabled="cargando">
        <span v-if="cargando">Agregando...</span>
        <span v-else>Agregar Pasajero</span>
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
  name: 'PasajeroForm',
  emits: ['pasajero-agregado'],
  setup(props, { emit }) {
    const pasajero = ref({
      nombre: '',
      email: '',
      telefono: '',
      documento: '',
      fechaNacimiento: '',
      nacionalidad: ''
    })

    const cargando = ref(false)
    const mensaje = ref(null)

    const agregarPasajero = async () => {
      cargando.value = true
      mensaje.value = null

      try {
        await addDoc(collection(db, 'pasajeros'), {
          ...pasajero.value,
          vuelosAsignados: [],
          fechaRegistro: new Date()
        })

        mensaje.value = {
          texto: 'Pasajero agregado exitosamente',
          tipo: 'success'
        }

        // Limpiar formulario
        pasajero.value = {
          nombre: '',
          email: '',
          telefono: '',
          documento: '',
          fechaNacimiento: '',
          nacionalidad: ''
        }

        emit('pasajero-agregado')

        setTimeout(() => {
          mensaje.value = null
        }, 3000)

      } catch (error) {
        console.error('Error al agregar pasajero:', error)
        mensaje.value = {
          texto: 'Error al agregar el pasajero',
          tipo: 'error'
        }
      } finally {
        cargando.value = false
      }
    }

    return {
      pasajero,
      cargando,
      mensaje,
      agregarPasajero
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
  color: #38a169;
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

input, select {
  padding: 12px 6px;
  border: 2px solid #3c6ba9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #38a169;
  box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
}

input::placeholder {
  color: #a0aec0;
}

select {
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
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
  box-shadow: 0 8px 25px rgba(56, 161, 105, 0.3);
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