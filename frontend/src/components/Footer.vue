<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-top">

          <form class="footer-form" @submit.prevent="handleSubmit">
            <h3>Contáctanos:</h3>
            <div class="input-icon">
              <span class="material-icons-outlined">person</span>
              <input
                v-model="form.name"
                type="text"
                placeholder="Nombre"
                :class="{ 'input-error': errors.name }"
                autocomplete="off"
              />
            </div>
            <span v-if="errors.name" class="input-error-message">{{ errors.name }}</span>
            <div class="input-icon">
              <span class="material-icons-outlined">email</span>
              <input
                v-model="form.email"
                type="email"
                placeholder="Correo electrónico"
                :class="{ 'input-error': errors.email }"
                autocomplete="off"
              />
            </div>
            <span v-if="errors.email" class="input-error-message">{{ errors.email }}</span>
            <div class="input-icon">
              <span class="material-icons-outlined">message</span>
              <textarea
                v-model="form.message"
                placeholder="Tu mensaje"
                :class="{ 'input-error': errors.message }"
                rows="3"
              ></textarea>
            </div>
            <span v-if="errors.message" class="input-error-message">{{ errors.message }}</span>
            <button type="submit" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Enviar' }}
            </button>
            <p v-if="success" class="success-message">{{ success }}</p>
          </form>
          
        <div class="footer-brand">
          <p class="footer-desc">
            Conectamos <span class="highlight">empresas</span> y <span class="highlight">desarrolladores</span> con las mejores oportunidades tecnológicas.
          </p>
          
          <div class="footer-info">
              <div class="footer-links">
                <h2>Links</h2>
                <a href="/offers">Empresas</a>
                <a href="/developers">Desarrolladores</a>
              </div>

              <div class="footer-privacy">
                <h2>Legal</h2>
                <a href="/">Política de privacidad</a>
                <a href="/">Condicciones y restricciones</a>
                <a href="/">Avisos legales</a>
              </div>


          </div>
          
        </div>


      </div>
      <div class="footer-bottom">
        <span>© {{ year }} JobsXDevs. Todos los derechos reservados.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'


const year = new Date().getFullYear()
const form = ref({ name: '', email: '', message: '' })
const errors = ref({})
const success = ref('')
const loading = ref(false)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Funcion para manejar el envío del formulario de contacto
async function handleSubmit() {
  errors.value = {}
  success.value = ''
  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre es obligatorio.'
  }
  if (!form.value.email.trim()) {
    errors.value.email = 'El correo es obligatorio.'
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = 'Correo inválido.'
  }
  if (!form.value.message.trim()) {
    errors.value.message = 'El mensaje es obligatorio.'
  }
  if (Object.keys(errors.value).length) return

  loading.value = true
  try {
    await axios.post('/api/contact', form.value)
    success.value = 'Gracias por escribirnos, nos pondremos en contacto pronto.'
    form.value = { name: '', email: '', message: '' }
  } catch (e) {
    errors.value.message = 'No se pudo enviar el mensaje. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss" scoped>
.main-footer {
  width: 100%;
  max-width: 100%;
  background: var(--black);
  color: var(--white);
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding: 3rem 4rem 2rem 4rem;
  margin-top: 0rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-top {
  display: flex;
  gap: 8rem;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.footer-brand {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding-top: 2rem;
  justify-items: center;
  gap: 2rem;
  height: 400px;
}

.footer-logo {
  width: 160px;
  margin-bottom: 0.5rem;
}

.footer-desc {
  color: var(--white);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-align: left;
}

.footer-desc .highlight {
  color: var(--green-light);
  font-weight: 600;
}

.footer-links,
.footer-privacy {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.2rem;
}

.footer-links a {
  color: var(--green-light);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--white);
}


.footer-social a:hover {
  color: var(--white);
}

.footer-form {
  flex: 1 1 320px;
  background: var(--black);
  color: var(--white);
  border-radius: 24px;
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 320px;
  max-width: 450px;
}

.footer-form h3 {
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  text-align: left;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
}

.input-icon .material-icons-outlined {
  position: absolute;
  left: 16px;
  top: 13px;
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.input-icon input,
.input-icon textarea {
  width: 100%;
  height: 45px;
  padding-left: 44px;
  padding-right: 12px;
  border-radius: 50px;
  border: 1px solid var(--white);
  font-size: 1rem;
  font-family: inherit;
  color: var(--white);
  background: transparent;
  outline: none;
  margin-bottom: 0.1rem;
  transition: border 0.2s;
  resize: none;
}

.input-icon textarea {
  border-radius: 18px;
  min-height: 70px;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  min-height: 80px;
  max-height: 200px;
}

.input-icon input:focus,
.input-icon textarea:focus {
  border-color: var(--green-light);
}

.input-error {
  border-color: var(--green-light) !important;
}

.input-error-message {
  color: var(--green-light);
  font-size: 0.95em;
  margin-bottom: 0.2em;
  margin-left: 8px;
}

.footer-form button {
  margin-top: 0.7rem;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.7em 2.2em;
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  width: 100%;
}

.footer-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer-form button:hover:not(:disabled) {
  background: var(--black);
  color: var(--green-light);
  border: 1.5px solid var(--green-light);
}

.success-message {
  color: var(--green-light);
  font-size: 1.05em;
  margin-top: 0.7em;
  text-align: center;
}

.footer-bottom {
  width: 100%;
  text-align: center;
  color: var(--white);
  font-size: 1rem;
  margin-top: 1.5rem;
  opacity: 0.7;
}

.footer-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 6rem;
}

// Estilos responsivos

@media (max-width: 900px) {
  .footer-content {
    padding: 0 1rem;
  }
  .footer-top {
    flex-direction: column;
    gap: 2.5rem;
    align-items: center;
  }
  
  .footer-brand, .footer-form {
    width: 100%;
    max-width: 400px;
    min-width: 0;
    align-items: center;
  }
  .footer-form {
    padding: 1.5rem 1rem 1rem 1rem;
  }
  .footer-form input {
    height: 50px;
    width: 350px;
    min-width: 300px;
  }
  .footer-form textarea {
    width: 350px;
    height: auto;
    min-height: 80px;
}
}

@media (max-width: 600px) {
  .main-footer {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 2rem 0 1rem 0;
  }
  .footer-form {
    padding: 1rem 0.5rem 0.7rem 0.5rem;
    font-size: 0.98rem;
  }
  .footer-form input {
    height: 50px;
    width: 300px;
    min-width: 300px;
  }
  .footer-form textarea {
    width: 300px;
    min-width: 300px;
    height: auto;
    min-height: 80px;
    }
    
  .footer-brand {
    padding: 2rem;
    font-size: 0.9rem;
    text-align: center;
    gap: 1.5rem;
  }
  .footer-links a {
    color: var(--green-light);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: color 0.2s;
    }
    .footer-form button {
      padding: 0.6em 1.5em;
      font-size: 1rem;
      min-width: 300px;
      width: 300px;
    }
}
</style>