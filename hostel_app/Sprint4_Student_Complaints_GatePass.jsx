// ============================================================
//  SPRINT 4 — Student Complaints & Gate Pass
//  Screens: RaiseComplaintScreen, MyComplaintsScreen,
//           ApplyGatePassScreen, MyGatePassesScreen,
//           LateReturnAlertScreen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Alert,
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

const CATEGORIES = ['Maintenance', 'Cleanliness', 'Conduct', 'Facility', 'Other'];

const MOCK_STUDENT_COMPLAINTS = [
  { id: '1', subject: 'Water leakage in bathroom', category: 'Maintenance', description: 'Tap is leaking continuously since yesterday morning.', status: 'inprogress', assignedTo: 'Mr. Venkat (Plumber)', raisedDate: '02 Sep' },
  { id: '2', subject: 'WiFi connectivity problems', category: 'Facility', description: 'Internet speed is very slow in the room.', status: 'resolved', resolvedDate: '28 Aug', resolutionTime: '2 days' },
  { id: '3', subject: 'Noisy neighbours disturbing sleep', category: 'Conduct', description: 'Neighbours making loud noise at night.', status: 'resolved', resolvedDate: '20 Aug', resolutionTime: '3 days' },
];

const MOCK_GATE_PASSES = [
  { id: '1', fromDate: '20 Sep', toDate: '22 Sep', reason: 'Family event', status: 'approved', destination: 'Home' },
  { id: '2', fromDate: '10 Sep', toDate: '12 Sep', reason: 'Home visit', status: 'completed', destination: 'Hometown', returnedDate: '12 Sep' },
  { id: '3', fromDate: '5 Sep', toDate: '7 Sep', reason: 'Weekend trip', status: 'rejected', destination: 'Bangalore', rejectionReason: 'Exam week' },
];

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

// ─── 1. Raise Complaint (Student) ─────────────────────────
export function RaiseComplaintScreen({ navigation }) {
  const [category, setCategory] = useState('Maintenance');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!subject || !description) { Alert.alert('Required', 'Subject and description are required.'); return; }
    setLoading(true);
    // TODO: supabase.from('complaints').insert({ student_id, category, subject, description, photo_url: photo, status: 'open', created_at: now })
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  const handleAddPhoto = () => {
    // TODO: Use expo-image-picker to select a photo
    setPhoto('photo.jpg');
    Alert.alert('Photo added', 'You can now submit your complaint with the photo attached.');
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Raise complaint</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.fieldLabel}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[s.chip, category === cat && s.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[s.chipText, category === cat && s.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.fieldLabel}>Subject</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Water leakage in bathroom"
            placeholderTextColor={C.hint}
          />
        </View>

        <Text style={s.fieldLabel}>Description</Text>
        <View style={[s.input, { height: 70 }]}>
          <TextInput
            style={s.inputText}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={C.hint}
            multiline
          />
        </View>

        <Text style={s.fieldLabel}>Attach photo (optional)</Text>
        <TouchableOpacity
          style={s.photoBox}
          onPress={handleAddPhoto}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 32, marginBottom: 6 }}>📷</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.text }}>
            {photo ? 'Photo attached' : 'Add photo'}
          </Text>
        </TouchableOpacity>

        <PrimaryButton label="Submit complaint" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. My Complaints (Student) ───────────────────────────
