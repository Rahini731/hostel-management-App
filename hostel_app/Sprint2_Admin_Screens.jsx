// ============================================================
//  SPRINT 2 — Admin Screens
//  Screens: StudentListScreen, AddEditStudentScreen,
//           CSVImportScreen, RoomDashboardScreen,
//           AddRoomScreen, AllocateRoomScreen
//  Dependencies: same as Sprint 1 + expo-document-picker
//                @expo/vector-icons (optional icons)
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, ScrollView, ActivityIndicator,
  Alert, Platform,
} from 'react-native';

// ─── Design Tokens ──────────────────────────────────────────
const C = {
  primary:      '#534AB7',
  primaryLight: '#EEEDFE',
  primaryDark:  '#3C3489',
  teal:         '#0F6E56',
  tealLight:    '#E1F5EE',
  amber:        '#854F0B',
  amberLight:   '#FAEEDA',
  coral:        '#993C1D',
  coralLight:   '#FAECE7',
  bg:           '#FFFFFF',
  surface:      '#F5F5F3',
  border:       'rgba(0,0,0,0.12)',
  text:         '#1A1A1A',
  muted:        '#6B6B6B',
  hint:         '#ABABAB',
  success:      '#0F6E56',
  danger:       '#E24B4A',
};

// ─── Shared UI ───────────────────────────────────────────────
const PrimaryButton = ({ label, onPress, loading, disabled }) => (
  <TouchableOpacity
    style={[s.btnP, disabled && { opacity: 0.5 }]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}
  >
    {loading ? <ActivityIndicator color="#fff" size="small" />
      : <Text style={s.btnPText}>{label}</Text>}
  </TouchableOpacity>
);

const SecondaryButton = ({ label, onPress }) => (
  <TouchableOpacity style={s.btnSec} onPress={onPress} activeOpacity={0.7}>
    <Text style={s.btnSecText}>{label}</Text>
  </TouchableOpacity>
);

const Field = ({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={s.fieldLabel}>{label}</Text>
    <TextInput
      style={s.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.hint}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

const Avatar = ({ initials, bg = C.primaryLight, color = C.primaryDark, size = 38 }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
  }}>
    <Text style={{ fontSize: size * 0.32, fontWeight: '500', color }}>{initials}</Text>
  </View>
);

const StatusBadge = ({ label, type = 'success' }) => {
  const map = {
    success: { bg: C.tealLight, color: '#085041' },
    warning: { bg: C.amberLight, color: '#633806' },
    danger:  { bg: C.coralLight, color: C.coral },
    info:    { bg: C.primaryLight, color: C.primaryDark },
  };
  const { bg, color } = map[type] || map.success;
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
      <Text style={{ fontSize: 11, color, fontWeight: '500' }}>{label}</Text>
    </View>
  );
};

// ─── Mock Data ───────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: '1', name: 'Ravi Kumar',    initials: 'RK', course: 'CS',   year: '2nd', room: 'A-201', status: 'active',  avatarBg: C.primaryLight, avatarColor: C.primaryDark },
  { id: '2', name: 'Priya Selvan',  initials: 'PS', course: 'ECE',  year: '3rd', room: 'B-104', status: 'active',  avatarBg: C.tealLight,    avatarColor: '#085041' },
  { id: '3', name: 'Arjun Mehta',   initials: 'AM', course: 'Mech', year: '2nd', room: null,    status: 'noroom',  avatarBg: C.amberLight,   avatarColor: '#633806' },
  { id: '4', name: 'Divya Varma',   initials: 'DV', course: 'CS',   year: '1st', room: 'A-301', status: 'active',  avatarBg: C.coralLight,   avatarColor: '#712B13' },
  { id: '5', name: 'Karthik Rajan', initials: 'KR', course: 'IT',   year: '4th', room: 'C-101', status: 'active',  avatarBg: C.primaryLight, avatarColor: C.primaryDark },
];

const MOCK_ROOMS = [
  { id: '1', number: 'A-101', block: 'A', floor: 1, type: 'Double', capacity: 2, occupied: 2, status: 'full' },
  { id: '2', number: 'A-102', block: 'A', floor: 1, type: 'Double', capacity: 2, occupied: 1, status: 'partial' },
  { id: '3', number: 'A-103', block: 'A', floor: 1, type: 'Single', capacity: 1, occupied: 0, status: 'vacant' },
  { id: '4', number: 'B-201', block: 'B', floor: 2, type: 'Triple', capacity: 3, occupied: 0, status: 'maintenance' },
  { id: '5', number: 'B-202', block: 'B', floor: 2, type: 'Double', capacity: 2, occupied: 2, status: 'full' },
];

