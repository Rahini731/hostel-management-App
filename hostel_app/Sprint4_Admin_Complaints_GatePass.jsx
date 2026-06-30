// ============================================================
//  SPRINT 4 — Admin Complaints & Gate Pass
//  Screens: ComplaintListScreen, ComplaintDetailScreen,
//           AssignComplaintScreen, GatePassListScreen,
//           ReviewGatePassScreen
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, ScrollView, ActivityIndicator, Alert,
} from 'react-native';

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
};

const MOCK_COMPLAINTS = [
  { id: '1', studentId: '1', studentName: 'Ravi Kumar', initials: 'RK', room: 'A-102', category: 'Maintenance', subject: 'Water leakage in bathroom', description: 'Tap is leaking continuously since yesterday morning. Water is dripping into the bucket below.', status: 'open', priority: 'high', photo: null, createdAt: '02 Sep', assignedTo: null, expectedCompletion: null, avatarBg: '#EEEDFE', avatarColor: '#3C3489' },
  { id: '2', studentId: '2', studentName: 'Priya Selvan', initials: 'PS', room: 'B-104', category: 'Electrical', subject: 'Fan not working', description: 'Ceiling fan making noise and oscillation speed is very slow.', status: 'inprogress', priority: 'medium', photo: null, createdAt: '01 Sep', assignedTo: { name: 'Satish Rao', role: 'Electrician', initials: 'SR' }, expectedCompletion: '04 Sep', avatarBg: '#E1F5EE', avatarColor: '#085041' },
  { id: '3', studentId: '4', studentName: 'Divya Varma', initials: 'DV', room: 'A-301', category: 'Maintenance', subject: 'Door lock issues', description: 'Door lock is stuck and difficult to open. Key gets stuck inside.', status: 'pending', priority: 'high', photo: null, createdAt: '31 Aug', assignedTo: null, expectedCompletion: null, avatarBg: '#FAECE7', avatarColor: '#712B13' },
  { id: '4', studentId: '2', studentName: 'Arjun Mehta', initials: 'AM', room: 'B-205', category: 'WiFi', subject: 'WiFi connectivity problems', description: 'Internet speed is very slow in the room. Can barely open websites.', status: 'resolved', priority: 'medium', photo: null, createdAt: '28 Aug', assignedTo: { name: 'Tech Support', role: 'IT', initials: 'TS' }, expectedCompletion: '28 Aug', avatarBg: '#FAEEDA', avatarColor: '#633806' },
];

const STAFF = [
  { id: '1', name: 'Mr. Venkat',   initials: 'MV', role: 'Plumber',      avatarBg: '#EEEDFE', avatarColor: '#3C3489' },
  { id: '2', name: 'Satish Rao',   initials: 'SR', role: 'Electrician',  avatarBg: '#E1F5EE', avatarColor: '#085041' },
  { id: '3', name: 'Tech Support', initials: 'TS', role: 'IT',           avatarBg: '#FAEIDA', avatarColor: '#633806' },
  { id: '4', name: 'Cleaning Team',initials: 'CT', role: 'Housekeeping', avatarBg: '#FAECE7', avatarColor: '#712B13' },
];

const MOCK_GATE_PASSES = [
  { id: '1', studentId: '1', studentName: 'Ravi Kumar', room: 'A-102', fromDate: '20 Sep', toDate: '22 Sep', reason: 'Family event', status: 'pending', destination: 'Home', createdAt: '18 Sep' },
  { id: '2', studentId: '2', studentName: 'Priya Selvan', room: 'B-104', fromDate: '18 Sep', toDate: '20 Sep', reason: 'Medical', status: 'approved', destination: 'Hospital', createdAt: '16 Sep' },
  { id: '3', studentId: '3', studentName: 'Arjun Mehta', room: 'A-301', fromDate: '25 Aug', toDate: '28 Aug', reason: 'Birthday', status: 'latereturn', destination: 'Bangalore', createdAt: '22 Aug' },
  { id: '4', studentId: '4', studentName: 'Divya Varma', room: 'A-401', fromDate: '10 Sep', toDate: '12 Sep', reason: 'Home visit', status: 'completed', destination: 'Hometown', createdAt: '08 Sep' },
];