export function MyComplaintsScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My complaints</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {MOCK_STUDENT_COMPLAINTS.map((complaint, i) => {
          const statusColor = {
            'inprogress': { bg: '#EEEDFE', color: '#3C3489', label: 'In progress' },
            'resolved':   { bg: '#E1F5EE', color: '#085041', label: 'Resolved' },
          }[complaint.status];
          
          return (
            <TouchableOpacity
              key={complaint.id}
              style={[s.card, { marginBottom: 10 }]}
              onPress={() => Alert.alert(complaint.subject, complaint.description)}
              activeOpacity={0.75}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{complaint.subject}</Text>
                  <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {complaint.status === 'inprogress' ? `Raised ${complaint.raisedDate} · ${complaint.assignedTo}` 
                      : `Resolved ${complaint.resolvedDate} · ${complaint.resolutionTime} to fix`}
                  </Text>
                </View>
                <View style={{ backgroundColor: statusColor.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                  <Text style={{ fontSize: 10, color: statusColor.color, fontWeight: '500' }}>{statusColor.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ fontSize: 11, color: C.hint, textAlign: 'center', marginTop: 12 }}>
          <Text style={{ fontSize: 11, color: C.hint }}>
            {MOCK_STUDENT_COMPLAINTS.length} complaints total
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Apply for Gate Pass (Student) ──────────────────────
export function ApplyGatePassScreen({ navigation }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDuration = () => {
    if (!fromDate || !toDate) return 0;
    // Simplified calculation
    return 1;
  };

  const handleApply = () => {
    if (!fromDate || !toDate || !reason) { Alert.alert('Required', 'Please fill in all fields.'); return; }
    setLoading(true);
    // TODO: supabase.from('gate_passes').insert({ student_id, from_date: fromDate, to_date: toDate, reason, destination, status: 'pending' })
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Apply for leave</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.fieldLabel}>From date</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={fromDate}
            onChangeText={setFromDate}
            placeholder="20 Sep 2025"
            placeholderTextColor={C.hint}
          />
        </View>

        <Text style={s.fieldLabel}>To date</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={toDate}
            onChangeText={setToDate}
            placeholder="22 Sep 2025"
            placeholderTextColor={C.hint}
          />
        </View>

        <Text style={s.fieldLabel}>Duration</Text>
        <View style={[s.card, { marginBottom: 14 }]}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>
            {calculateDuration()} day{calculateDuration() !== 1 ? 's' : ''}
          </Text>
        </View>

        <Text style={s.fieldLabel}>Reason for leave</Text>
        <View style={[s.input, { height: 60 }]}>
          <TextInput
            style={s.inputText}
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Family event at home"
            placeholderTextColor={C.hint}
            multiline
          />
        </View>

        <Text style={s.fieldLabel}>Destination (optional)</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. Bangalore"
            placeholderTextColor={C.hint}
          />
        </View>

        <PrimaryButton label="Apply for leave" onPress={handleApply} loading={loading} />
        <SecondaryButton label="Save as draft" onPress={() => Alert.alert('Draft saved', 'You can edit this draft later.')} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. My Gate Passes (Student) ──────────────────────────
export function MyGatePassesScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My gate passes</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {MOCK_GATE_PASSES.map(pass => {
          const statusColor = {
            'approved':  { bg: '#E1F5EE', color: '#085041' },
            'completed': { bg: '#E1F5EE', color: '#085041' },
            'rejected':  { bg: '#FAECE7', color: '#712B13' },
          }[pass.status];

          return (
            <View key={pass.id} style={[s.card, { backgroundColor: statusColor.bg, borderWidth: 0, marginBottom: 10 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: statusColor.color }}>
                  {pass.fromDate} – {pass.toDate}
                </Text>
                <Text style={{ fontSize: 11, color: statusColor.color, fontWeight: '500' }}>
                  {pass.status === 'approved' ? 'Approved' : pass.status === 'completed' ? 'Completed' : 'Rejected'}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: statusColor.color }}>
                {pass.reason}
                {pass.status === 'completed' && ` · Returned on ${pass.returnedDate}`}
                {pass.status === 'rejected' && ` · Reason: ${pass.rejectionReason}`}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 5. Late Return Alert ─────────────────────────────────
export function LateReturnAlertScreen({ navigation }) {
  const [marking, setMarking] = useState(false);

  const handleMarkReturned = () => {
    setMarking(true);
    // TODO: supabase.from('gate_passes').update({ status: 'completed', returned_date: now }).eq('id', pass.id)
    setTimeout(() => { setMarking(false); Alert.alert('Recorded', 'Your return has been recorded with the warden.'); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notifications</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Late return alert */}
        <View style={[s.card, { backgroundColor: C.coralLight, borderColor: '#F0997B', marginBottom: 14 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 20 }}>⚠</Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#712B13' }}>You are 1 day late!</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#993C1D', lineHeight: 20, marginBottom: 12 }}>
            Your gate pass for 25–28 Aug expired on 28 Aug. Please return to the hostel immediately and report to the warden's office.
          </Text>
          <PrimaryButton label="Mark as returned" onPress={handleMarkReturned} loading={marking} />
        </View>

        {/* Approved notification */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: '#fff' }}>✓</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.text }}>Gate pass approved</Text>
            <Text style={{ fontSize: 11, color: C.muted, marginLeft: 'auto' }}>20–22 Sep</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.muted }}>
            Your leave request from 20–22 Sep has been approved.
          </Text>
        </View>

        {/* Rejected notification */}
        <View style={[s.card, { marginTop: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#E24B4A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: '#fff' }}>✕</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.text }}>Gate pass rejected</Text>
            <Text style={{ fontSize: 11, color: C.muted, marginLeft: 'auto' }}>5–7 Sep</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.muted }}>
            Your leave request for 5–7 Sep was rejected. Reason: Exam week
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:  { fontSize: 18, fontWeight: '500', color: C.text },
  fieldLabel:   { fontSize: 12, color: C.muted, marginBottom: 6 },
  input:        { height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, marginBottom: 14 },
  inputText:    { flex: 1, fontSize: 14, color: C.text },
  chip:         { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg },
  chipActive:   { backgroundColor: C.primaryLight, borderColor: C.primary },
  chipText:     { fontSize: 11, color: C.muted },
  chipTextActive: { color: C.primaryDark, fontWeight: '500' },
  photoBox:     { borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 14 },
  card:         { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 12 },
  btnP:         { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:     { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnSec:       { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecText:   { fontSize: 13, color: C.muted },
});