// ─── 1. Student List ─────────────────────────────────────────
export function StudentListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const courses = ['All', 'CS', 'ECE', 'Mech', 'IT'];

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase())
        || (s.room ?? '').toLowerCase().includes(query.toLowerCase());
      const matchC = filterCourse === 'All' || s.course === filterCourse;
      return matchQ && matchC;
    });
  }, [query, filterCourse]);

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={s.studentRow}
      onPress={() => navigation.navigate('AddEditStudent', { student: item })}
      activeOpacity={0.7}
    >
      <Avatar initials={item.initials} bg={item.avatarBg} color={item.avatarColor} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={s.studentName}>{item.name}</Text>
        <Text style={s.studentMeta}>{item.course} · {item.room ? `Room ${item.room}` : 'Unassigned'}</Text>
      </View>
      {item.status === 'active'
        ? <StatusBadge label="Active" type="success" />
        : <StatusBadge label="No room" type="warning" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Students</Text>
        <View style={{ flexDirection: 'row', marginRight: 8 }}>
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('FeeDashboard')}>
            <Text style={s.iconBtnText}>Fees</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, { marginLeft: 8 }]} onPress={() => navigation.navigate('CSVImport')}>
            <Text style={s.iconBtnText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary, marginLeft: 8 }]}
            onPress={() => navigation.navigate('AddEditStudent', { student: null })}>
            <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={s.searchBar}>
          <Text style={{ fontSize: 14, color: C.hint }}>⌕</Text>
          <TextInput
            style={{ flex: 1, fontSize: 14, color: C.text, marginLeft: 6 }}
            placeholder="Search name, room, course…"
            placeholderTextColor={C.hint}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {courses.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.chip, filterCourse === c && s.chipActive]}
              onPress={() => setFilterCourse(c)}
            >
              <Text style={[s.chipText, filterCourse === c && s.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderStudent}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: C.border }} />}
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No students found</Text>}
      />
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={{ fontSize: 12, color: C.hint, textAlign: 'center' }}>{MOCK_STUDENTS.length} students total</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── 2. Add / Edit Student ────────────────────────────────────
export function AddEditStudentScreen({ navigation, route }) {
  const existing = route.params?.student ?? null;
  const isEdit = !!existing;

  const [form, setForm] = useState({
    name:           existing?.name          ?? '',
    email:          existing?.email         ?? '',
    phone:          existing?.phone         ?? '',
    course:         existing?.course        ?? '',
    year:           existing?.year          ?? '',
    guardianName:   existing?.guardianName  ?? '',
    guardianPhone:  existing?.guardianPhone ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.name || !form.email) { Alert.alert('Required', 'Name and email are required.'); return; }
    setLoading(true);
    // TODO: supabase.from('students').upsert({ ...form, id: existing?.id })
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  const handleDelete = () => {
    Alert.alert('Remove student', `Remove ${existing?.name} from the system?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        // TODO: supabase.from('students').delete().eq('id', existing.id)
        navigation.goBack();
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>{isEdit ? 'Edit student' : 'Add student'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Full name"       value={form.name}          onChangeText={v => set('name', v)}          placeholder="Enter full name" />
        <Field label="Email address"   value={form.email}         onChangeText={v => set('email', v)}         placeholder="student@edu.in"  keyboardType="email-address" />
        <Field label="Phone number"    value={form.phone}         onChangeText={v => set('phone', v)}         placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Field label="Course" value={form.course} onChangeText={v => set('course', v)} placeholder="B.E. CSE" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Year" value={form.year} onChangeText={v => set('year', v)} placeholder="2nd year" />
          </View>
        </View>
        <Field label="Guardian name"  value={form.guardianName}  onChangeText={v => set('guardianName', v)}  placeholder="Parent / guardian name" />
        <Field label="Guardian phone" value={form.guardianPhone} onChangeText={v => set('guardianPhone', v)} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
        <PrimaryButton label={isEdit ? 'Save changes' : 'Add student'} onPress={handleSave} loading={loading} />
        {isEdit && (
          <TouchableOpacity style={[s.btnSec, { borderColor: C.danger, marginTop: 10 }]} onPress={handleDelete}>
            <Text style={{ color: C.danger, fontSize: 14 }}>Remove student</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. CSV Import ────────────────────────────────────────────
export function CSVImportScreen({ navigation }) {
  const [file, setFile]           = useState(null);
  const [progress, setProgress]   = useState(0);
  const [importing, setImporting] = useState(false);
  const [done, setDone]           = useState(false);

  const pickFile = async () => {
    // TODO: use expo-document-picker
    // const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
    // if (!result.canceled) { setFile(result.assets[0]); simulateValidation(); }
    setFile({ name: 'students_batch4.csv', rowCount: 38 });
    simulateValidation();
  };

  const simulateValidation = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 5;
      });
    }, 80);
  };

  const handleImport = () => {
    setImporting(true);
    // TODO: parse CSV rows and batch upsert to supabase students table
    setTimeout(() => { setImporting(false); setDone(true); }, 1200);
  };

  if (done) return (
    <SafeAreaView style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>✓</Text>
      <Text style={{ fontSize: 18, fontWeight: '500', color: C.text, marginBottom: 6 }}>Import complete</Text>
      <Text style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>{file?.rowCount} students added successfully</Text>
      <PrimaryButton label="Done" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Import via CSV</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity style={s.csvDropzone} onPress={pickFile} activeOpacity={0.7}>
          <View style={s.csvIcon}>
            <Text style={{ fontSize: 20 }}>📄</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 4 }}>
            {file ? file.name : 'Tap to choose CSV file'}
          </Text>
          <Text style={{ fontSize: 12, color: C.muted }}>{file ? `${file.rowCount} rows detected` : 'or drop your file here'}</Text>
        </TouchableOpacity>

        <Text style={[s.fieldLabel, { marginBottom: 6 }]}>Required columns</Text>
        <View style={s.infoBox}>
          <Text style={{ fontSize: 12, color: C.muted, lineHeight: 20 }}>
            name, email, phone, course, year,{'\n'}guardian_name, guardian_phone
          </Text>
        </View>

        {file && (
          <View style={[s.infoBox, { marginTop: 14 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{file.name}</Text>
              <Text style={{ fontSize: 12, color: C.muted }}>{file.rowCount} rows</Text>
            </View>
            <View style={{ height: 4, backgroundColor: C.border, borderRadius: 2, marginBottom: 4 }}>
              <View style={{ height: 4, backgroundColor: C.primary, borderRadius: 2, width: `${progress}%` }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 11, color: C.muted }}>{progress < 100 ? 'Validating…' : 'Ready to import'}</Text>
              <Text style={{ fontSize: 11, color: C.primary }}>{progress}%</Text>
            </View>
          </View>
        )}

        {file && progress === 100 && (
          <PrimaryButton
            label={`Import ${file.rowCount} students`}
            onPress={handleImport}
            loading={importing}
            disabled={importing}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Room Dashboard ────────────────────────────────────────
const ROOM_STATUS_COLOR = {
  full:        { bg: C.tealLight,    border: '#5DCAA5', bar: C.teal,  label: 'Full',        labelColor: '#085041' },
  partial:     { bg: C.primaryLight, border: '#AFA9EC', bar: C.primary, label: 'Partial',   labelColor: C.primaryDark },
  vacant:      { bg: C.bg,           border: C.border,  bar: C.border, label: 'Vacant',     labelColor: C.success },
  maintenance: { bg: C.amberLight,   border: '#EF9F27', bar: C.amber, label: 'Maintenance', labelColor: '#633806' },
};

export function RoomDashboardScreen({ navigation }) {
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const blocks = ['All', 'A Block', 'B Block', 'C Block'];
  const statuses = ['All', 'Vacant', 'Partial', 'Full', 'Maintenance'];

  const filtered = MOCK_ROOMS.filter(r => {
    const matchB = filterBlock === 'All' || r.block === filterBlock.replace(' Block', '');
    const matchS = filterStatus === 'All' || r.status === filterStatus.toLowerCase();
    return matchB && matchS;
  });

  const stats = {
    total:       MOCK_ROOMS.length,
    occupied:    MOCK_ROOMS.filter(r => r.status === 'full').length,
    available:   MOCK_ROOMS.filter(r => r.status === 'vacant' || r.status === 'partial').length,
    maintenance: MOCK_ROOMS.filter(r => r.status === 'maintenance').length,
  };

  const renderRoom = ({ item }) => {
    const theme = ROOM_STATUS_COLOR[item.status] || ROOM_STATUS_COLOR.vacant;
    const pct = item.capacity > 0 ? item.occupied / item.capacity : 0;
    return (
      <TouchableOpacity
        style={[s.roomCard, { backgroundColor: theme.bg, borderColor: theme.border }]}
        onPress={() => navigation.navigate('AllocateRoom', { room: item })}
        activeOpacity={0.75}
      >
        <Text style={s.roomNumber}>{item.number}</Text>
        <Text style={s.roomMeta}>{item.type} · Floor {item.floor}</Text>
        <View style={{ height: 3, backgroundColor: theme.border, borderRadius: 2, marginTop: 8, marginBottom: 3 }}>
          <View style={{ height: 3, backgroundColor: theme.bar, borderRadius: 2, width: `${pct * 100}%` }} />
        </View>
        <Text style={{ fontSize: 10, color: theme.labelColor }}>
          {item.status === 'maintenance' ? 'Maintenance' : `${item.occupied}/${item.capacity} occupied`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Rooms</Text>
        <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary }]}
          onPress={() => navigation.navigate('AddRoom')}>
          <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.statGrid, { paddingHorizontal: 16, marginBottom: 12 }]}>
        {[['Total', stats.total, C.text], ['Occupied', stats.occupied, C.success],
          ['Available', stats.available, C.primary], ['Maintenance', stats.maintenance, C.amber]].map(([lbl, val, color]) => (
          <View key={lbl} style={s.statCard}>
            <Text style={[s.statNum, { color }]}>{val}</Text>
            <Text style={s.statLbl}>{lbl}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 8, flexGrow: 0 }}>
        {blocks.map(b => (
          <TouchableOpacity key={b} style={[s.chip, filterBlock === b && s.chipActive]} onPress={() => setFilterBlock(b)}>
            <Text style={[s.chipText, filterBlock === b && s.chipTextActive]}>{b}</Text>
          </TouchableOpacity>
        ))}
        {statuses.map(st => (
          <TouchableOpacity key={st} style={[s.chip, filterStatus === st && s.chipActive]} onPress={() => setFilterStatus(st)}>
            <Text style={[s.chipText, filterStatus === st && s.chipTextActive]}>{st}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderRoom}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        columnWrapperStyle={{ marginBottom: 8 }}
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No rooms found</Text>}
      />
    </SafeAreaView>
  );
}

// ─── 5. Add Room ─────────────────────────────────────────────
export function AddRoomScreen({ navigation }) {
  const [form, setForm] = useState({ number: '', block: '', floor: '', type: 'Double', capacity: '2' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const types = ['Single', 'Double', 'Triple'];

  const handleSave = () => {
    if (!form.number || !form.block) { Alert.alert('Required', 'Room number and block are required.'); return; }
    // TODO: supabase.from('rooms').insert({ ...form, status: 'vacant' })
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Add room</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Room number" value={form.number} onChangeText={v => set('number', v)} placeholder="e.g. A-101" />
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Field label="Block" value={form.block} onChangeText={v => set('block', v)} placeholder="A / B / C" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Floor" value={form.floor} onChangeText={v => set('floor', v)} placeholder="1" keyboardType="number-pad" />
          </View>
        </View>
        <Text style={s.fieldLabel}>Room type</Text>
        <View style={{ flexDirection: 'row', marginRight: 8, marginBottom: 14 }}>
          {types.map(t => (
            <TouchableOpacity key={t}
              style={[s.chip, form.type === t && s.chipActive, { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 }]}
              onPress={() => set('type', t)}>
              <Text style={[s.chipText, form.type === t && s.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Field label="Capacity (beds)" value={form.capacity} onChangeText={v => set('capacity', v)} placeholder="2" keyboardType="number-pad" />
        <PrimaryButton label="Create room" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 6. Allocate / Swap Room ──────────────────────────────────
export function AllocateRoomScreen({ navigation, route }) {
  const room = route.params?.room ?? MOCK_ROOMS[1];
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate] = useState('01 Aug 2025');
  const [loading, setLoading] = useState(false);
  const unassigned = MOCK_STUDENTS.filter(s => !s.room);

  const handleAllocate = () => {
    if (!selectedStudent) { Alert.alert('Select a student', 'Please select a student to allocate.'); return; }
    setLoading(true);
    // TODO: supabase.from('room_allocations').insert({ student_id, room_id, start_date, status: 'active' })
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 900);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Allocate room</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.infoBox, { backgroundColor: C.primaryLight, borderColor: '#AFA9EC', marginBottom: 14 }]}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: C.primaryDark }}>Room {room.number}</Text>
          <Text style={{ fontSize: 12, color: C.primary, marginTop: 2 }}>{room.type} · {room.occupied}/{room.capacity} occupied · Floor {room.floor}</Text>
        </View>

        <Text style={s.sectionLabel}>Select unassigned student</Text>
        {unassigned.length === 0
          ? <Text style={{ color: C.muted, fontSize: 13 }}>All students are assigned to rooms.</Text>
          : unassigned.map(student => (
            <TouchableOpacity
              key={student.id}
              style={[s.studentRow, selectedStudent?.id === student.id && {
                backgroundColor: C.tealLight, borderRadius: 10,
              }]}
              onPress={() => setSelectedStudent(student)}
              activeOpacity={0.75}
            >
              <Avatar initials={student.initials} bg={student.avatarBg} color={student.avatarColor} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.studentName}>{student.name}</Text>
                <Text style={s.studentMeta}>{student.course} · {student.year} year</Text>
              </View>
              <View style={{
                width: 18, height: 18, borderRadius: 9,
                borderWidth: 1.5,
                borderColor: selectedStudent?.id === student.id ? C.teal : C.border,
                backgroundColor: selectedStudent?.id === student.id ? C.teal : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedStudent?.id === student.id && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
                )}
              </View>
            </TouchableOpacity>
          ))
        }

        <Text style={[s.sectionLabel, { marginTop: 16 }]}>Allocation start date</Text>
        <View style={[s.infoBox, { marginBottom: 14 }]}>
          <Text style={{ fontSize: 13, color: C.text }}>{startDate}</Text>
        </View>
        {/* TODO: Add DatePicker here using @react-native-community/datetimepicker */}

        <PrimaryButton
          label={selectedStudent ? `Allocate ${selectedStudent.name}` : 'Confirm allocation'}
          onPress={handleAllocate}
          loading={loading}
          disabled={!selectedStudent}
        />
        <SecondaryButton label="Swap room instead" onPress={() => Alert.alert('Swap', 'Swap flow coming in next iteration.')} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:  { fontSize: 18, fontWeight: '500', color: C.text },
  iconBtn:      { paddingHorizontal: 12, height: 32, borderRadius: 8, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  iconBtnText:  { fontSize: 12, color: C.muted },
  searchBar:    { flexDirection: 'row', alignItems: 'center', height: 38, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 10, marginBottom: 10 },
  chip:         { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg, marginRight: 6 },
  chipActive:   { backgroundColor: C.primaryLight, borderColor: C.primary },
  chipText:     { fontSize: 12, color: C.muted },
  chipTextActive: { color: C.primaryDark, fontWeight: '500' },
  studentRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  studentName:  { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  studentMeta:  { fontSize: 12, color: C.muted },
  fieldLabel:   { fontSize: 12, color: C.muted, marginBottom: 5 },
  input:        { height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, fontSize: 14, color: C.text, marginBottom: 14 },
  btnP:         { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:     { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnSec:       { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecText:   { fontSize: 13, color: C.muted },
  csvDropzone:  { borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 14 },
  csvIcon:      { width: 44, height: 44, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  infoBox:      { borderWidth: 0.5, borderColor: C.border, borderRadius: 10, padding: 12 },
  sectionLabel: { fontSize: 12, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  statGrid:     { flexDirection: 'row', marginRight: 8 },
  statCard:     { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10, marginRight: 8 },
  statNum:      { fontSize: 18, fontWeight: '500', color: C.text },
  statLbl:      { fontSize: 10, color: C.muted, marginTop: 2 },
  roomCard:     { flex: 1, borderRadius: 10, borderWidth: 0.5, padding: 10, marginRight: 4 },
  roomNumber:   { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 2 },
  roomMeta:     { fontSize: 11, color: C.muted },
});