// ============================================================
//  SPRINT 3 — Student Fee & Payment Screens
//  Screens: MyFeesScreen, PayFeeScreen,
//           PaymentSuccessScreen, NotificationsScreen
//  Dependencies: react-native-razorpay expo-print expo-sharing
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
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

const CURRENT_DUE = {
  month:     'September 2025',
  amount:    6500,
  dueDate:   '5 Sep 2025',
  daysLeft:  2,
  status:    'pending',
};

const PAYMENT_HISTORY = [
  { id: '1', month: 'August 2025',   amount: 6500,  status: 'paid',     paidDate: '01 Aug', mode: 'UPI',  lateFee: 0,  txn: 'TXN8821' },
  { id: '2', month: 'July 2025',     amount: 6500,  status: 'paid',     paidDate: '03 Jul', mode: 'UPI',  lateFee: 0,  txn: 'TXN7712' },
  { id: '3', month: 'June 2025',     amount: 6500,  status: 'paid',     paidDate: '07 Jun', mode: 'Card', lateFee: 50, txn: 'TXN6601' },
];

const NOTIFICATIONS = [
  {
    id: '1', type: 'fee_reminder', title: 'Fee reminder', isUnread: true,
    body: 'Your September 2025 hostel fee of ₹6,500 is due on 5 Sep. Pay now to avoid a late fee.',
    time: '2 days left', actionLabel: 'Pay now', actionScreen: 'PayFee',
  },
  {
    id: '2', type: 'payment_confirmed', title: 'Payment confirmed', isUnread: false,
    body: '₹6,500 received for August 2025. Receipt available in your fee history.',
    time: '1 Aug',
  },
  {
    id: '3', type: 'notice', title: 'New notice posted', isUnread: false,
    body: 'Hostel inspection scheduled for 4 Aug (Monday). Keep your room tidy.',
    time: '28 Jul',
  },
];

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI',                subLabel: 'GPay, PhonePe, Paytm' },
  { id: 'card',    label: 'Debit / Credit card', subLabel: 'Visa, Mastercard, Rupay' },
  { id: 'netbank', label: 'Net banking',          subLabel: 'All major banks' },
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

// ─── 1. My Fees (Student overview) ───────────────────────────
export function MyFeesScreen({ navigation }) {
  const duePercent = Math.max(0, Math.min(100, (CURRENT_DUE.daysLeft / 30) * 100));

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My fees</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {CURRENT_DUE.status === 'pending' ? (
          <View style={[s.dueCard, { backgroundColor: C.coralLight, borderColor: '#F0997B' }]}>
            <Text style={{ fontSize: 12, color: C.coral, marginBottom: 4 }}>Amount due</Text>
            <Text style={{ fontSize: 32, fontWeight: '500', color: '#712B13', marginBottom: 4 }}>
              ₹{CURRENT_DUE.amount.toLocaleString('en-IN')}
            </Text>
            <Text style={{ fontSize: 12, color: C.coral }}>
              Due by {CURRENT_DUE.dueDate} · {CURRENT_DUE.month}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1, height: 3, backgroundColor: '#F0997B', borderRadius: 2 }}>
                <View style={{ height: 3, backgroundColor: '#712B13', borderRadius: 2, width: `${duePercent}%` }} />
              </View>
              <Text style={{ fontSize: 11, color: C.coral }}>{CURRENT_DUE.daysLeft} days left</Text>
            </View>
          </View>
        ) : (
          <View style={[s.dueCard, { backgroundColor: C.tealLight, borderColor: '#9FE1CB' }]}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.teal }}>✓ All fees paid</Text>
            <Text style={{ fontSize: 12, color: C.teal, marginTop: 4 }}>Next due: 5 Oct 2025</Text>
          </View>
        )}

        {CURRENT_DUE.status === 'pending' && (
          <PrimaryButton
            label={`Pay now — ₹${CURRENT_DUE.amount.toLocaleString('en-IN')}`}
            onPress={() => navigation.navigate('PayFee', { due: CURRENT_DUE })}
          />
        )}

        <Text style={s.sectionLabel}>Payment history</Text>
        {PAYMENT_HISTORY.map(record => (
          <TouchableOpacity
            key={record.id}
            style={s.historyRow}
            onPress={() => navigation.navigate('PaymentSuccess', { record, isReceipt: true })}
            activeOpacity={0.75}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.historyMonth}>{record.month}</Text>
              <Text style={s.historyMeta}>
                Paid on {record.paidDate} · {record.mode}
                {record.lateFee > 0 ? ` · Late fee +₹${record.lateFee}` : ''}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 3 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.teal }}>
                ₹{(record.amount + record.lateFee).toLocaleString('en-IN')}
              </Text>
              <Text style={{ fontSize: 10, color: C.muted }}>Receipt →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. Pay Fee (Razorpay) ────────────────────────────────────