const STATUS_COLORS = {
  open:         { bg: '#FAECE7', color: '#712B13', label: 'Open' },
  pending:      { bg: '#FAEEDA', color: '#633806', label: 'Pending assign' },
  inprogress:   { bg: '#EEEDFE', color: '#3C3489', label: 'In progress' },
  resolved:     { bg: '#E1F5EE', color: '#085041', label: 'Resolved' },
};

const PASS_STATUS_COLORS = {
  pending:     { bg: '#FAEEDA', color: '#633806', label: 'Pending' },
  approved:    { bg: '#E1F5EE', color: '#085041', label: 'Approved' },
  rejected:    { bg: '#FAECE7', color: '#712B13', label: 'Rejected' },
  completed:   { bg: '#E1F5EE', color: '#085041', label: 'Completed' },
  latereturn:  { bg: '#FAECE7', color: '#712B13', label: 'Late return !' },
};

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

const Avatar = ({ initials, bg, color, size = 38 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size * 0.3, fontWeight: '500', color }}>{initials}</Text>
  </View>
);

// ─── 1. Complaints List (Admin) ───────────────────────────
export function ComplaintListScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Open', 'In progress', 'Resolved', 'Pending'];

  const stats = useMemo(() => ({
    open:     MOCK_COMPLAINTS.filter(c => c.status === 'open').length,
    resolved: MOCK_COMPLAINTS.filter(c => c.status === 'resolved').length,
  }), []);

  const filtered = useMemo(() => {
    if (filter === 'All') return MOCK_COMPLAINTS;
    const statusMap = { 'Open': 'open', 'In progress': 'inprogress', 'Resolved': 'resolved', 'Pending': 'pending' };
    return MOCK_COMPLAINTS.filter(c => c.status === statusMap[filter]);
  }, [filter]);

  const renderItem = ({ item }) => {
    const cfg = STATUS_COLORS[item.status] || STATUS_COLORS.open;
    return (
      <TouchableOpacity
        style={s.compRow}
        onPress={() => navigation.navigate('ComplaintDetail', { complaint: item })}
        activeOpacity={0.75}
      >
        <Avatar initials={item.initials} bg={item.avatarBg} color={item.avatarColor} size={36} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.compName}>{item.subject}</Text>
          <Text style={s.compMeta}>Room {item.room} · {item.studentName}</Text>
        </View>
        <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
          <Text style={{ fontSize: 11, color: cfg.color, fontWeight: '500' }}>{cfg.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Complaints</Text>
        <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary }]}>
          <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.statGrid, { paddingHorizontal: 16, marginBottom: 14 }]}>
        {[['Open', stats.open, C.coral], ['Resolved', stats.resolved, C.teal]].map(([lbl, val, color]) => (
          <View key={lbl} style={s.statCard}>
            <Text style={[s.statNum, { color }]}>{val}</Text>
            <Text style={s.statLbl}>{lbl}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 10, flexGrow: 0 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: C.border }} />}
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No complaints found</Text>}
      />
    </SafeAreaView>
  );
}

