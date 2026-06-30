// ============================================================
//  SPRINT 1 — Auth Screens (React Native + Expo)
//  Screens: SplashScreen, LoginScreen, OTPScreen, RoleScreen
//  Navigation: React Navigation (Stack)
//  Dependencies: @react-navigation/native @react-navigation/native-stack
//                expo-status-bar react-native-safe-area-context
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

// ─── Design Tokens ──────────────────────────────────────────
const COLORS = {
  primary:      '#534AB7',
  primaryLight: '#EEEDFE',
  primaryDark:  '#3C3489',
  teal:         '#0F6E56',
  tealLight:    '#E1F5EE',
  bg:           '#FFFFFF',
  surface:      '#F5F5F3',
  border:       'rgba(0,0,0,0.12)',
  text:         '#1A1A1A',
  textMuted:    '#6B6B6B',
  textHint:     '#ABABAB',
  danger:       '#E24B4A',
  success:      '#1D9E75',
};

// ─── Reusable Components ─────────────────────────────────────

const AppLogo = ({ size = 56 }) => (
  <View style={[styles.logoMark, { width: size, height: size, borderRadius: size * 0.25 }]}>
    <View style={[styles.logoInner, { width: size * 0.5, height: size * 0.5, borderRadius: size * 0.12 }]} />
  </View>
);

const PrimaryButton = ({ label, onPress, loading = false, disabled = false }) => (
  <TouchableOpacity
    style={[styles.btnPrimary, disabled && styles.btnDisabled]}
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled || loading}
  >
    {loading
      ? <ActivityIndicator color="#fff" size="small" />
      : <Text style={styles.btnPrimaryText}>{label}</Text>
    }
  </TouchableOpacity>
);

const SecondaryButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.btnSecondary} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.btnSecondaryText}>{label}</Text>
  </TouchableOpacity>
);

const StepDots = ({ total, current }) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
    ))}
  </View>
);

// ─── Screen 1: Splash ────────────────────────────────────────

export function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.splashCenter, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <AppLogo size={64} />
        <Text style={styles.appTitle}>HostelHub</Text>
        <Text style={styles.appTagline}>Smart hostel management{'\n'}for students & wardens</Text>
      </Animated.View>

      <View style={styles.splashButtons}>
        <PrimaryButton label="Get started" onPress={() => navigation.navigate('Role')} />
        <SecondaryButton label="I already have an account" onPress={() => navigation.navigate('Login')} />
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Screen 2: Login ─────────────────────────────────────────

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    // TODO: Replace with Supabase auth call
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setTimeout(() => {
      setLoading(false);
      // For demo: navigate to student dashboard after login
      // In production, check user role from Supabase
      navigation.navigate('MyRoom');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.screenTitle}>Welcome back</Text>
          <Text style={styles.screenSub}>Sign in to your hostel account</Text>

          <StepDots total={3} current={0} />

          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@student.edu"
            placeholderTextColor={COLORS.textHint}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textHint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate('OTP', { email, mode: 'reset' })}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton label="Sign in" onPress={handleLogin} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <SecondaryButton
            label="Sign in with OTP instead"
            onPress={() => navigation.navigate('OTP', { email })}
          />

          <Text style={styles.registerHint}>
            New here?{' '}
            <Text style={styles.linkText}>Contact your warden</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Screen 3: OTP Verification ───────────────────────────────