export function PayFeeScreen({ navigation, route }) {
  const due = route.params?.due ?? CURRENT_DUE;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);

    // ── Razorpay integration ──────────────────────────────────
    // Install: npm install react-native-razorpay
    // 
    // import RazorpayCheckout from 'react-native-razorpay';
    // 
    // const options = {
    //   description:  `Hostel fee — ${due.month}`,
    //   image:        'https://your-logo-url.png',
    //   currency:     'INR',
    //   key:          'YOUR_RAZORPAY_KEY_ID',
    //   amount:       due.amount * 100,   // in paise
    //   name:         'HostelHub',
    //   prefill:      { email: 'student@edu.in', contact: '9876543210', name: 'Ravi Kumar' },
    //   theme:        { color: '#534AB7' },
    // };
    //
    // RazorpayCheckout.open(options)
    //   .then(data => {
    //     // data.razorpay_payment_id = transaction ID
    //     // Update Supabase: status = 'paid', txn_id = data.razorpay_payment_id
    //     navigation.replace('PaymentSuccess', {
    //       record: { ...due, txn: data.razorpay_payment_id, mode: selectedMethod, paidDate: new Date().toLocaleDateString() },
    //       isReceipt: false,
    //     });
    //   })
    //   .catch(error => { Alert.alert('Payment failed', error.description ?? 'Please try again.'); })
    //   .finally(() => setLoading(false));
    // ─────────────────────────────────────────────────────────

    // Simulated for now
    setTimeout(() => {
      setLoading(false);
      navigation.replace('PaymentSuccess', {
        record: {
          month: due.month, amount: due.amount, lateFee: 0,
          txn: 'TXN' + Math.floor(Math.random() * 90000 + 10000),
          mode: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label ?? 'UPI',
          paidDate: new Date().toLocaleDateString('en-IN'),
        },
        isReceipt: false,
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pay fee</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[s.card, { backgroundColor: C.surface, marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 13, color: C.muted }}>{due.month} fee</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: C.text }}>
              ₹{due.amount.toLocaleString('en-IN')}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: C.muted }}>Room A-102 · Ravi Kumar</Text>
        </View>

        <Text style={s.sectionLabel}>Payment method</Text>
        {PAYMENT_METHODS.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[s.methodCard, selectedMethod === method.id && s.methodCardActive]}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={[s.methodTitle, selectedMethod === method.id && { color: C.primaryDark }]}>
                {method.label}
              </Text>
              <Text style={s.methodSub}>{method.subLabel}</Text>
            </View>
            <View style={[s.radio, selectedMethod === method.id && s.radioActive]}>
              {selectedMethod === method.id && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
        <PrimaryButton
          label={`Proceed to pay ₹${due.amount.toLocaleString('en-IN')}`}
          onPress={handlePay}
          loading={loading}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 12 }}>
          <Text style={{ fontSize: 12, color: C.hint }}>🔒</Text>
          <Text style={{ fontSize: 12, color: C.hint }}>Secured by Razorpay</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 3. Payment Success + Receipt ────────────────────────────
