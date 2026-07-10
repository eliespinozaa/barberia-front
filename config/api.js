import AsyncStorage from '@react-native-async-storage/async-storage';


const URL = {
  URL_SERVICE:       'http://localhost:8080',  
  //URL_SERVICE:       'https://administrative-service.onrender.com',    

          
};
// ─────────────────────────────────────────

const API_CONFIG = {
  URL:     URL.URL_SERVICE,
  TIMEOUT: 30000,
};

export default API_CONFIG;

const TOKEN_KEY = '@barber_token';
const USER_KEY  = '@barber_user';

export const tokenManager = {
  saveToken: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
  getUser: async () => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  getUserData: async () => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  clearToken: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
  clearAll: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = await tokenManager.getToken();
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  return await response.json();
};

export const authAPI = {

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }),
      });
      const data = await response.json();

      if (data?.code === 200 && data?.data?.token) {
        const user = {
  id:               data.data.id,
  email:            data.data.correo,
  correo:           data.data.correo,
  name:             data.data.nombreCompleto,
  nombreCompleto:   data.data.nombreCompleto,
  rol:              data.data.rol,
  clienteAsociado:  data.data.clienteAsociado,
};
        await tokenManager.saveToken(data.data.token, user);
        return { success: true, data: user };
      }

      return {
        success: false,
        error: data?.description || 'Credenciales incorrectas',
      };
    } catch (error) {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  logout: async () => {
    await tokenManager.clearToken();
  },

  register: async (payload) => {
    try {
      const response = await fetch(`${API_CONFIG.URL}/usuarios/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await response.json();

      if (res?.code === 200 || res?.code === 201 || res?.data) {
        return { success: true, data: res.data || res };
      }

      return {
        success: false,
        message: res?.description || 'Error al registrar usuario',
      };
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },

};

export const clienteAPI = {

  asociarBarberia: async (barberiaId, clienteId) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/cliente-barberia/asociar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clienteId, barberiaId }),
      });
      const data = await response.json();
      if (data?.code === 200 || data?.code === 201) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'Error al asociar barbería' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  listarPorBarberia: async (barberiaId) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(
        `${API_CONFIG.URL}/cliente-barberia/listar?barberiaId=${barberiaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener los clientes' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  asociarBarberiaLocal: async (barberia) => {
    try {
      const userActual = await tokenManager.getUser();
      const userActualizado = {
        ...userActual,
        clienteAsociado: barberia.id,
        barberiaInfo: barberia,
      };
      await AsyncStorage.setItem('@barber_user', JSON.stringify(userActualizado));
      return { success: true, data: userActualizado };
    } catch (error) {
      return { success: false, error: 'Error al guardar localmente' };
    }
  },


  obtenerBarberiaAsociada: async (clienteId) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(
        `${API_CONFIG.URL}/cliente-barberia/barberia?clienteId=${clienteId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = await response.json();
      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se encontró barbería asociada' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },
};

export const barberiaAPI = {

  listar: async () => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/barberia/barberias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener las barberías' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  listar2: async () => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/listar/barberias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener las barberías' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/barberia/barberias/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  crear: async (payload) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/barberia/barberias`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data?.code === 200 || data?.code === 201) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  actualizar: async (id, payload) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/barberia/barberias/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },


  
  eliminar: async (id) => {
  try {
    const token = await tokenManager.getToken();

    const response = await fetch(
      `${API_CONFIG.URL}/barberia/barberias/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const data = await parseResponse(response);

    if (data?.code === 200) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description };

  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

  cambiarEstado: async (id, activar) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/barberia/barberias/${id}/estado`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ activar }),
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },
  

obtenerPorUsuario: async (idUsuario) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(
      `${API_CONFIG.URL}/barberia/barberias/usuario/${idUsuario}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    const data = await response.json();
    if (data?.code === 200) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},
};

export const usuariosAPI = {

  listar2: async () => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/listar/usuarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener los usuarios' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/usuarios/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },



  actualizar: async (id, payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },


  crear: async (payload) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data?.code === 200 || data?.code === 201) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description || 'No se pudo crear el usuario' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

eliminar: async (id) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await parseResponse(response);
    if (data?.code === 200) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description || 'No se pudo eliminar el usuario' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

};


export const suscripcionAPI = {

  obtenerActiva: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/suscripciones/barberia/${idBarberia}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  suspender: async (idSuscripcion) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/suscripciones/${idSuscripcion}/suspender`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo suspender la membresía' };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  reactivar: async (idSuscripcion) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/suscripciones/${idSuscripcion}/reactivar`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo reactivar la membresía' };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

};

export const pagoAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/pagos/barberia/${idBarberia}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener los pagos' };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  registrarPago: async (idPago, payload) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/pagos/${idPago}/registrar`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo registrar el pago' };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

};


