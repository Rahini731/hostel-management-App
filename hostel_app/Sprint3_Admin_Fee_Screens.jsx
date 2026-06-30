// ============================================================
//  SPRINT 3 — Admin Fee Management Screens
//  Screens: FeeDashboardScreen, FeeStructureScreen,
//           GenerateInvoicesScreen, MarkPaymentScreen,
//           PaymentHistoryScreen
//  Dependencies: same as Sprint 1 + expo-print expo-sharing
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, ScrollView, ActivityIndicator, Alert,
} from 'react-native';

// ─── Design Tokens ───────────────────────────────────────────
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

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_FEE_RECORDS = [
  { id: '1', studentId: '1', name: 'Ravi Kumar',   initials: 'RK', room: 'A-201', month: 'Aug 2025', amount: 6500, status: 'paid',    paidDate: '01 Aug', mode: 'UPI',  txn: 'TXN8821', avatarBg: '#EEEDFE', avatarColor: '#3C3489' },
  { id: '2', studentId: '2', name: 'Priya Selvan', initials: 'PS', room: 'B-104', month: 'Aug 2025', amount: 6500, status: 'pending', dueDate: '5 Aug',   mode: null,   txn: null,      avatarBg: '#E1F5EE', avatarColor: '#085041' },
  { id: '3', studentId: '3', name: 'Arjun Mehta',  initials: 'AM', room: 'A-102', month: 'Aug 2025', amount: 6500, status: 'overdue', dueDate: '5 Aug',   mode: null,   txn: null,      avatarBg: '#FAEEDA', avatarColor: '#633806' },
  { id: '4', studentId: '4', name: 'Divya Varma',  initials: 'DV', room: 'A-301', month: 'Aug 2025', amount: 6500, status: 'paid',    paidDate: '02 Aug', mode: 'Card', txn: 'TXN9034', avatarBg: '#FAECE7', avatarColor: '#712B13' },
  { id: '5', studentId: '5', name: 'Karthik Rajan',initials: 'KR', room: 'C-101', month: 'Aug 2025', amount: 6500, status: 'paid',    paidDate: '03 Aug', mode: 'UPI',  txn: 'TXN9102', avatarBg: '#EEEDFE', avatarColor: '#3C3489' },
];

const FEE_STRUCTURES = [
  { id: '1', name: 'Standard Monthly 2025–26', type: 'Monthly', amount: 6500, dueDay: 5, lateFee: 50, year: '2025–2026' },
  { id: '2', name: 'Semester Fee 2025–26',     type: 'Semester', amount: 35000, dueDay: 1, lateFee: 200, year: '2025–2026' },
];

const STATUS_CONFIG = {
  paid:    { label: 'Paid',    bg: '#E1F5EE', color: '#085041' },
  pending: { label: 'Due',     bg: '#FAEEDA', color: '#633806' },
  overdue: { label: 'Overdue', bg: '#FAECE7', color: '#712B13' },
};

// ─── Shared UI ────────────────────────────────────────────────
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

const Field = ({ label, value, onChangeText, placeholder, keyboardType }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={s.fieldLabel}>{label}</Text>
    <TextInput
      style={s.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.hint}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

const Avatar = ({ initials, bg, color, size = 38 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size * 0.3, fontWeight: '500', color }}>{initials}</Text>
  </View>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
      <Text style={{ fontSize: 11, color: cfg.color, fontWeight: '500' }}>{cfg.label}</Text>
    </View>
  );
};

// ─── 1. Fee Dashboard (Admin) ─────────────────────────────────
export function FeeDashboardScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Paid', 'Pending', 'Overdue'];

  const stats = useMemo(() => ({
    collected: MOCK_FEE_RECORDS.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0),
    pending:   MOCK_FEE_RECORDS.filter(r => r.status !== 'paid').reduce((s, r) => s + r.amount, 0),
    paid:      MOCK_FEE_RECORDS.filter(r => r.status === 'paid').length,
    overdue:   MOCK_FEE_RECORDS.filter(r => r.status === 'overdue').length,
  }), []);

  const filtered = useMemo(() => {
    if (filter === 'All') return MOCK_FEE_RECORDS;
    return MOCK_FEE_RECORDS.filter(r => r.status === filter.toLowerCase());
  }, [filter]);

  const formatAmount = (amt) => `₹${(amt / 1000).toFixed(1)}K`;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.feeRow}
      onPress={() => navigation.navigate('MarkPayment', { record: item })}
      activeOpacity={0.75}
    >
      <Avatar initials={item.initials} bg={item.avatarBg} color={item.avatarColor} size={36} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={s.feeName}>{item.name}</Text>
        <Text style={s.feeMeta}>{item.month} · ₹{item.amount.toLocaleString('en-IN')}</Text>
      </View>
      <StatusBadge status={item.status} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Fee management</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('FeeStructure')}>
            <Text style={s.iconBtnText}>Setup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary }]}
            onPress={() => navigation.navigate('GenerateInvoices')}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>Generate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={[s.statGrid, { paddingHorizontal: 16, marginBottom: 14 }]}>
        {[
          ['Collected',   formatAmount(stats.collected), C.teal],
          ['Pending',     formatAmount(stats.pending),   C.coral],
          ['Paid',        `${stats.paid} students`,      C.text],
          ['Overdue',     `${stats.overdue} students`,   C.amber],
        ].map(([lbl, val, color]) => (
          <View key={lbl} style={s.statCard}>
            <Text style={[s.statNum, { color }]}>{val}</Text>
            <Text style={s.statLbl}>{lbl}</Text>
          </View>
        ))}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 16, marginBottom: 10, flexGrow: 0 }}>
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
        ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>No records found</Text>}
      />
    </SafeAreaView>
  );
}

