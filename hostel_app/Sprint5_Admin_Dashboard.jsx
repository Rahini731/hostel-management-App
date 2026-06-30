// ============================================================
//  SPRINT 5 — Admin Dashboard
//  Screens: AdminDashboardScreen, ActivityFeedScreen
//  Dependencies: same as Sprint 1 (no extra libs needed,
//  uses plain Views for the donut chart)
// ============================================================

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg'; // npx expo install react-native-svg

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
  red:          '#E24B4A',
  bg:           '#FFFFFF',
  surface:      '#F5F5F3',
  border:       'rgba(0,0,0,0.12)',
  text:         '#1A1A1A',
  muted:        '#6B6B6B',
  hint:         '#ABABAB',
};

// ─── Mock Data ────────────────────────────────────────────
const DASHBOARD_DATA = {
  occupancy: { filled: 36, total: 48 },
  fees: { collected: 184000, pending: 46000, percentCollected: 80, overdueCount: 8 },
  complaints: { open: 4, inProgress: 5, resolved: 23 },
  gatePasses: { pending: 5 },
};

const ACTIVITY_FEED = [
  { id: '1', type: 'payment',  text: 'Priya Selvan paid hostel fee — ₹6,500', time: '2 min ago', color: C.teal },
  { id: '2', type: 'assign',   text: 'Mr. Venkat assigned to complaint #1042', time: '18 min ago', color: C.primary },
  { id: '3', type: 'gatepass', text: 'Ravi Kumar applied for gate pass 20–22 Sep', time: '1 hr ago', color: C.amber },
  { id: '4', type: 'complaint',text: 'Arjun Mehta raised complaint — WiFi issue', time: '2 hrs ago', color: C.red },
  { id: '5', type: 'room',     text: 'Divya Varma room allocated — A-301', time: '5 hrs ago', color: C.teal },
  { id: '6', type: 'notice',   text: 'Admin posted notice — Hostel inspection', time: 'Yesterday', color: C.primary },
  { id: '7', type: 'gatepass', text: 'Karthik Rajan gate pass approved', time: 'Yesterday', color: C.teal },
];

// ─── Donut chart component (no extra deps beyond react-native-svg) ──
const DonutChart = ({ percent, size = 56, strokeWidth = 8, color = C.teal, trackColor = C.tealLight }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filledLength = (percent / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={trackColor} strokeWidth={strokeWidth}
      />
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${filledLength} ${circumference}`}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};

// ─── 1. Admin Dashboard (Overview) ─────────────────────────
export function AdminDashboardScreen({ navigation }) {
  const { occupancy, fees, complaints, gatePasses } = DASHBOARD_DATA;
  const occupancyPercent = Math.round((occupancy.filled / occupancy.total) * 100);
  const available = occupancy.total - occupancy.filled;

  const formatCurrency = (amt) => `₹${(amt / 1000).toFixed(amt >= 100000 ? 2 : 0)}${amt >= 100000 ? 'L' : 'K'}`;

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Dashboard</Text>
        <Text style={{ fontSize: 12, color: C.hint }}>September 2025</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Occupancy widget */}
        <TouchableOpacity
          style={s.widgetCard}
          onPress={() => navigation.navigate('RoomDashboard')}
          activeOpacity={0.75}
        >
          <Text style={s.widgetTitle}>Room occupancy</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <DonutChart percent={occupancyPercent} color={C.teal} trackColor={C.tealLight} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 12, color: C.muted }}>Filled</Text>
                <Text style={{ fontSize: 13, fontWeight: '500', color: C.teal }}>
                  {occupancy.filled} / {occupancy.total}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: C.muted }}>Available</Text>
                <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{available}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Fee collection widget */}
        <TouchableOpacity
          style={s.widgetCard}
          onPress={() => navigation.navigate('FeeDashboard')}
          activeOpacity={0.75}
        >
          <Text style={s.widgetTitle}>Fee collection — September</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: C.muted }}>Collected {formatCurrency(fees.collected)}</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>Pending {formatCurrency(fees.pending)}</Text>
          </View>
          <View style={{ height: 8, backgroundColor: C.coralLight, borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: 8, backgroundColor: C.teal, borderRadius: 4, width: `${fees.percentCollected}%` }} />
          </View>
          <Text style={{ fontSize: 11, color: C.hint, marginTop: 6 }}>
            {fees.percentCollected}% collected · {fees.overdueCount} students overdue
          </Text>
        </TouchableOpacity>

        {/* Complaints widget */}
        <TouchableOpacity
          style={s.widgetCard}
          onPress={() => navigation.navigate('ComplaintList')}
          activeOpacity={0.75}
        >
          <Text style={s.widgetTitle}>Active complaints</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              ['Open', complaints.open, C.coralLight, C.coral],
              ['In progress', complaints.inProgress, C.primaryLight, C.primaryDark],
              ['Resolved', complaints.resolved, C.tealLight, C.teal],
            ].map(([label, count, bg, color]) => (
              <View key={label} style={{ flex: 1, backgroundColor: bg, borderRadius: 8, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color }}>{count}</Text>
                <Text style={{ fontSize: 10, color, marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* Gate pass widget */}
        <TouchableOpacity
          style={s.widgetCard}
          onPress={() => navigation.navigate('GatePassList')}
          activeOpacity={0.75}
        >
          <Text style={s.widgetTitle}>Pending gate passes</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.amberLight, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '500', color: C.amber }}>{gatePasses.pending}</Text>
              </View>
              <Text style={{ fontSize: 13, color: C.muted }}>awaiting approval</Text>
            </View>
            <Text style={{ fontSize: 12, color: C.primary, fontWeight: '500' }}>Review →</Text>
          </View>
        </TouchableOpacity>

        {/* Activity feed shortcut */}
        <TouchableOpacity
          style={[s.widgetCard, { backgroundColor: C.surface, borderWidth: 0 }]}
          onPress={() => navigation.navigate('ActivityFeed')}
          activeOpacity={0.75}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={s.widgetTitle}>Recent activity</Text>
            <Text style={{ fontSize: 12, color: C.primary, fontWeight: '500' }}>See all →</Text>
          </View>
          {ACTIVITY_FEED.slice(0, 2).map(item => (
            <View key={item.id} style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.color, marginTop: 5 }} />
              <Text style={{ fontSize: 12, color: C.muted, flex: 1 }}>{item.text}</Text>
            </View>
          ))}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. Activity Feed (Full list) ──────────────────────────
export function ActivityFeedScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Recent activity</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {ACTIVITY_FEED.map(item => (
          <View key={item.id} style={s.activityRow}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginTop: 5 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 13, color: C.text, lineHeight: 19 }}>{item.text}</Text>
              <Text style={{ fontSize: 11, color: C.hint, marginTop: 2 }}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:  { fontSize: 18, fontWeight: '500', color: C.text },
  widgetCard:   { borderWidth: 0.5, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  widgetTitle:  { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 10 },
  activityRow:  { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
});