export function PaymentSuccessScreen({ navigation, route }) {
  const { record, isReceipt = false } = route.params ?? {};
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    // TODO: Use expo-print + expo-sharing to generate PDF receipt
    // const html = `<h1>Receipt</h1><p>Amount: ${record.amount}</p>...`;
    // const { uri } = await Print.printToFileAsync({ html });
    // await Sharing.shareAsync(uri);
    setTimeout(() => {
      setDownloading(false);
      Alert.alert('Downloaded', 'Receipt saved to your downloads.');
    }, 800);
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {!isReceipt && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <View style={[s.successIcon]}>
              <Text style={{ fontSize: 24, color: C.teal }}>✓</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '500', color: C.text, marginBottom: 4 }}>
              Payment successful
            </Text>
            <Text style={{ fontSize: 26, fontWeight: '500', color: C.teal }}>
              ₹{(record?.amount ?? 0).toLocaleString('en-IN')}
            </Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              {record?.paidDate} · {record?.mode}
            </Text>
          </View>
        )}

        {isReceipt && (
          <View style={s.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 22, color: C.muted }}>←</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Receipt</Text>
            <View style={{ width: 32 }} />
          </View>
        )}

        <View style={s.receiptCard}>
          <Text style={s.sectionLabel}>Receipt details</Text>
          {[
            ['Student',        'Ravi Kumar'],
            ['Room',           'A-102'],
            ['Fee month',      record?.month ?? '—'],
            ['Amount',         `₹${(record?.amount ?? 0).toLocaleString('en-IN')}`],
            ...(record?.lateFee > 0 ? [['Late fee', `₹${record.lateFee}`]] : []),
            ['Transaction ID', record?.txn ?? '—'],
            ['Payment mode',   record?.mode ?? '—'],
            ['Paid on',        record?.paidDate ?? '—'],
          ].map(([label, value], i, arr) => (
            <View
              key={label}
              style={[
                s.receiptRow,
                i === arr.length - 1 && { borderBottomWidth: 0 },
                label === 'Amount' && { marginTop: 4 },
              ]}
            >
              <Text style={s.receiptLabel}>{label}</Text>
              <Text style={[
                s.receiptValue,
                label === 'Amount' && { color: C.teal, fontSize: 15 },
                label === 'Transaction ID' && { fontSize: 11 },
              ]}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Download receipt PDF"
          onPress={handleDownloadReceipt}
          loading={downloading}
        />
        <SecondaryButton
          label={isReceipt ? 'Back' : 'Back to fees'}
          onPress={() => navigation.navigate('MyFees')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 4. Notifications Screen ──────────────────────────────────
export function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(n => n.map(item => ({ ...item, isUnread: false })));
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'fee_reminder':      return { bg: C.primary,    icon: '🔔' };
      case 'payment_confirmed': return { bg: C.teal,       icon: '✓' };
      case 'notice':            return { bg: C.amber,      icon: '📢' };
      case 'gate_pass':         return { bg: C.primaryDark, icon: '🎫' };
      default:                  return { bg: C.muted,      icon: '•' };
    }
  };

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={{ fontSize: 13, color: C.primary }}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notifications.map(notif => {
          const { bg, icon } = getIconColor(notif.type);
          return (
            <View
              key={notif.id}
              style={[
                s.notifCard,
                notif.isUnread && { borderColor: C.primary, borderWidth: 1.5, backgroundColor: C.primaryLight },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <View style={[s.notifIcon, { backgroundColor: bg }]}>
                  <Text style={{ fontSize: 11, color: '#fff' }}>{icon}</Text>
                </View>
                <Text style={[s.notifTitle, notif.isUnread && { color: C.primaryDark }]}>
                  {notif.title}
                </Text>
                {notif.isUnread && (
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary, marginLeft: 2 }} />
                )}
                <Text style={[s.notifTime, { marginLeft: 'auto' }]}>{notif.time}</Text>
              </View>

              <Text style={[s.notifBody, notif.isUnread && { color: C.primaryDark }]}>
                {notif.body}
              </Text>

              {notif.actionLabel && (
                <TouchableOpacity
                  style={[s.notifAction, { backgroundColor: C.primary }]}
                  onPress={() => navigation.navigate(notif.actionScreen)}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#fff' }}>{notif.actionLabel}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: C.bg },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerTitle:     { fontSize: 18, fontWeight: '500', color: C.text },
  sectionLabel:    { fontSize: 11, fontWeight: '500', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 6 },
  dueCard:         { borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 0.5 },
  historyRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  historyMonth:    { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 3 },
  historyMeta:     { fontSize: 12, color: C.muted },
  methodCard:      { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 0.5, borderColor: C.border, padding: 14, marginBottom: 10 },
  methodCardActive:{ borderColor: C.primary, borderWidth: 1.5, backgroundColor: C.primaryLight },
  methodTitle:     { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  methodSub:       { fontSize: 12, color: C.muted },
  radio:           { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  radioActive:     { borderColor: C.primary, backgroundColor: C.primary },
  successIcon:     { width: 60, height: 60, borderRadius: 30, backgroundColor: C.tealLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  receiptCard:     { borderWidth: 0.5, borderColor: C.border, borderRadius: 14, padding: 16, marginBottom: 16 },
  receiptRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: C.border },
  receiptLabel:    { fontSize: 13, color: C.muted },
  receiptValue:    { fontSize: 13, fontWeight: '500', color: C.text },
  notifCard:       { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 10 },
  notifIcon:       { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  notifTitle:      { fontSize: 13, fontWeight: '500', color: C.text },
  notifTime:       { fontSize: 11, color: C.muted },
  notifBody:       { fontSize: 13, color: C.muted, lineHeight: 20 },
  notifAction:     { height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  card:            { borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 12 },
  btnP:            { height: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnPText:        { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnSec:          { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecText:      { fontSize: 13, color: C.muted },
});
