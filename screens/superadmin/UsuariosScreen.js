import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/UsuariosStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { usuariosAPI } from '../../config/api';

const ROLES   = ['Todas', 'SUPER_ADMIN', 'DUENO', 'CLIENTE', 'BARBERO'];
const ESTADOS = ['Todos', 'Activo', 'Inactivo'];
const PAGE_SIZE = 10;

const ROL_LABEL = {
  SUPER_ADMIN: 'Super Admin',
  DUENO:       'Dueño',
  CLIENTE:     'Cliente',
  BARBERO:     'Barbero',
};

const UsuariosScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme }  = useTheme();
  const styles     = createStyles(width, theme);
  const isSmall    = width < 768;
  const iconColor  = theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const mutedIcon  = theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)';  

  const [usuarios, setUsuarios]       = useState([]);
  const [cargando, setCargando]       = useState(true);

  // ── Filtros ──
  const [filtroNombre,   setFiltroNombre]   = useState('');
  const [filtroCorreo,   setFiltroCorreo]   = useState('');
  const [filtroRol,      setFiltroRol]      = useState('Todas');
  const [filtroTelefono, setFiltroTelefono] = useState('');
  const [filtroEstado,   setFiltroEstado]   = useState('Todos');

  // ── Dropdowns ──
  const [dropRolVisible,    setDropRolVisible]    = useState(false);
  const [dropEstadoVisible, setDropEstadoVisible] = useState(false);

  // ── Paginación ──
  const [pagina, setPagina] = useState(1);

  // ── Eliminar ──
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [eliminando,       setEliminando]       = useState(false);
const [usuarioDetalle, setUsuarioDetalle] = useState(null);

  const [resultado, setResultado] = useState({
    visible: false, type: 'success', title: '', message: '',
  });

  // ── Carga ──
  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    const res = await usuariosAPI.listar2();
    setUsuarios(res.success ? res.data : []);
    setCargando(false);
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);
  useFocusEffect(useCallback(() => { cargarUsuarios(); }, [cargarUsuarios]));

  // ── Filtrado ──
  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = `${u.nombre} ${u.apellido}`.toLowerCase();
    return (
      nombre.includes(filtroNombre.toLowerCase()) &&
      u.email?.toLowerCase().includes(filtroCorreo.toLowerCase()) &&
      (filtroRol === 'Todas' || u.rol === filtroRol) &&
      (u.telefono?.includes(filtroTelefono) ?? !filtroTelefono) &&
      (filtroEstado === 'Todos' ||
        (filtroEstado === 'Activo'   && u.estado === 1) ||
        (filtroEstado === 'Inactivo' && u.estado !== 1))
    );
  });

  const totalPaginas  = Math.max(1, Math.ceil(usuariosFiltrados.length / PAGE_SIZE));
  const paginaActual  = Math.min(pagina, totalPaginas);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * PAGE_SIZE,
    paginaActual * PAGE_SIZE
  );

  useEffect(() => { setPagina(1); },
    [filtroNombre, filtroCorreo, filtroRol, filtroTelefono, filtroEstado]);

  const confirmarEliminar = async () => {
  if (!usuarioAEliminar) return;
  setEliminando(true);

  const res = await usuariosAPI.eliminar(usuarioAEliminar.id);

  setEliminando(false);

  if (!res.success) {
    setUsuarioAEliminar(null);
    setResultado({
      visible: true,
      type: 'error',
      title: 'No se pudo eliminar',
      message: res.error || 'Ocurrió un error al eliminar el usuario.',
    });
    return;
  }

  setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
  setUsuarioAEliminar(null);
  setResultado({
    visible: true,
    type: 'success',
    title: '¡Listo!',
    message: 'El usuario se eliminó correctamente.',
  });
};

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return 'N/A';
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
};

  const generarPaginas = () => {
    const paginas = [];
    const MAX  = isSmall ? 3 : 5;
    let inicio = Math.max(1, paginaActual - Math.floor(MAX / 2));
    let fin    = Math.min(totalPaginas, inicio + MAX - 1);
    if (fin - inicio < MAX - 1) inicio = Math.max(1, fin - MAX + 1);
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  };

  // ── Paginación (compartida web/móvil) ──
  const renderPaginacion = () => (
    <View style={styles.paginacion}>
      <Text style={styles.paginacionInfo}>
        Mostrando {(paginaActual - 1) * PAGE_SIZE + 1}–
        {Math.min(paginaActual * PAGE_SIZE, usuariosFiltrados.length)} de{' '}
        {usuariosFiltrados.length} resultados
      </Text>
      <View style={styles.paginacionBtns}>
        <TouchableOpacity
          style={[styles.pageBtn, paginaActual === 1 && styles.pageBtnDisabled]}
          onPress={() => setPagina(1)}
          disabled={paginaActual === 1}
        >
          <Ionicons name="play-skip-back" size={14} color={iconColor} />
        </TouchableOpacity>

        {generarPaginas().map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pageBtn, p === paginaActual && styles.pageBtnActive]}
            onPress={() => setPagina(p)}
          >
            <Text style={[styles.pageBtnText, p === paginaActual && styles.pageBtnTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.pageBtn, paginaActual === totalPaginas && styles.pageBtnDisabled]}
          onPress={() => setPagina(totalPaginas)}
          disabled={paginaActual === totalPaginas}
        >
          <Ionicons name="play-skip-forward" size={14} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Estado pill (reutilizable) ──
  const EstadoPill = ({ estado }) => (
    <View style={[styles.estadoPill, estado === 1 ? styles.estadoActivo : styles.estadoInactivo]}>
      <Text style={[styles.estadoPillText, estado !== 1 && styles.estadoPillTextOff]}>
        {estado === 1 ? 'Activo' : 'Inactivo'}
      </Text>
    </View>
  );

  // ── Acciones (reutilizables) ──
 const AccionesUsuario = ({ u }) => (
  <View style={styles.accionesRow}>
    <Tooltip label="Ver">
      <TouchableOpacity style={styles.accionBtn} onPress={() => setUsuarioDetalle(u)}>
        <Ionicons name="eye-outline" size={22} color={iconColor} />
      </TouchableOpacity>
    </Tooltip>
    <Tooltip label="Editar">
      <TouchableOpacity style={styles.accionBtn}
        onPress={() => navigation.navigate('EditarUsuarioScreen', { usuario: u })}>
        <Feather name="edit-2" size={20} color={iconColor} />
      </TouchableOpacity>
    </Tooltip>
    <Tooltip label="Eliminar">
      <TouchableOpacity style={styles.accionBtn} onPress={() => setUsuarioAEliminar(u)}>
        <Ionicons name="close-circle-outline" size={24} color={iconColor} />
      </TouchableOpacity>
    </Tooltip>
  </View>
);

  // ════════════════════════════
  //  RENDER MÓVIL
  // ════════════════════════════
  const renderMobile = () => (
    <>
      {/* Buscador */}
      <View style={styles.mobileSearch}>
        <Ionicons name="search" size={16} color="rgba(0,0,0,0.4)" />
        <TextInput
          style={styles.mobileSearchInput}
          placeholder="Buscar nombre..."
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={filtroNombre}
          onChangeText={setFiltroNombre}
        />
        {filtroNombre.length > 0 && (
          <TouchableOpacity onPress={() => setFiltroNombre('')}>
            <Ionicons name="close-circle" size={16} color="rgba(0,0,0,0.4)" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros en fila scrollable */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mobileFiltersRow}>
        <TouchableOpacity style={styles.mobileFilterPill}
          onPress={() => { setDropRolVisible(true); setDropEstadoVisible(false); }}>
          <Ionicons name="people-outline" size={14} color={iconColor} />
          <Text style={styles.mobileFilterPillText}>
            {filtroRol === 'Todas' ? 'Rol' : ROL_LABEL[filtroRol] || filtroRol}
          </Text>
          <Ionicons name="chevron-down" size={12} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mobileFilterPill}
          onPress={() => { setDropEstadoVisible(true); setDropRolVisible(false); }}>
          <Ionicons name="ellipse-outline" size={14} color={iconColor} />
          <Text style={styles.mobileFilterPillText}>
            {filtroEstado === 'Todos' ? 'Estado' : filtroEstado}
          </Text>
          <Ionicons name="chevron-down" size={12} color={iconColor} />
        </TouchableOpacity>

        {/* Reset filtros */}
        {(filtroRol !== 'Todas' || filtroEstado !== 'Todos') && (
          <TouchableOpacity style={[styles.mobileFilterPill, { backgroundColor: 'rgba(239,68,68,0.2)' }]}
            onPress={() => { setFiltroRol('Todas'); setFiltroEstado('Todos'); }}>
            <Ionicons name="close" size={14} color="#EF4444" />
            <Text style={[styles.mobileFilterPillText, { color: '#EF4444' }]}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Cards */}
      {cargando ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : usuariosPagina.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={36} color={mutedIcon} />
          <Text style={styles.emptyText}>No hay usuarios</Text>
        </View>
      ) : (
        usuariosPagina.map((u) => (
          <View key={u.id} style={styles.mobileCard}>
            <View style={styles.mobileCardHeader}>
              <Text style={styles.mobileCardName} numberOfLines={1}>
                {u.nombre} {u.apellido}
              </Text>
              <EstadoPill estado={u.estado} />
            </View>

            <View style={styles.mobileCardBody}>
              <View style={styles.mobileCardLine}>
                <Text style={styles.mobileCardLabel}>Correo</Text>
                <Text style={styles.mobileCardValue} numberOfLines={1}>{u.email}</Text>
              </View>
              <View style={styles.mobileCardLine}>
                <Text style={styles.mobileCardLabel}>Rol</Text>
                <Text style={styles.mobileCardValue}>{ROL_LABEL[u.rol] || u.rol}</Text>
              </View>
              <View style={styles.mobileCardLine}>
                <Text style={styles.mobileCardLabel}>Teléfono</Text>
                <Text style={styles.mobileCardValue}>{u.telefono || '—'}</Text>
              </View>
            </View>

            <View style={styles.mobileCardFooter}>
              <AccionesUsuario u={u} />
            </View>
          </View>
        ))
      )}

      {!cargando && usuariosFiltrados.length > 0 && renderPaginacion()}
    </>
  );

  // ════════════════════════════
  //  RENDER WEB (tabla)
  // ════════════════════════════
  const renderWeb = () => (
    <>
      {/* Barra de títulos */}
      <View style={styles.tableHeaderBar}>
        <Text style={[styles.thCell, styles.colNombre]}>Nombre</Text>
        <Text style={[styles.thCell, styles.colCorreo]}>Correo</Text>
        <Text style={[styles.thCell, styles.colRol]}>Rol</Text>
        <Text style={[styles.thCell, styles.colTelefono]}>Teléfono</Text>
        <Text style={[styles.thCell, styles.colEstado]}>Estado</Text>
        <Text style={[styles.thCell, styles.colAcciones]}>Acciones</Text>
      </View>

      {/* Card: filtros + filas + paginación */}
      <View style={styles.tableCard}>
        {/* Filtros */}
        <View style={styles.tableFilters}>
          <View style={[styles.filterCell, styles.colNombre]}>
            <TextInput style={styles.filterInput} value={filtroNombre}
              onChangeText={setFiltroNombre} placeholderTextColor="transparent" />
          </View>
          <View style={[styles.filterCell, styles.colCorreo]}>
            <TextInput style={styles.filterInput} value={filtroCorreo}
              onChangeText={setFiltroCorreo} placeholderTextColor="transparent" />
          </View>
          <View style={[styles.filterCell, styles.colRol]}>
            <TouchableOpacity style={styles.filterDropdown}
              onPress={() => { setDropRolVisible(true); setDropEstadoVisible(false); }}>
              <Text style={styles.filterDropdownText} numberOfLines={1}>
                {filtroRol === 'Todas' ? 'Todas' : ROL_LABEL[filtroRol] || filtroRol}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#15181F" />
            </TouchableOpacity>
          </View>
          <View style={[styles.filterCell, styles.colTelefono]}>
            <TextInput style={styles.filterInput} value={filtroTelefono}
              onChangeText={setFiltroTelefono} placeholderTextColor="transparent"
              keyboardType="phone-pad" />
          </View>
          <View style={[styles.filterCell, styles.colEstado]}>
            <TouchableOpacity style={styles.filterDropdown}
              onPress={() => { setDropEstadoVisible(true); setDropRolVisible(false); }}>
              <Text style={styles.filterDropdownText}>{filtroEstado}</Text>
              <Ionicons name="chevron-down" size={14} color="#15181F" />
            </TouchableOpacity>
          </View>
          <View style={[styles.filterCell, styles.colAcciones]} />
        </View>

        {/* Filas */}
        {cargando ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Cargando...</Text>
          </View>
        ) : usuariosPagina.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={36} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>No hay usuarios</Text>
          </View>
        ) : (
          usuariosPagina.map((u) => (
            <View key={u.id} style={styles.tableRow}>
              <Text style={[styles.tdCellName, styles.colNombre]} numberOfLines={1}>
                {u.nombre} {u.apellido}
              </Text>
              <Text style={[styles.tdCellMuted, styles.colCorreo]} numberOfLines={1}>
                {u.email}
              </Text>
              <Text style={[styles.tdCell, styles.colRol]} numberOfLines={1}>
                {ROL_LABEL[u.rol] || u.rol}
              </Text>
              <Text style={[styles.tdCell, styles.colTelefono]} numberOfLines={1}>
                {u.telefono || '—'}
              </Text>
              <View style={styles.colEstado}>
                <EstadoPill estado={u.estado} />
              </View>
              <View style={[styles.colAcciones, styles.accionesRow]}>
                <AccionesUsuario u={u} />
              </View>
            </View>
          ))
        )}

        {!cargando && usuariosFiltrados.length > 0 && renderPaginacion()}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <View style={styles.headerPill}>
            <Text style={styles.headerTitle}>Usuarios</Text>
          </View>
        </View>
        <View style={styles.headerSideRight} />
      </View>

      {/* ── Botón agregar ── */}
      <View style={styles.addButtonRow}>
        <Tooltip label="Agregar usuario">
          <TouchableOpacity style={styles.addBtn}
            onPress={() => navigation.navigate('EditarUsuarioScreen')}>
            <Ionicons name="add" size={24} color={iconColor} />
          </TouchableOpacity>
        </Tooltip>
      </View>

      {/* ── Contenido ── */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>
          {isSmall ? renderMobile() : renderWeb()}
        </View>
      </ScrollView>

      {/* ── Dropdown Rol ── */}
      {dropRolVisible && (
      <Modal transparent visible={dropRolVisible} animationType="fade"
        onRequestClose={() => setDropRolVisible(false)}>
        <TouchableOpacity style={styles.dropOverlay} activeOpacity={1}
          onPress={() => setDropRolVisible(false)}>
          <View style={styles.dropMenu}>
            {ROLES.map((r) => (
              <TouchableOpacity key={r}
                style={[styles.dropItem, filtroRol === r && styles.dropItemActive]}
                onPress={() => { setFiltroRol(r); setDropRolVisible(false); }}>
                <Text style={[styles.dropItemText, filtroRol === r && styles.dropItemTextActive]}>
                  {r === 'Todas' ? 'Todas' : ROL_LABEL[r] || r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
)}

      {/* ── Dropdown Estado ── */}
      {dropEstadoVisible && (
      <Modal transparent visible={dropEstadoVisible} animationType="fade"
        onRequestClose={() => setDropEstadoVisible(false)}>
        <TouchableOpacity style={styles.dropOverlay} activeOpacity={1}
          onPress={() => setDropEstadoVisible(false)}>
          <View style={styles.dropMenu}>
            {ESTADOS.map((e) => (
              <TouchableOpacity key={e}
                style={[styles.dropItem, filtroEstado === e && styles.dropItemActive]}
                onPress={() => { setFiltroEstado(e); setDropEstadoVisible(false); }}>
                <Text style={[styles.dropItemText, filtroEstado === e && styles.dropItemTextActive]}>
                  {e}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
)}

      {/* ── Modal eliminar ── */}
      {!!usuarioAEliminar && (
      <Modal transparent visible={!!usuarioAEliminar} animationType="fade"
        onRequestClose={() => setUsuarioAEliminar(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar usuario</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setUsuarioAEliminar(null)}>
  <Ionicons name="close" size={18} color={iconColor} />
</TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar a{' '}
              <Text style={{ fontWeight: '700' }}>
                {usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}
              </Text>
              ? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel}
                onPress={() => setUsuarioAEliminar(null)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmarEliminar}>
                <Text style={styles.modalBtnConfirmText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
)}

      {/* ── Modal: detalle de usuario ── */}
{!!usuarioDetalle && (
  <Modal
    transparent
    visible
    animationType="fade"
    onRequestClose={() => setUsuarioDetalle(null)}
  >
  <View style={styles.detalleOverlay}>
    <View style={styles.detalleCard}>
      <TouchableOpacity style={styles.detalleCloseBtn} onPress={() => setUsuarioDetalle(null)}>
  <Ionicons name="close" size={20} color={iconColor} />
</TouchableOpacity>

      <View style={styles.detalleAvatar}>
        {usuarioDetalle?.fotoPerfil ? (
          <Image
            source={{ uri: usuarioDetalle.fotoPerfil }}
            style={styles.detalleAvatarImage}
          />
        ) : (
          <Ionicons name="person" size={36} color="#9CA3AF" />
        )}
      </View>

      <Text style={styles.detalleNombre}>
        {usuarioDetalle?.nombre} {usuarioDetalle?.apellido}
      </Text>

      <View style={styles.detalleLine}>
        <Text style={styles.detalleLabel}>Email:</Text>
        <Text style={styles.detalleValue}>{usuarioDetalle?.email}</Text>
      </View>

      <View style={styles.detalleLine}>
        <Text style={styles.detalleLabel}>Telefono:</Text>
        <Text style={styles.detalleValue}>{usuarioDetalle?.telefono || '—'}</Text>
      </View>

      <View style={styles.detalleLine}>
        <Text style={styles.detalleLabel}>Rol:</Text>
        <Text style={styles.detalleValue}>
          {ROL_LABEL[usuarioDetalle?.rol] || usuarioDetalle?.rol}
        </Text>
      </View>

      <View style={styles.detalleLine}>
        <Text style={styles.detalleLabel}>Estado:</Text>
        <View
          style={[
            styles.detalleEstadoDot,
            usuarioDetalle?.estado !== 1 && styles.detalleEstadoDotOff,
          ]}
        />
        <Text style={styles.detalleValue}>
          {usuarioDetalle?.estado === 1 ? 'Activo' : 'Inactivo'}
        </Text>
      </View>

      <View style={styles.detalleLine}>
        <Text style={styles.detalleLabel}>Fecha Registro:</Text>
        <Text style={styles.detalleValue}>
          {formatearFecha(usuarioDetalle?.createdAt)}
        </Text>
      </View>
    </View>
  </View>
</Modal>
)}
      <LoadingOverlay visible={cargando}   message="Cargando usuarios..." />
      <LoadingOverlay visible={eliminando} message="Eliminando usuario..." />
      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() => setResultado((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
};

export default UsuariosScreen;