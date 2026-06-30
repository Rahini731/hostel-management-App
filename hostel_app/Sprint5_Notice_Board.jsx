// ============================================================
//  SPRINT 5 — Notice Board
//  Screens: NoticeListScreen (Student), NoticeDetailScreen,
//           CreateNoticeScreen (Admin), ManageNoticesScreen (Admin)
//  Dependencies: same as Sprint 1 + expo-notifications (push)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Alert, Switch,
} from 'react-native';

const C = {
  primary:      '#534AB7',
  primaryLight: '#EEEDFE',
  primaryDark:  '#3C3489',
  teal:         '#0F6E56',
  tealLight:    '#E1F5EE',
  bg:           '#FFFFFF',
  surface:      '#F5F5F3',
  border:       'rgba(0,0,0,0.12)',
  text:         '#1A1A1A',
  muted:        '#6B6B6B',
  hint:         '#ABABAB',
};

const MOCK_NOTICES = [
  { id: '1', title: 'Hostel inspection scheduled', content: 'Rooms will be inspected on 4 Sep (Monday) from 10 AM onwards. All students are requested to keep their rooms tidy and ensure cupboards are unlocked for inspection.\n\nPlease avoid leaving valuables unattended during this time. Any maintenance issues found will be logged and assigned automatically.', isPinned: true, postedDate: '2 Sep 2025', postedTime: '9:00 AM', views: 142, audience: 'All students' },
  { id: '2', title: 'Mess menu changed for September', content: 'New weekly mess menu is now live. Check the dining hall notice board for details.', isPinned: false, postedDate: '1 Sep 2025', postedTime: '8:30 AM', views: 98, audience: 'All students' },
  { id: '3', title: 'Water supply maintenance on 5 Sep', content: 'Water supply will be interrupted from 9 AM to 1 PM for tank cleaning.', isPinned: false, postedDate: '31 Aug 2025', postedTime: '6:00 PM', views: 156, audience: 'All students' },
  { id: '4', title: 'Diwali holiday schedule released', content: 'Hostel will remain open during Diwali break. Mess timings adjusted — see attached PDF.', isPinned: false, postedDate: '28 Aug 2025', postedTime: '11:00 AM', views: 203, audience: 'All students' },
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

// ─── 1. Notice List (Student) ─────────────────────────────
export function NoticeListScreen({ navigation }) {
  // Sort: pinned first, then by date
  const sorted = [...MOCK_NOTICES].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notices</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sorted.map(notice => (
          <TouchableOpacity
            key={notice.id}
            style={[s.noticeCard, notice.isPinned && { backgroundColor: C.primaryLight, borderColor: '#AFA9EC' }]}
            onPress={() => navigation.navigate('NoticeDetail', { notice })}
            activeOpacity={0.75}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={[s.noticeTitle, notice.isPinned && { color: C.primaryDark }]}>
                {notice.title}
              </Text>
              {notice.isPinned && <Text style={{ fontSize: 12, marginLeft: 6 }}>📌</Text>}
            </View>
            <Text style={[s.noticeBody, notice.isPinned && { color: C.primary }]} numberOfLines={2}>
              {notice.content}
            </Text>
            <Text style={[s.noticeDate, notice.isPinned && { color: C.primary }]}>
              Posted {notice.postedDate} · Admin
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. Notice Detail ──────────────────────────────────────
export function NoticeDetailScreen({ navigation, route }) {
  const notice = route.params?.notice ?? MOCK_NOTICES[0];

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Notice</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notice.isPinned && (
          <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: C.primaryDark, fontWeight: '500' }}>📌 Pinned</Text>
          </View>
        )}
        <Text style={{ fontSize: 20, fontWeight: '500', color: C.text, marginBottom: 8, lineHeight: 28 }}>
          {notice.title}
        </Text>
        <Text style={{ fontSize: 12, color: C.hint, marginBottom: 20 }}>
          Posted by Admin · {notice.postedDate}, {notice.postedTime}
        </Text>
        <Text style={{ fontSize: 14, color: C.muted, lineHeight: 24 }}>
          {notice.content}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Create Notice (Admin) ─────────────────────────────
export function CreateNoticeScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All students');
  const [pinned, setPinned] = useState(false);
  const [sendPush, setSendPush] = useState(true);
  const [loading, setLoading] = useState(false);
  const audiences = ['All students', 'A Block', 'B Block'];

  const handlePublish = () => {
    if (!title || !content) { Alert.alert('Required', 'Title and content are required.'); return; }
    setLoading(true);
    // TODO: supabase.from('notices').insert({ title, content, audience, is_pinned: pinned, posted_by: adminId, created_at: now })
    //
    // if (sendPush) {
    //   // TODO: Trigger push notification via Firebase Cloud Messaging
    //   // Call your backend endpoint that sends FCM message to all student tokens
    //   // matching the audience filter:
    //   //
    //   // await fetch('YOUR_BACKEND_URL/send-notification', {
    //   //   method: 'POST',
    //   //   body: JSON.stringify({
    //   //     title: 'New notice posted',
    //   //     body: title,
    //   //     audience: audience,
    //   //     data: { screen: 'NoticeDetail', noticeId: newNoticeId },
    //   //   }),
    //   // });
    // }
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>New notice</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.fieldLabel}>Title</Text>
        <View style={s.input}>
          <TextInput
            style={s.inputText}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Hostel inspection scheduled"
            placeholderTextColor={C.hint}
          />
        </View>

        <Text style={s.fieldLabel}>Content</Text>
        <View style={[s.input, { height: 110, alignItems: 'flex-start', paddingTop: 10 }]}>
          <TextInput
            style={[s.inputText, { textAlignVertical: 'top' }]}
            value={content}
            onChangeText={setContent}
            placeholder="Write the full notice content here..."
            placeholderTextColor={C.hint}
            multiline
          />
        </View>

        <Text style={s.fieldLabel}>Audience</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {audiences.map(a => (
            <TouchableOpacity
              key={a}
              style={[s.chip, audience === a && s.chipActive]}
              onPress={() => setAudience(a)}
            >
              <Text style={[s.chipText, audience === a && s.chipTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.toggleRow}>
          <Text style={{ fontSize: 13, color: C.text }}>📌 Pin this notice</Text>
          <Switch
            value={pinned}
            onValueChange={setPinned}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={s.toggleRow}>
          <Text style={{ fontSize: 13, color: C.text }}>🔔 Send push notification</Text>
          <Switch
            value={sendPush}
            onValueChange={setSendPush}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor="#fff"
          />
        </View>

        <PrimaryButton label="Publish notice" onPress={handlePublish} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Manage Notices (Admin) ────────────────────────────
export function ManageNoticesScreen({ navigation }) {
  const [notices, setNotices] = useState(MOCK_NOTICES);

  const togglePin = (id) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    // TODO: supabase.from('notices').update({ is_pinned: !current }).eq('id', id)
  };

  const pinned = notices.filter(n => n.isPinned);
  const others = notices.filter(n => !n.isPinned);

  const renderNotice = (notice) => (
    <View
      key={notice.id}
      style={[s.noticeCard, notice.isPinned && { backgroundColor: C.primaryLight, borderColor: '#AFA9EC' }]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={[s.noticeTitle, { flex: 1 }, notice.isPinned && { color: C.primaryDark }]}>
          {notice.title}
        </Text>
        <TouchableOpacity onPress={() => togglePin(notice.id)}>
          <Text style={{ fontSize: 11, color: notice.isPinned ? C.primary : C.hint, marginLeft: 8 }}>
            {notice.isPinned ? 'Unpin' : 'Pin'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[s.noticeDate, notice.isPinned && { color: C.primary }]}>
        {notice.postedDate} · {notice.views} views
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Manage notices</Text>
        <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.primary }]}
          onPress={() => navigation.navigate('CreateNotice')}>
          <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {pinned.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Pinned</Text>
            {pinned.map(renderNotice)}
          </>
        )}
        <Text style={s.sectionLabel}>All notices</Text>
        {others.map(renderNotice)}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:  { fontSize: 18, fontWeight: '500', color: C.text },
  iconBtn:      { paddingHorizontal: 12, height: 32, borderRadius: 8, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 12 },
  fieldLabel:   { fontSize: 12, color: C.muted, marginBottom: 6 },
  input:        { height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, marginBottom: 14 },
  inputText:    { flex: 1, fontSize: 14, color: C.text },
  chip:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg },
  chipActive:   { backgroundColor: C.primaryLight, borderColor: C.primary },
  chipText:     { fontSize: 12, color: C.muted },
  chipTextActive: { color: C.primaryDark, fontWeight: '500' },
  toggleRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  noticeCard:   { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 10 },
  noticeTitle:  { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 4 },
  noticeBody:   { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 6 },
  noticeDate:   { fontSize: 11, color: C.hint },
  btnP:         { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:     { fontSize: 15, fontWeight: '500', color: '#fff' },
});