const parseResponse = async (response) => {
  if (response.status === 204) {
    return { code: 200, data: null };
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
};

export const barberoAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();

      const response = await fetch(
        `${API_CONFIG.URL}/barberos/barberia/${idBarberia}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener los barberos' };

    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  actualizar: async (id, payload) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/barberos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data?.code === 200) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

crear: async (payload) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/barberos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data?.code === 200) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description || 'No se pudo crear el barbero' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

eliminar: async (id) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/barberos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await parseResponse(response);

    if (response.status === 204 || data?.code === 200) {
      return { success: true, data: data?.data ?? null };
    }
    return { success: false, error: data?.description || 'No se pudo eliminar el barbero' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},

};



export const servicioAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/servicios/barberia/${idBarberia}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener los servicios' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  crear: async (payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/servicios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo crear el servicio' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  actualizar: async (id, payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/servicios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo actualizar el servicio' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  eliminar: async (id) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/servicios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await parseResponse(response);
      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo eliminar el servicio' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

};



export const citaAPI = {
  historial: async (clienteId, barberiaId) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(
        `${API_CONFIG.URL}/citas/historial?clienteId=${clienteId}&barberiaId=${barberiaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo obtener el historial' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  
  listarPorFecha: async (idBarberia, fecha) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(
        `${API_CONFIG.URL}/citas/barberia/${idBarberia}/dia?fecha=${fecha}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener las citas' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  confirmar: async (idCita) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/citas/${idCita}/confirmar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo confirmar la cita' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  cancelar: async (idCita) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/citas/${idCita}/cancelar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo cancelar la cita' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  finalizar: async (idCita) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/citas/${idCita}/finalizar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo finalizar la cita' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },



  crear: async (payload) => {
  try {
    const token = await tokenManager.getToken();
    const response = await fetch(`${API_CONFIG.URL}/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data?.code === 200 || data?.code === 201) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data?.description || 'No se pudo agendar la cita' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
},
};


export const promocionAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/promociones/barberia/${idBarberia}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudieron obtener las promociones' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

  crear: async (payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/promociones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200 || data?.code === 201) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo crear la promoción' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

  editar: async (id, payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/promociones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo actualizar la promoción' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

  eliminar: async (id) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/promociones/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await parseResponse(response);
      if (data?.code === 200) return { success: true };
      return { success: false, error: data?.description || 'No se pudo eliminar la promoción' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

};


export const horarioAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/horarios/barberia/${idBarberia}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo obtener el horario' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

  crear: async (payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/horarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200 || data?.code === 201) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo crear el horario' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

  actualizar: async (id, payload) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/horarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.code === 200) return { success: true, data: data.data };
      return { success: false, error: data?.description || 'No se pudo actualizar el horario' };
    } catch { return { success: false, error: 'Error de conexión' }; }
  },

};


export const resenaAPI = {

  listarPorBarberia: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/resenas/barberia/${idBarberia}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200 && Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudieron obtener las reseñas' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  resumen: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/resenas/barberia/${idBarberia}/resumen`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo obtener el resumen' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

};



export const dashboardAPI = {

  obtenerResumen: async (idBarberia) => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/dashboard/barberia/${idBarberia}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data?.code === 200) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data?.description || 'No se pudo obtener el resumen' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

};