// ─── 2. Fee Structure Setup ───────────────────────────────────
export function FeeStructureScreen({ navigation }) {
  const [structures] = useState(FEE_STRUCTURES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Monthly', amount: '', dueDay: '5', lateFee: '50', year: '2025–2026' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const types = ['Monthly', 'Semester', 'Annual'];

  const handleSave = () => {
    if (!form.name || !form.amount) { Alert.alert('Required', 'Name and amount are required.'); return; }
    setLoading(true);
    // TODO: supabase.from('fee_structures').insert({ ...form })
    setTimeout(() => { setLoading(false); setShowForm(false); }, 800);
  };

  if (showForm) return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>New fee structure</Text>
        <TouchableOpacity onPress={() => setShowForm(false)}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Structure name" value={form.name} onChangeText={v => set('name', v)} placeholder="e.g. Standard Monthly 2025–26" />

        <Text style={s.fieldLabel}>Fee type</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {types.map(t => (
            <TouchableOpacity key={t}
              style={[s.chip, form.type === t && s.chipActive, { paddingVertical: 8, paddingHorizontal: 14 }]}
              onPress={() => set('type', t)}>
              <Text style={[s.chipText, form.type === t && s.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Amount (₹)" value={form.amount} onChangeText={v => set('amount', v)} placeholder="6500" keyboardType="number-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Due day" value={form.dueDay} onChangeText={v => set('dueDay', v)} placeholder="5" keyboardType="number-pad" />
          </View>
        </View>

        <Field label="Late fee per day (₹)" value={form.lateFee} onChangeText={v => set('lateFee', v)} placeholder="50" keyboardType="number-pad" />
        <Field label="Academic year" value={form.year} onChangeText={v => set('year', v)} placeholder="2025–2026" />

        <PrimaryButton label="Save structure" onPress={handleSave} loading={loading} />
        <SecondaryButton label="Cancel" onPress={() => setShowForm(false)} />
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Fee structures</Text>
        <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary }]} onPress={() => setShowForm(true)}>
          <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {structures.map(st => (
          <TouchableOpacity key={st.id} style={[s.card, { marginBottom: 10 }]} activeOpacity={0.75}
            onPress={() => navigation.navigate('GenerateInvoices', { structure: st })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{st.name}</Text>
              <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                <Text style={{ fontSize: 11, color: C.primaryDark }}>{st.type}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[
                ['Amount',   `₹${st.amount.toLocaleString('en-IN')}`],
                ['Due day',  `${st.dueDay}th`],
                ['Late fee', `₹${st.lateFee}/day`],
              ].map(([lbl, val]) => (
                <View key={lbl}>
                  <Text style={{ fontSize: 11, color: C.muted }}>{lbl}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: C.text }}>{val}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Generate Invoices ─────────────────────────────────────
export function GenerateInvoicesScreen({ navigation, route }) {
  const structure = route.params?.structure ?? FEE_STRUCTURES[0];
  const [month, setMonth] = useState('September 2025');
  const [target, setTarget] = useState('All students');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const studentCount = 42;
  const total = studentCount * structure.amount;

  const handleGenerate = () => {
    setLoading(true);
    // TODO: Loop through students and insert fee_records in Supabase
    setTimeout(() => { setLoading(false); setDone(true); }, 1000);
  };

  if (done) return (
    <SafeAreaView style={[s.screen, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>✓</Text>
      <Text style={{ fontSize: 18, fontWeight: '500', color: C.text, marginBottom: 6 }}>Invoices generated</Text>
      <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 32 }}>
        {studentCount} invoices for {month} sent to all students
      </Text>
      <PrimaryButton label="Done" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Generate invoices</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { backgroundColor: C.primaryLight, borderColor: '#AFA9EC', marginBottom: 16 }]}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.primaryDark, marginBottom: 2 }}>{structure.name}</Text>
          <Text style={{ fontSize: 12, color: C.primary }}>₹{structure.amount.toLocaleString('en-IN')} / {structure.type} · Due {structure.dueDay}th</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Month" value={month} onChangeText={setMonth} placeholder="September 2025" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Generate for" value={target} onChangeText={setTarget} placeholder="All students" />
          </View>
        </View>

        <View style={s.card}>
          {[
            ['Students selected', studentCount],
            ['Total invoices',    studentCount],
          ].map(([lbl, val]) => (
            <View key={lbl} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: C.muted }}>{lbl}</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{val}</Text>
            </View>
          ))}
          <View style={{ height: 0.5, backgroundColor: C.border, marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted }}>Total amount</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: C.primary }}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <PrimaryButton label={`Generate ${studentCount} invoices`} onPress={handleGenerate} loading={loading} />
        <SecondaryButton label="Preview before generating" onPress={() => Alert.alert('Preview', 'Preview feature coming soon.')} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Mark Payment Received ─────────────────────────────────
export function MarkPaymentScreen({ navigation, route }) {
  const record = route.params?.record ?? MOCK_FEE_RECORDS[1];
  const [form, setForm] = useState({ mode: 'UPI', txnId: '', date: new Date().toLocaleDateString('en-IN'), remarks: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const modes = ['UPI', 'Card', 'Net banking', 'Cash'];

  const handleMark = () => {
    setLoading(true);
    // TODO: supabase.from('fee_records').update({ status: 'paid', ... }).eq('id', record.id)
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Mark payment</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }]}>
          <Avatar initials={record.initials} bg={record.avatarBg} color={record.avatarColor} size={40} />
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{record.name}</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>Room {record.room} · {record.month}</Text>
          </View>
        </View>

        <View style={[s.card, { backgroundColor: C.amberLight, borderColor: '#EF9F27', marginBottom: 14 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: '#633806' }}>Amount due</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#412402' }}>₹{record.amount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#633806' }}>Due date</Text>
            <Text style={{ fontSize: 12, color: '#633806' }}>{record.dueDate ?? 'Overdue'}</Text>
          </View>
        </View>

        <Text style={s.fieldLabel}>Payment mode</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {modes.map(m => (
            <TouchableOpacity key={m}
              style={[s.chip, form.mode === m && s.chipActive, { paddingVertical: 8 }]}
              onPress={() => set('mode', m)}>
              <Text style={[s.chipText, form.mode === m && s.chipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field label="Transaction ID" value={form.txnId} onChangeText={v => set('txnId', v)} placeholder="Enter transaction ID" />
        <Field label="Payment date"   value={form.date}  onChangeText={v => set('date', v)}  placeholder="DD/MM/YYYY" />
        <Field label="Remarks (optional)" value={form.remarks} onChangeText={v => set('remarks', v)} placeholder="Add a note…" />

        <PrimaryButton label="Mark as paid" onPress={handleMark} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 5. Payment History (Admin) ───────────────────────────────
export function PaymentHistoryScreen({ navigation }) {
  const paid = MOCK_FEE_RECORDS.filter(r => r.status === 'paid');

  const grouped = paid.reduce((acc, r) => {
    const key = r.month;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const handleExport = () => {
    // TODO: use expo-print + expo-sharing to export PDF/CSV report
    Alert.alert('Export', 'Payment report exported to downloads.');
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Payment history</Text>
        <TouchableOpacity style={s.iconBtn} onPress={handleExport}>
          <Text style={s.iconBtnText}>Export</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {Object.entries(grouped).map(([month, records]) => (
          <View key={month}>
            <Text style={s.sectionLabel}>{month}</Text>
            {records.map(r => (
              <View key={r.id} style={s.feeRow}>
                <Avatar initials={r.initials} bg={r.avatarBg} color={r.avatarColor} size={34} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.feeName}>{r.name}</Text>
                  <Text style={s.feeMeta}>{r.mode} · {r.paidDate} · {r.txn}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '500', color: C.teal }}>
                  ₹{r.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
            <View style={{ height: 0.5, backgroundColor: C.border, marginVertical: 8 }} />
          </View>
        ))}
        <View style={[s.card, { backgroundColor: C.surface }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: C.muted }}>Total collected</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: C.teal }}>
              ₹{paid.reduce((s, r) => s + r.amount, 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
        <PrimaryButton label="Export full report" onPress={handleExport} />
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
  statGrid:     { flexDirection: 'row', gap: 8 },
  statCard:     { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10 },
  statNum:      { fontSize: 14, fontWeight: '500', color: C.text },
  statLbl:      { fontSize: 10, color: C.muted, marginTop: 2 },
  chip:         { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg, marginRight: 6 },
  chipActive:   { backgroundColor: C.primaryLight, borderColor: C.primary },
  chipText:     { fontSize: 12, color: C.muted },
  chipTextActive: { color: C.primaryDark, fontWeight: '500' },
  feeRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  feeName:      { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  feeMeta:      { fontSize: 12, color: C.muted },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 6 },
  fieldLabel:   { fontSize: 12, color: C.muted, marginBottom: 5 },
  input:        { height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, fontSize: 14, color: C.text, marginBottom: 14 },
  btnP:         { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:     { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnSec:       { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecText:   { fontSize: 13, color: C.muted },
  card:         { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 12 },
});
