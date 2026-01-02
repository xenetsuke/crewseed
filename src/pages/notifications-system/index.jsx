import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Calendar, Settings, Clock, AlertCircle, CheckCircle, Users, IndianRupee, Send, History, Filter, Search } from 'lucide-react';
import EmployerSidebar from '../../components/navigation/EmployerSidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const NotificationsSystem = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    email: {
      applications: true,
      workerUpdates: true,
      systemAlerts: true,
      wageNotifications: true,
      attendanceReminders: true,
      festivalAlerts: false
    },
    sms: {
      applications: true,
      workerUpdates: false,
      systemAlerts: true,
      wageNotifications: true,
      attendanceReminders: true,
      festivalAlerts: false
    },
    whatsapp: {
      applications: false,
      workerUpdates: true,
      systemAlerts: false,
      wageNotifications: true,
      attendanceReminders: true,
      festivalAlerts: true
    }
  });

  // Regional language preferences
  const [languageSettings, setLanguageSettings] = useState({
    primaryLanguage: 'english',
    secondaryLanguage: 'hindi',
    workerCommunication: 'bilingual'
  });

  // Notification timing preferences
  const [timingPreferences, setTimingPreferences] = useState({
    dailyDigestTime: '09:00',
    weeklyReportDay: 'monday',
    urgentAlertsEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  // Mock notification history data
  const notificationHistory = [
    {
      id: 1,
      type: 'application',
      icon: Users,
      title: '5 नए आवेदन प्राप्त हुए',
      titleEn: '5 New Applications Received',
      description: 'पीथमपुर गोदाम के लिए लोडर पद',
      descriptionEn: 'For Loader position at Pithampur Warehouse',
      timestamp: '10 मिनट पहले',
      timestampEn: '10 min ago',
      status: 'unread',
      priority: 'high',
      channel: ['email', 'whatsapp'],
      deliveryStatus: 'delivered'
    },
    {
      id: 2,
      type: 'wage',
      icon: IndianRupee,
      title: 'वेतन भुगतान पुष्टिकरण',
      titleEn: 'Wage Payment Confirmation',
      description: '30 कर्मचारियों को ₹45,000 का भुगतान सफल',
      descriptionEn: 'Payment of ₹45,000 to 30 workers successful',
      timestamp: '2 घंटे पहले',
      timestampEn: '2 hours ago',
      status: 'read',
      priority: 'medium',
      channel: ['email', 'sms', 'whatsapp'],
      deliveryStatus: 'delivered'
    },
    {
      id: 3,
      type: 'attendance',
      icon: CheckCircle,
      title: 'उपस्थिति अनुस्मारक',
      titleEn: 'Attendance Reminder',
      description: 'आज की उपस्थिति अभी तक अपडेट नहीं की गई',
      descriptionEn: "Today\'s attendance not yet updated",
      timestamp: '5 घंटे पहले',
      timestampEn: '5 hours ago',
      status: 'read',
      priority: 'high',
      channel: ['sms'],
      deliveryStatus: 'delivered'
    },
    {
      id: 4,
      type: 'festival',
      icon: Calendar,
      title: 'त्योहार अवकाश अनुस्मारक',
      titleEn: 'Festival Holiday Reminder',
      description: 'दिवाली 12 नवंबर को - शिफ्ट शेड्यूल समायोजित करें',
      descriptionEn: 'Diwali on 12th Nov - Adjust shift schedules',
      timestamp: '1 दिन पहले',
      timestampEn: '1 day ago',
      status: 'read',
      priority: 'low',
      channel: ['email', 'whatsapp'],
      deliveryStatus: 'delivered'
    },
    {
      id: 5,
      type: 'system',
      icon: AlertCircle,
      title: 'सिस्टम रखरखाव सूचना',
      titleEn: 'System Maintenance Notice',
      description: 'रात 2 बजे से 4 बजे तक अनुसूचित रखरखाव',
      descriptionEn: 'Scheduled maintenance from 2 AM to 4 AM',
      timestamp: '2 दिन पहले',
      timestampEn: '2 days ago',
      status: 'read',
      priority: 'low',
      channel: ['email'],
      deliveryStatus: 'delivered'
    }
  ];

  // Notification templates
  const templates = [
    {
      id: 1,
      name: 'Assignment Confirmation',
      nameHi: 'कार्य पुष्टिकरण',
      category: 'assignment',
      channels: ['sms', 'whatsapp'],
      preview: 'नमस्ते {worker_name}, आपको {location} में {role} के रूप में सौंपा गया है। शिफ्ट: {shift_time}। सफलता की कामना!'
    },
    {
      id: 2,
      name: 'Wage Payment Notification',
      nameHi: 'वेतन भुगतान सूचना',
      category: 'wage',
      channels: ['sms', 'whatsapp', 'email'],
      preview: 'प्रिय {worker_name}, ₹{amount} का भुगतान {date} को आपके खाते में जमा किया गया है। UPI Ref: {ref_no}'
    },
    {
      id: 3,
      name: 'Daily Attendance Reminder',
      nameHi: 'दैनिक उपस्थिति अनुस्मारक',
      category: 'attendance',
      channels: ['whatsapp'],
      preview: 'शुभ प्रभात! कृपया आज {date} की उपस्थिति {time} तक दर्ज करें। धन्यवाद!'
    },
    {
      id: 4,
      name: 'Worker Onboarding',
      nameHi: 'कर्मचारी ऑनबोर्डिंग',
      category: 'onboarding',
      channels: ['email', 'whatsapp'],
      preview: 'स्वागत है {worker_name}! {company_name} में आपका स्वागत है। रिपोर्टिंग: {date}, {time} पर {location}। दस्तावेज़: {documents}'
    }
  ];

  const handlePreferenceChange = (channel, type) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev?.[channel],
        [type]: !prev?.[channel]?.[type]
      }
    }));
  };

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Notification Channels Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">अधिसूचना चैनल प्राथमिकताएं / Notification Channel Preferences</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Notification Type</th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>SMS</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span>WhatsApp</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">Application Alerts</div>
                    <div className="text-sm text-gray-500">New worker applications</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.applications}
                    onChange={() => handlePreferenceChange('email', 'applications')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.applications}
                    onChange={() => handlePreferenceChange('sms', 'applications')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.applications}
                    onChange={() => handlePreferenceChange('whatsapp', 'applications')}
                  />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">Worker Updates</div>
                    <div className="text-sm text-gray-500">Status changes & confirmations</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.workerUpdates}
                    onChange={() => handlePreferenceChange('email', 'workerUpdates')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.workerUpdates}
                    onChange={() => handlePreferenceChange('sms', 'workerUpdates')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.workerUpdates}
                    onChange={() => handlePreferenceChange('whatsapp', 'workerUpdates')}
                  />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">Wage Notifications</div>
                    <div className="text-sm text-gray-500">वेतन भुगतान और अनुस्मारक</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.wageNotifications}
                    onChange={() => handlePreferenceChange('email', 'wageNotifications')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.wageNotifications}
                    onChange={() => handlePreferenceChange('sms', 'wageNotifications')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.wageNotifications}
                    onChange={() => handlePreferenceChange('whatsapp', 'wageNotifications')}
                  />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">Attendance Reminders</div>
                    <div className="text-sm text-gray-500">उपस्थिति दर्ज करने की याद दिलाता है</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.attendanceReminders}
                    onChange={() => handlePreferenceChange('email', 'attendanceReminders')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.attendanceReminders}
                    onChange={() => handlePreferenceChange('sms', 'attendanceReminders')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.attendanceReminders}
                    onChange={() => handlePreferenceChange('whatsapp', 'attendanceReminders')}
                  />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">Festival & Holiday Alerts</div>
                    <div className="text-sm text-gray-500">त्योहार और छुट्टी की सूचनाएं</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.festivalAlerts}
                    onChange={() => handlePreferenceChange('email', 'festivalAlerts')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.festivalAlerts}
                    onChange={() => handlePreferenceChange('sms', 'festivalAlerts')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.festivalAlerts}
                    onChange={() => handlePreferenceChange('whatsapp', 'festivalAlerts')}
                  />
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">System Alerts</div>
                    <div className="text-sm text-gray-500">System updates & maintenance</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.email?.systemAlerts}
                    onChange={() => handlePreferenceChange('email', 'systemAlerts')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.sms?.systemAlerts}
                    onChange={() => handlePreferenceChange('sms', 'systemAlerts')}
                  />
                </td>
                <td className="text-center py-3 px-4">
                  <Checkbox
                    checked={preferences?.whatsapp?.systemAlerts}
                    onChange={() => handlePreferenceChange('whatsapp', 'systemAlerts')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">भाषा प्राथमिकताएं / Language Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Language</label>
            <Select
              value={languageSettings?.primaryLanguage}
              onChange={(e) => setLanguageSettings({...languageSettings, primaryLanguage: e?.target?.value})}
              options={[
                { value: 'english', label: 'English' },
                { value: 'hindi', label: 'हिंदी (Hindi)' },
                { value: 'marathi', label: 'मराठी (Marathi)' },
                { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
                { value: 'tamil', label: 'தமிழ் (Tamil)' },
                { value: 'telugu', label: 'తెలుగు (Telugu)' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary Language</label>
            <Select
              value={languageSettings?.secondaryLanguage}
              onChange={(e) => setLanguageSettings({...languageSettings, secondaryLanguage: e?.target?.value})}
              options={[
                { value: 'none', label: 'None' },
                { value: 'english', label: 'English' },
                { value: 'hindi', label: 'हिंदी (Hindi)' },
                { value: 'marathi', label: 'मराठी (Marathi)' },
                { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Worker Communication</label>
            <Select
              value={languageSettings?.workerCommunication}
              onChange={(e) => setLanguageSettings({...languageSettings, workerCommunication: e?.target?.value})}
              options={[
                { value: 'bilingual', label: 'Bilingual (Recommended)' },
                { value: 'primary', label: 'Primary Language Only' },
                { value: 'regional', label: 'Regional Language Auto-detect' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Timing Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">समय प्राथमिकताएं / Timing Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Daily Digest Time</label>
            <Input
              type="time"
              value={timingPreferences?.dailyDigestTime}
              onChange={(e) => setTimingPreferences({...timingPreferences, dailyDigestTime: e?.target?.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weekly Report Day</label>
            <Select
              value={timingPreferences?.weeklyReportDay}
              onChange={(e) => setTimingPreferences({...timingPreferences, weeklyReportDay: e?.target?.value})}
              options={[
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
                { value: 'sunday', label: 'Sunday' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quiet Hours Start</label>
            <Input
              type="time"
              value={timingPreferences?.quietHoursStart}
              onChange={(e) => setTimingPreferences({...timingPreferences, quietHoursStart: e?.target?.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quiet Hours End</label>
            <Input
              type="time"
              value={timingPreferences?.quietHoursEnd}
              onChange={(e) => setTimingPreferences({...timingPreferences, quietHoursEnd: e?.target?.value})}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={timingPreferences?.urgentAlertsEnabled}
              onChange={(e) => setTimingPreferences({...timingPreferences, urgentAlertsEnabled: e?.target?.checked})}
            />
            <span className="text-sm">Enable urgent alerts during quiet hours</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e?.target?.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'application', label: 'Applications' },
                { value: 'wage', label: 'Wage Payments' },
                { value: 'attendance', label: 'Attendance' },
                { value: 'festival', label: 'Festivals' },
                { value: 'system', label: 'System' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Notification History List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y">
        {notificationHistory?.map((notification) => {
          const IconComponent = notification?.icon;
          return (
            <div key={notification?.id} className={`p-4 hover:bg-gray-50 transition-colors ${notification?.status === 'unread' ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  notification?.priority === 'high' ? 'bg-red-100' :
                  notification?.priority === 'medium'? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    notification?.priority === 'high' ? 'text-red-600' :
                    notification?.priority === 'medium'? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification?.titleEn}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">{notification?.title}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notification?.timestampEn}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{notification?.descriptionEn}</p>
                  <p className="text-sm text-gray-600 mb-3">{notification?.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {notification?.channel?.map((channel) => (
                        <span key={channel} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                          {channel === 'sms' && <MessageSquare className="w-3 h-3 mr-1" />}
                          {channel === 'whatsapp' && <MessageSquare className="w-3 h-3 mr-1 text-green-600" />}
                          {channel}
                        </span>
                      ))}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      notification?.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      notification?.deliveryStatus === 'pending'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {notification?.deliveryStatus === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {notification?.deliveryStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">अधिसूचना टेम्पलेट / Notification Templates</h3>
          <Button size="sm">
            <Send className="w-4 h-4 mr-2" />
            Create New Template
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Customize notification messages for common scenarios. Templates support bilingual content for better worker communication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates?.map((template) => (
          <div key={template?.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{template?.name}</h4>
                <p className="text-sm text-gray-600">{template?.nameHi}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                {template?.category}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 font-mono">{template?.preview}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {template?.channels?.map((channel) => (
                  <span key={channel} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                    {channel === 'sms' && <MessageSquare className="w-3 h-3 mr-1" />}
                    {channel === 'whatsapp' && <MessageSquare className="w-3 h-3 mr-1 text-green-600" />}
                    {channel}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Test</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <EmployerSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">सूचना प्रबंधन / Notifications System</h1>
                <p className="text-muted-foreground">Manage communication preferences and notification settings</p>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Notifications</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold">21</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">WhatsApp Active</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'preferences' ?'border-b-2 border-primary text-primary' :'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Preferences
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'history' ?'border-b-2 border-primary text-primary' :'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <History className="w-4 h-4 inline mr-2" />
                  History
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'templates' ?'border-b-2 border-primary text-primary' :'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Templates
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'preferences' && renderPreferencesTab()}
              {activeTab === 'history' && renderHistoryTab()}
              {activeTab === 'templates' && renderTemplatesTab()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsSystem;