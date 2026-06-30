// ============================================================
//  SPRINT 2 — Student Screens
//  Screens: MyRoomScreen, RoomDetailScreen,
//           HostelRulesScreen, BlockInfoScreen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';

const C = {
  primary:      '#534AB7',
  primaryLight: '#EEEDFE',
  primaryDark:  '#3C3489',
  teal:         '#0F6E56',
  tealLight:    '#E1F5EE',
  amber:        '#854F0B',
  amberLight:   '#FAEEDA',
  bg:           '#FFFFFF',
  surface:      '#F5F5F3',
  border:       'rgba(0,0,0,0.12)',
  text:         '#1A1A1A',
  muted:        '#6B6B6B',
  hint:         '#ABABAB',
};

// ─── Mock Data ───────────────────────────────────────────────
const MY_ROOM = {
  number:     'A-102',
  block:      'A',
  floor:      1,
  type:       'Double sharing',
  warden:     'Mr. Suresh',
  wardenPhone: '+91 99001 12345',
  attachedBath: true,
  ac:         false,
  wifi:       true,
  amenities:  ['WiFi', 'Study desk', 'Wardrobe', 'Fan'],
  allocation: { from: 'Aug 2025', to: 'May 2026' },
  maintenanceNote: 'Last inspected: 12 Jul 2025. Minor plumbing fix done. No pending issues.',
  roommates: [
    { id: '1', name: 'Ravi Kumar',  initials: 'RK', course: 'CS',   year: '2nd', isMe: true,  bg: '#EEEDFE', color: '#3C3489' },
    { id: '2', name: 'Arjun Mehta', initials: 'AM', course: 'Mech', year: '2nd', isMe: false, bg: '#E1F5EE', color: '#085041' },
  ],
};

const HOSTEL_RULES = [
  { category: 'Timing', rules: [
    'Gates close at 10:00 PM on weekdays, 11:00 PM on weekends.',
    'Lights-out in common areas by 11:30 PM.',
    'Students returning after gate close must report at the warden\'s office.',
  ]},
  { category: 'Conduct', rules: [
    'No visitors of opposite gender beyond the reception area.',
    'Noise levels must remain low after 10:00 PM.',
    'Alcohol and smoking are strictly prohibited on campus premises.',
    'Ragging in any form is a punishable offence.',
  ]},
  { category: 'Cleanliness', rules: [
    'Rooms are inspected every Monday morning. Keep rooms tidy.',
    'Dispose waste only in designated bins on each floor.',
    'Cooking inside rooms is not permitted.',
  ]},
  { category: 'Fees & leave', rules: [
    'Hostel fee must be paid by the 5th of every month.',
    'Gate pass must be applied at least 24 hours in advance.',
    'Extended leave beyond 3 days requires warden approval.',
  ]},
];

const BLOCKS = [
  {
    name: 'A Block',
    isMyBlock: true,
    floors: 3,
    rooms: 18,
    students: 36,
    warden: 'Mr. Suresh',
    wardenPhone: '+91 99001 12345',
    status: 'active',
  },
  {
    name: 'B Block',
    isMyBlock: false,
    floors: 2,
    rooms: 12,
    students: 30,
    warden: 'Mrs. Radha',
    wardenPhone: '+91 99002 23456',
    status: 'active',
  },
  {
    name: 'C Block',
    isMyBlock: false,
    floors: 2,
    rooms: 18,
    students: 0,
    warden: 'TBD',
    wardenPhone: null,
    status: 'renovation',
  },
];

// ─── Shared ──────────────────────────────────────────────────
const Avatar = ({ initials, bg, color, size = 34 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size * 0.32, fontWeight: '500', color }}>{initials}</Text>
  </View>
);

// ─── 1. My Room (overview) ────────────────────────────────────
export function MyRoomScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My room</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RoomDetail')}>
          <Text style={{ fontSize: 13, color: C.primary }}>See details</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Hero card */}
        <View style={s.heroCard}>
          <Text style={s.heroRoomNum}>{MY_ROOM.number}</Text>
          <Text style={s.heroRoomSub}>{MY_ROOM.block} Block · Floor {MY_ROOM.floor} · {MY_ROOM.type}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal }} />
            <Text style={{ fontSize: 11, color: C.teal, fontWeight: '500', marginLeft: 6 }}>
              Allocated · {MY_ROOM.allocation.from} – {MY_ROOM.allocation.to}
            </Text>
          </View>
        </View>

        {/* Info tiles */}
        <View style={s.infoGrid}>
          {[
            ['Block',    `${MY_ROOM.block} Block`],
            ['Floor',    `Floor ${MY_ROOM.floor}`],
            ['Type',     MY_ROOM.type],
            ['Warden',   MY_ROOM.warden],
          ].map(([label, value]) => (
            <View key={label} style={s.infoTile}>
              <Text style={s.infoTileLbl}>{label}</Text>
              <Text style={s.infoTileVal}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Roommates */}
        <Text style={s.sectionLabel}>Roommates</Text>
        {MY_ROOM.roommates.map(rm => (
          <View key={rm.id} style={s.roommateRow}>
            <Avatar initials={rm.initials} bg={rm.bg} color={rm.color} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.rmateName}>{rm.name}</Text>
              <Text style={s.rmateMeta}>{rm.course} · {rm.year} year</Text>
            </View>
            {rm.isMe && (
              <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                <Text style={{ fontSize: 10, color: C.primaryDark, fontWeight: '500' }}>You</Text>
              </View>
            )}
          </View>
        ))}

        {/* Quick links */}
        <Text style={s.sectionLabel}>Explore</Text>
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {[
            { label: 'My fees',       screen: 'MyFees' },
            { label: 'Complaints',    screen: 'MyComplaints' },
            { label: 'Gate passes',   screen: 'MyGatePasses' },
            { label: 'Notices',       screen: 'NoticeList' },
            { label: 'Notifications', screen: 'Notifications' },
            { label: 'Hostel rules',  screen: 'HostelRules' },
            { label: 'Block info',    screen: 'BlockInfo' },
          ].map(({ label, screen }) => (
            <TouchableOpacity
              key={screen}
              style={[s.quickLink, { marginRight: 10 }]}
              onPress={() => navigation.navigate(screen)}
              activeOpacity={0.75}
            >
              <Text style={s.quickLinkText}>{label} →</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. Room Detail (tabbed) ──────────────────────────────────
export function RoomDetailScreen({ navigation }) {
  const [tab, setTab] = useState('Details');
  const tabs = ['Details', 'Mates', 'History'];

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Room {MY_ROOM.number}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {tab === 'Details' && (
          <>
            <View style={s.infoGrid}>
              {[
                ['Capacity',      `${MY_ROOM.roommates.length} beds`],
                ['Occupied',      `${MY_ROOM.roommates.length} / ${MY_ROOM.roommates.length}`],
                ['Attached bath', MY_ROOM.attachedBath ? 'Yes' : 'No'],
                ['AC',            MY_ROOM.ac ? 'Yes' : 'No'],
              ].map(([lbl, val]) => (
                <View key={lbl} style={s.infoTile}>
                  <Text style={s.infoTileLbl}>{lbl}</Text>
                  <Text style={s.infoTileVal}>{val}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionLabel}>Amenities</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
              {MY_ROOM.amenities.map((a, i) => (
                <View key={a} style={[
                  s.amenityPill,
                  { backgroundColor: i % 2 === 0 ? C.tealLight : C.primaryLight, borderColor: i % 2 === 0 ? '#9FE1CB' : '#AFA9EC', marginRight: 7, marginBottom: 7 }
                ]}>
                  <Text style={{ fontSize: 11, color: i % 2 === 0 ? '#085041' : C.primaryDark }}>{a}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionLabel}>Maintenance note</Text>
            <View style={s.infoBox}>
              <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>{MY_ROOM.maintenanceNote}</Text>
            </View>
          </>
        )}

        {tab === 'Mates' && (
          <>
            {MY_ROOM.roommates.map(rm => (
              <View key={rm.id} style={s.roommateRow}>
                <Avatar initials={rm.initials} bg={rm.bg} color={rm.color} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.rmateName}>{rm.name}</Text>
                  <Text style={s.rmateMeta}>{rm.course} · {rm.year} year</Text>
                </View>
                {rm.isMe && (
                  <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                    <Text style={{ fontSize: 11, color: C.primaryDark, fontWeight: '500' }}>You</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {tab === 'History' && (
          <>
            <Text style={s.sectionLabel}>Allocation history</Text>
            {[
              { label: 'Current allocation', date: 'Aug 2025 – May 2026', room: 'A-102', status: 'active' },
              { label: 'Previous year',       date: 'Aug 2024 – May 2025', room: 'B-204', status: 'past' },
            ].map((h, i) => (
              <View key={i} style={[s.infoBox, { marginBottom: 10 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: C.text }}>{h.room}</Text>
                  <View style={{ backgroundColor: h.status === 'active' ? C.tealLight : C.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                    <Text style={{ fontSize: 10, color: h.status === 'active' ? '#085041' : C.muted, fontWeight: '500' }}>
                      {h.status === 'active' ? 'Current' : 'Past'}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: C.muted }}>{h.date}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Hostel Rules ──────────────────────────────────────────
export function HostelRulesScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Hostel rules</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {HOSTEL_RULES.map(section => (
          <View key={section.category} style={{ marginBottom: 20 }}>
            <View style={{ backgroundColor: C.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '500', color: C.primaryDark }}>{section.category}</Text>
            </View>
            {section.rules.map((rule, i) => (
              <View key={i} style={s.ruleRow}>
                <View style={s.ruleDot} />
                <Text style={s.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={[s.infoBox, { backgroundColor: C.amberLight, borderColor: '#EF9F27' }]}>
          <Text style={{ fontSize: 12, color: '#633806', lineHeight: 18 }}>
            Violation of hostel rules may result in disciplinary action including suspension from hostel.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Block Info ────────────────────────────────────────────
export function BlockInfoScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Block info</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {BLOCKS.map(block => (
          <View
            key={block.name}
            style={[
              s.blockCard,
              block.isMyBlock && { backgroundColor: C.primaryLight, borderColor: '#AFA9EC' }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={[s.blockName, block.isMyBlock && { color: C.primaryDark }]}>
                {block.name}
              </Text>
              {block.isMyBlock && (
                <View style={{ backgroundColor: C.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                  <Text style={{ fontSize: 10, color: '#fff', fontWeight: '500' }}>Your block</Text>
                </View>
              )}
              {block.status === 'renovation' && (
                <View style={{ backgroundColor: C.amberLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 0.5, borderColor: '#EF9F27' }}>
                  <Text style={{ fontSize: 10, color: C.amber, fontWeight: '500' }}>Under renovation</Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
              {[
                `${block.floors} floors`,
                `${block.rooms} rooms`,
                block.students > 0 ? `${block.students} students` : 'No students',
              ].map(chip => (
                <View key={chip} style={[s.blockChip, block.isMyBlock && { backgroundColor: C.primaryLight, borderColor: '#AFA9EC', marginRight: 6, marginBottom: 6 }]}>
                  <Text style={{ fontSize: 11, color: block.isMyBlock ? C.primary : C.muted }}>{chip}</Text>
                </View>
              ))}
            </View>

            {block.warden !== 'TBD' && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                  initials={block.warden.split(' ').map(w => w[0]).join('')}
                  bg={block.isMyBlock ? C.primary : C.surface}
                  color={block.isMyBlock ? '#fff' : C.muted}
                  size={28}
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: block.isMyBlock ? C.primaryDark : C.text }}>
                    {block.warden}
                  </Text>
                  {block.wardenPhone && (
                    <Text style={{ fontSize: 11, color: C.muted }}>{block.wardenPhone}</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: C.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:    { fontSize: 18, fontWeight: '500', color: C.text },
  sectionLabel:   { fontSize: 11, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 10 },

  heroCard:       { backgroundColor: C.primaryLight, borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#AFA9EC' },
  heroRoomNum:    { fontSize: 28, fontWeight: '500', color: C.primaryDark, marginBottom: 3 },
  heroRoomSub:    { fontSize: 13, color: C.primary },

  infoGrid:       { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  infoTile:       { width: '47.5%', backgroundColor: C.surface, borderRadius: 10, padding: 10, marginRight: '5%', marginBottom: 8 },
  infoTileLbl:    { fontSize: 11, color: C.muted, marginBottom: 3 },
  infoTileVal:    { fontSize: 13, fontWeight: '500', color: C.text },

  roommateRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
  rmateName:      { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  rmateMeta:      { fontSize: 12, color: C.muted },

  quickLink:      { flex: 1, borderWidth: 0.5, borderColor: C.border, borderRadius: 10, padding: 12, alignItems: 'center' },
  quickLinkText:  { fontSize: 13, color: C.primary, fontWeight: '500' },

  tabBar:         { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border },
  tab:            { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabActive:      { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText:        { fontSize: 13, color: C.muted },
  tabTextActive:  { color: C.primary, fontWeight: '500' },

  amenityPill:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 0.5 },
  infoBox:        { borderWidth: 0.5, borderColor: C.border, borderRadius: 10, padding: 12 },

  ruleRow:        { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: C.border },
  ruleDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 5, flexShrink: 0 },
  ruleText:       { fontSize: 13, color: C.muted, lineHeight: 20, flex: 1, marginLeft: 10 },

  blockCard:      { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 12 },
  blockName:      { fontSize: 15, fontWeight: '500', color: C.text },
  blockChip:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, marginRight: 6, marginBottom: 6 },
});