export function OTPScreen({ navigation, route }) {
  const { email = '' } = route.params ?? {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, []); // Empty deps - timer handles its own state

  const handleChange = (val, index) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[index] = val.slice(-1); // Ensure single digit
    setOtp(updated);
    if (val && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    // TODO: Replace with Supabase OTP verification
    // const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setTimeout(() => {
      setLoading(false);
      // After OTP verification, go to role selection
      navigation.navigate('Role');
    }, 1000);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    // TODO: supabase.auth.signInWithOtp({ email });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <View style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </View>
            <Text style={styles.screenTitle}>OTP verification</Text>
          </TouchableOpacity>

          <StepDots total={3} current={1} />

          <Text style={styles.otpLabel}>Code sent to</Text>
          <Text style={styles.otpEmail}>{email || 'your email'}</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={val => handleChange(val, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <PrimaryButton
            label="Verify OTP"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.join('').length < 6}
          />

          <View style={styles.resendRow}>
            {countdown > 0 ? (
              <Text style={styles.resendText}>
                Resend in{' '}
                <Text style={styles.linkText}>0:{String(countdown).padStart(2, '0')}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.linkText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>OTP is valid for 10 minutes. Do not share with anyone.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Screen 4: Role Selection ─────────────────────────────────

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    desc: 'View room, pay fees, raise complaints',
    color: COLORS.primary,
    bgColor: COLORS.primaryLight,
  },
  {
    id: 'admin',
    title: 'Admin / Warden',
    desc: 'Manage rooms, students, fees & notices',
    color: COLORS.teal,
    bgColor: COLORS.tealLight,
  },
];

export function RoleScreen({ navigation }) {
  const [selected, setSelected] = useState('student');

  const handleContinue = () => {
    // Navigate to appropriate dashboard based on role
    if (selected === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      navigation.navigate('MyRoom');
    }
  };

  const selectedRole = ROLES.find(r => r.id === selected);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <View style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </View>
          <Text style={styles.screenTitle}>Select your role</Text>
        </TouchableOpacity>

        <StepDots total={3} current={2} />

        <Text style={[styles.screenSub, { marginBottom: 20 }]}>
          Choose how you want to access the app
        </Text>

        {ROLES.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, selected === role.id && { borderColor: role.color, borderWidth: 1.5, backgroundColor: role.bgColor }]}
            onPress={() => setSelected(role.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.roleIconWrap, { backgroundColor: role.bgColor }]}>
              {/* Swap with an icon library (e.g., @expo/vector-icons) in production */}
              <Text style={{ fontSize: 16, color: role.color }}>
                {role.id === 'student' ? '👤' : '🏢'}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDesc}>{role.desc}</Text>
            </View>
            <View style={[styles.radioOuter, selected === role.id && { borderColor: role.color }]}>
              {selected === role.id && <View style={[styles.radioInner, { backgroundColor: role.color }]} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.flex} />
        <PrimaryButton
          label={`Continue as ${selectedRole?.title}`}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Import Sprint 2 Screens ────────────────────────────────
import {
  StudentListScreen,
  AddEditStudentScreen,
  CSVImportScreen,
  RoomDashboardScreen,
  AddRoomScreen,
  AllocateRoomScreen,
} from './Sprint2_Admin_Screens';

import {
  MyRoomScreen,
  RoomDetailScreen,
  HostelRulesScreen,
  BlockInfoScreen,
} from './Sprint2_Student_Screens';

import {
  MyFeesScreen,
  PayFeeScreen,
  PaymentSuccessScreen,
  NotificationsScreen,
} from './Sprint3_Student_Fee_Screens';

import {
  FeeDashboardScreen,
  FeeStructureScreen,
  GenerateInvoicesScreen,
  MarkPaymentScreen,
  PaymentHistoryScreen,
} from './Sprint3_Admin_Fee_Screens';

import {
  RaiseComplaintScreen,
  MyComplaintsScreen,
  ApplyGatePassScreen,
  MyGatePassesScreen,
  LateReturnAlertScreen,
} from './Sprint4_Student_Complaints_GatePass';

import {
  ComplaintListScreen,
  ComplaintDetailScreen,
  AssignComplaintScreen,
  GatePassListScreen,
  ReviewGatePassScreen,
} from './Sprint4_Admin_Complaints_GatePass';

import {
  NoticeListScreen,
  NoticeDetailScreen,
  CreateNoticeScreen,
  ManageNoticesScreen,
} from './Sprint5_Notice_Board';

import {
  AdminDashboardScreen,
  ActivityFeedScreen,
} from './Sprint5_Admin_Dashboard';

