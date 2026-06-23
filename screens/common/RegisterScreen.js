import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Switch, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../../config/api';
import ToastAlert from '../../components/ToastAlert';
import { useTheme } from '../../context/ThemeContext';
import { useWindowDimensions } from 'react-native';
import createStyles from '../../styles/common/RegisterStyles';


const RegisterScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const [nombre, setNombre]               = useState('');
  const [correo, setCorreo]               = useState('');
  const [telefono, setTelefono]           = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [estatus, setEstatus]             = useState(true);
  const [showPass, setShowPass]           = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [toast, setToast]                 = useState({ visible: false, type: 'info', message: '' }); // ← aquí adentro

  const showToast = (type, message, duration = 3000) => { // ← aquí adentro
    setToast({ visible: true, type, message });
    if (type !== 'loading') {
      setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
    }
  };

  const handleRegister = async () => {
    if (!nombre || !correo || !telefono || !password || !confirmPassword) {
      showToast('error', 'Completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    showToast('loading', 'Creando tu cuenta...');

    const nombres  = nombre.trim().split(' ');
    const apellido = nombres.length > 1 ? nombres.slice(1).join(' ') : 'N/A';

    const payload = {
      nombre:   nombres[0],
      apellido: apellido,
      correo:   correo,
      email:    correo,
      password: password,
      telefono: telefono,
      rolId:    3,
      estado:   estatus ? 1 : 0,
    };

    const res = await authAPI.register(payload);
    console.log('REGISTER RESPONSE:', JSON.stringify(res));
    setLoading(false);

    if (res.success) {
  showToast('success', `🎉 ¡Bienvenido ${nombres[0]}! Cuenta creada`);
  setTimeout(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, 1800);
} else {
  showToast('error', res.message || 'No se pudo crear la cuenta');
}
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.centerWrapper}>
            <View style={styles.header}>
              <Text style={styles.greeting}>Hola, Bienvenido a</Text>
              <View style={styles.logoWrap}>
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="cut" size={28} color="#C9A84C" />
                  <Text style={styles.logoText}>BARBER</Text>
                  <Text style={styles.logoSubText}>SYSTEM</Text>
                </View>
              </View>
              <Text style={styles.title}>Registrate</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.formGrid}>

                <View style={styles.column}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Nombre completo"
                      placeholderTextColor="#999" value={nombre} onChangeText={setNombre} />
                  </View>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Correo</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="tu@correo.com"
                      placeholderTextColor="#999" value={correo} onChangeText={setCorreo}
                      keyboardType="email-address" autoCapitalize="none" />
                  </View>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="10 dígitos"
                      placeholderTextColor="#999" value={telefono} onChangeText={setTelefono}
                      keyboardType="phone-pad" />
                  </View>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Nueva Contraseña</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="••••••••"
                      placeholderTextColor="#999" secureTextEntry={!showPass}
                      value={password} onChangeText={setPassword} />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                      <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Estatus</Text>
                  <View style={styles.switchContainer}>
                    <Switch value={estatus} onValueChange={setEstatus} />
                  </View>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Confirmar Contraseña</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="••••••••"
                      placeholderTextColor="#999" secureTextEntry={!showConfirmPass}
                      value={confirmPassword} onChangeText={setConfirmPassword} />
                    <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirmPass ? 'eye-outline' : 'eye-off-outline'} size={18} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>

              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.6 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.btnText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ToastAlert visible={toast.visible} type={toast.type} message={toast.message} />
    </SafeAreaView>
  );
};

export default RegisterScreen;