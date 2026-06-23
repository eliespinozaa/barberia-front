import AsyncStorage from '@react-native-async-storage/async-storage';


const URL = {
  URL_SERVICE:       'http://localhost:8080',            
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
      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      error: data?.description,
    };

  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión',
    };
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
      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      error: data?.description,
    };

  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión',
    };
  }
},

};

export const usuariosAPI = {
  listar2: async () => {
    try {
      const token = await tokenManager.getToken();
      const response = await fetch(`${API_CONFIG.URL}/usuarios/listar`, {
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


};