// ─── Navigation Root ─────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Sprint 1: Auth */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Role" component={RoleScreen} />

        {/* Sprint 2: Student Screens */}
        <Stack.Screen name="MyRoom" component={MyRoomScreen} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="HostelRules" component={HostelRulesScreen} />
        <Stack.Screen name="BlockInfo" component={BlockInfoScreen} />

        {/* Sprint 2: Admin Screens */}
        <Stack.Screen name="StudentList" component={StudentListScreen} />
        <Stack.Screen name="AddEditStudent" component={AddEditStudentScreen} />
        <Stack.Screen name="CSVImport" component={CSVImportScreen} />
        <Stack.Screen name="RoomDashboard" component={RoomDashboardScreen} />
        <Stack.Screen name="AddRoom" component={AddRoomScreen} />
        <Stack.Screen name="AllocateRoom" component={AllocateRoomScreen} />

        {/* Sprint 3: Student Fee Screens */}
        <Stack.Screen name="MyFees" component={MyFeesScreen} />
        <Stack.Screen name="PayFee" component={PayFeeScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* Sprint 3: Admin Fee Screens */}
        <Stack.Screen name="FeeDashboard" component={FeeDashboardScreen} />
        <Stack.Screen name="FeeStructure" component={FeeStructureScreen} />
        <Stack.Screen name="GenerateInvoices" component={GenerateInvoicesScreen} />
        <Stack.Screen name="MarkPayment" component={MarkPaymentScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />

        {/* Sprint 4: Student Complaints & Gate Pass */}
        <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
        <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} />
        <Stack.Screen name="ApplyGatePass" component={ApplyGatePassScreen} />
        <Stack.Screen name="MyGatePasses" component={MyGatePassesScreen} />
        <Stack.Screen name="LateReturnAlert" component={LateReturnAlertScreen} />

        {/* Sprint 4: Admin Complaints & Gate Pass */}
        <Stack.Screen name="ComplaintList" component={ComplaintListScreen} />
        <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
        <Stack.Screen name="AssignComplaint" component={AssignComplaintScreen} />
        <Stack.Screen name="GatePassList" component={GatePassListScreen} />
        <Stack.Screen name="ReviewGatePass" component={ReviewGatePassScreen} />

        {/* Sprint 5: Notice Board */}
        <Stack.Screen name="NoticeList" component={NoticeListScreen} />
        <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
        <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
        <Stack.Screen name="ManageNotices" component={ManageNoticesScreen} />

        {/* Sprint 5: Admin Dashboard */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="ActivityFeed" component={ActivityFeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: COLORS.bg },

  // Logo
  logoMark: { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoInner: { borderWidth: 2.5, borderColor: '#fff' },

  // Splash
  splashCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  appTitle: { fontSize: 26, fontWeight: '500', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  appTagline: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
  splashButtons: { paddingHorizontal: 24, paddingBottom: 32 },
  versionText: { fontSize: 11, color: COLORS.textHint, textAlign: 'center', marginTop: 16 },

  // Form layout
  formContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  screenTitle: { fontSize: 20, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  screenSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 20 },

  // Step dots
  dotsRow: { flexDirection: 'row', marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border, marginHorizontal: 2.5 },
  dotActive: { width: 18, backgroundColor: COLORS.primary, marginHorizontal: 2.5 },

  // Fields
  fieldLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 5 },
  input: {
    height: 44, borderRadius: 10, borderWidth: 0.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surface, paddingHorizontal: 12,
    fontSize: 14, color: COLORS.text, marginBottom: 14,
  },
  forgotText: { fontSize: 12, color: COLORS.primary, textAlign: 'right', marginTop: -6, marginBottom: 16 },
  errorText: { fontSize: 12, color: COLORS.danger, marginBottom: 10 },

  // Buttons
  btnPrimary: { height: 46, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  btnPrimaryText: { fontSize: 15, fontWeight: '500', color: '#fff' },
  btnDisabled: { opacity: 0.5 },
  btnSecondary: { height: 44, borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnSecondaryText: { fontSize: 13, color: COLORS.textMuted },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textHint, marginHorizontal: 10 },

  registerHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 20 },
  linkText: { color: COLORS.primary, fontWeight: '500' },

  // OTP
  otpLabel: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: 4 },
  otpEmail: { fontSize: 14, fontWeight: '500', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 24 },
  otpBox: {
    width: 42, height: 48, borderRadius: 10, borderWidth: 0.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surface, textAlign: 'center', fontSize: 20, fontWeight: '500', color: COLORS.text,
    marginHorizontal: 4,
  },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight, color: COLORS.primaryDark },
  resendRow: { alignItems: 'center', marginTop: 16 },
  resendText: { fontSize: 12, color: COLORS.textMuted },
  infoBox: { marginTop: 24, backgroundColor: COLORS.surface, borderRadius: 10, padding: 12 },
  infoText: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },

  // Back row
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 14, color: COLORS.textMuted },

  // Role cards
  roleCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  roleIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  roleTitle: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 2 },
  roleDesc: { fontSize: 11, color: COLORS.textMuted },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 9, height: 9, borderRadius: 5 },
});