// ─── 2. Complaint Detail (Admin) ──────────────────────────
export function ComplaintDetailScreen({ navigation, route }) {
  const complaint = route.params?.complaint ?? MOCK_COMPLAINTS[0];
  const cfg = STATUS_COLORS[complaint.status] || STATUS_COLORS.open;

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Complaint details</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { backgroundColor: cfg.bg, borderColor: 'transparent', marginBottom: 14 }]}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: cfg.color, marginBottom: 2 }}>{complaint.subject}</Text>
          <Text style={{ fontSize: 12, color: cfg.color }}>
            Room {complaint.room} · {complaint.studentName} · {cfg.label}
          </Text>
        </View>

        <Text style={s.sectionLabel}>Status</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {['Open', 'In progress', 'Resolved'].map(st => (
            <TouchableOpacity key={st} style={[s.chip, st.toLowerCase() === complaint.status && s.chipActive]}>
              <Text style={[s.chipText, st.toLowerCase() === complaint.status && s.chipTextActive]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sectionLabel}>Assigned to</Text>
        {complaint.assignedTo ? (
          <View style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }]}>
            <Avatar initials={complaint.assignedTo.initials} bg='#EEEDFE' color='#3C3489' size={40} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{complaint.assignedTo.name}</Text>
              <Text style={{ fontSize: 12, color: C.muted }}>{complaint.assignedTo.role}</Text>
            </View>
            <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
              <Text style={{ fontSize: 11, color: C.primaryDark, fontWeight: '500' }}>Assigned</Text>
            </View>
          </View>
        ) : (
          <PrimaryButton
            label="Assign to staff"
            onPress={() => navigation.navigate('AssignComplaint', { complaint })}
          />
        )}

        <Text style={s.sectionLabel}>Description</Text>
        <View style={[s.card, { marginBottom: 14 }]}>
          <Text style={{ fontSize: 13, color: C.muted, lineHeight: 20 }}>{complaint.description}</Text>
        </View>

        {complaint.expectedCompletion && (
          <>
            <Text style={s.sectionLabel}>Expected completion</Text>
            <View style={[s.card, { marginBottom: 14 }]}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{complaint.expectedCompletion}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Assign Complaint ─────────────────────────────────
export function AssignComplaintScreen({ navigation, route }) {
  const complaint = route.params?.complaint ?? MOCK_COMPLAINTS[0];
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('05 Sep 2025');
  const [loading, setLoading] = useState(false);

  const handleAssign = () => {
    if (!selectedStaff) { Alert.alert('Select staff', 'Please select a staff member.'); return; }
    setLoading(true);
    // TODO: supabase.from('complaints').update({ assigned_to: selectedStaff.id, priority, expected_completion: dueDate }).eq('id', complaint.id)
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Assign complaint</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { backgroundColor: C.coralLight, borderColor: '#F0997B', marginBottom: 14 }]}>
          <Text style={{ fontSize: 12, color: '#712B13', marginBottom: 2 }}>{complaint.subject}</Text>
          <Text style={{ fontSize: 11, color: '#993C1D' }}>Room {complaint.room} · {complaint.studentName}</Text>
        </View>

        <Text style={s.sectionLabel}>Assign to staff</Text>
        {STAFF.map(staff => (
          <TouchableOpacity
            key={staff.id}
            style={[s.card, selectedStaff?.id === staff.id && { borderColor: C.primary, borderWidth: 1.5, backgroundColor: C.primaryLight }]}
            onPress={() => setSelectedStaff(staff)}
            activeOpacity={0.75}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar initials={staff.initials} bg={staff.avatarBg} color={staff.avatarColor} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{staff.name}</Text>
                <Text style={{ fontSize: 11, color: C.muted }}>{staff.role}</Text>
              </View>
              <View style={{
                width: 18, height: 18, borderRadius: 9, borderWidth: 1.5,
                borderColor: selectedStaff?.id === staff.id ? C.primary : C.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedStaff?.id === staff.id && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary }} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[s.sectionLabel, { marginTop: 16 }]}>Priority</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {['Low', 'Medium', 'High'].map(p => (
            <TouchableOpacity key={p}
              style={[s.chip, priority === p.toLowerCase() && s.chipActive]}
              onPress={() => setPriority(p.toLowerCase())}>
              <Text style={[s.chipText, priority === p.toLowerCase() && s.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sectionLabel}>Expected completion date</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={C.hint}
          />
        </View>

        <PrimaryButton label="Assign" onPress={handleAssign} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Gate Pass List (Admin) ────────────────────────────
export function GatePassListScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Late return'];

  const filtered = useMemo(() => {
    if (filter === 'All') return MOCK_GATE_PASSES;
    const statusMap = { 'Pending': 'pending', 'Approved': 'approved', 'Rejected': 'rejected', 'Late return': 'latereturn' };
    return MOCK_GATE_PASSES.filter(p => p.status === statusMap[filter]);
  }, [filter]);

  const renderItem = ({ item }) => {
    const cfg = PASS_STATUS_COLORS[item.status] || PASS_STATUS_COLORS.pending;
    return (
      <TouchableOpacity
        style={s.compRow}
        onPress={() => navigation.navigate('ReviewGatePass', { pass: item })}
        activeOpacity={0.75}
      >
        <View style={{ flex: 1 }}>
          <Text style={s.compName}>{item.studentName}</Text>
          <Text style={s.compMeta}>{item.fromDate} – {item.toDate} · {item.reason}</Text>
        </View>
        <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
          <Text style={{ fontSize: 11, color: cfg.color, fontWeight: '500' }}>{cfg.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Gate pass requests</Text>
      </View>

      <View style={[s.statGrid, { paddingHorizontal: 16, marginBottom: 14 }]}>
        {[
          ['Pending', MOCK_GATE_PASSES.filter(p => p.status === 'pending').length, C.amber],
          ['Approved', MOCK_GATE_PASSES.filter(p => p.status === 'approved').length, C.teal],
        ].map(([lbl, val, color]) => (
          <View key={lbl} style={s.statCard}>
            <Text style={[s.statNum, { color }]}>{val}</Text>
            <Text style={s.statLbl}>{lbl}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 10, flexGrow: 0 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: C.border }} />}
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No requests found</Text>}
      />
    </SafeAreaView>
  );
}

// ─── 5. Review / Approve Gate Pass ────────────────────────
export function ReviewGatePassScreen({ navigation, route }) {
  const pass = route.params?.pass ?? MOCK_GATE_PASSES[0];
  const [decision, setDecision] = useState('approve');
  const [remarks, setRemarks] = useState('');
  const [expectedReturn, setExpectedReturn] = useState(pass.toDate);
  const [loading, setLoading] = useState(false);

  const handleDecide = () => {
    setLoading(true);
    // TODO: supabase.from('gate_passes').update({ status: decision, remarks, expected_return: expectedReturn })
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Review request</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { backgroundColor: C.amberLight, borderColor: '#FAC775', marginBottom: 14 }]}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#633806', marginBottom: 2 }}>{pass.studentName}</Text>
          <Text style={{ fontSize: 11, color: '#633806' }}>{pass.fromDate} – {pass.toDate} · {pass.reason}</Text>
        </View>

        <Text style={s.sectionLabel}>Decision</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {['approve', 'reject'].map(d => (
            <TouchableOpacity key={d}
              style={[s.chip, decision === d && s.chipActive]}
              onPress={() => setDecision(d)}>
              <Text style={[s.chipText, decision === d && s.chipTextActive]}>
                {d === 'approve' ? 'Approve' : 'Reject'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.fieldLabel}>Remarks (optional)</Text>
        <View style={[s.input, { height: 50 }]}>
          <TextInput
            style={s.inputText}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Add a note..."
            placeholderTextColor={C.hint}
            multiline
          />
        </View>

        <Text style={s.fieldLabel}>Expected return date</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={expectedReturn}
            onChangeText={setExpectedReturn}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={C.hint}
          />
        </View>

        <PrimaryButton label={decision === 'approve' ? 'Approve' : 'Reject'} onPress={handleDecide} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:  { fontSize: 18, fontWeight: '500', color: C.text },
  iconBtn:      { paddingHorizontal: 12, height: 32, borderRadius: 8, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  statGrid:     { flexDirection: 'row', gap: 8 },
  statCard:     { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10 },
  statNum:      { fontSize: 14, fontWeight: '500', color: C.text },
  statLbl:      { fontSize: 10, color: C.muted, marginTop: 2 },
  chip:         { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg, marginRight: 6 },
  chipActive:   { backgroundColor: C.primaryLight, borderColor: C.primary },
  chipText:     { fontSize: 12, color: C.muted },
  chipTextActive: { color: C.primaryDark, fontWeight: '500' },
  compRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  compName:     { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  compMeta:     { fontSize: 12, color: C.muted },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 6 },
  fieldLabel:   { fontSize: 12, color: C.muted, marginBottom: 5 },
  input:        { height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, marginBottom: 14 },
  inputText:    { flex: 1, fontSize: 14, color: C.text },
  btnP:         { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:     { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnSec:       { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecText:   { fontSize: 13, color: C.muted },
  card:         { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 12 },
});
