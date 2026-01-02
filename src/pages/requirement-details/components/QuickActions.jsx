import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActions = ({ onSendMessage }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({
    template: '',
    subject: '',
    message: '',
  });

  const messageTemplates = [
    { value: 'interview', label: 'Interview Invitation' },
    { value: 'rejection', label: 'Application Rejection' },
    { value: 'shortlist', label: 'Shortlist Notification' },
    { value: 'custom', label: 'Custom Message' },
  ];

  const templateContent = {
    interview: {
      subject: 'Interview Invitation - BlueCollar Opportunity',
      message: `Dear Candidate,\n\nWe are impressed with your profile and would like to invite you for an interview.\n\nDetails:\nDate: [Date]\nTime: [Time]\nLocation: [Full Address]\n\nPlease bring your ID proof and bank details. Confirm if you can attend.\n\nBest regards,\n[Company Name]`,
    },
    rejection: {
      subject: 'Update on your Application',
      message: `Dear Candidate,\n\nThank you for applying. At this time, we have decided to move forward with other candidates whose experience more closely matches our current site requirements.\n\nWe will keep your profile in our database for future openings.\n\nBest regards,\n[Company Name]`,
    },
    shortlist: {
      subject: 'Good News: You are Shortlisted!',
      message: `Dear Candidate,\n\nYour application has been shortlisted. Our hiring team will call you shortly to discuss the next steps and joining date.\n\nBest regards,\n[Company Name]`,
    },
    custom: {
      subject: '',
      message: '',
    }
  };

  const handleTemplateChange = (template) => {
    setMessageData({
      template,
      subject: templateContent?.[template]?.subject || '',
      message: templateContent?.[template]?.message || '',
    });
  };

  const handleSendMessage = () => {
    if (!messageData.subject || !messageData.message) {
      alert("Please fill in both subject and message.");
      return;
    }
    if (onSendMessage) {
      onSendMessage(messageData);
    }
    setShowMessageModal(false);
    setMessageData({ template: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="card p-6 bg-white border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-amber-500" />
          Quick Actions
        </h2>

        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            className="justify-start border-slate-200 text-slate-700 hover:bg-slate-50"
            iconName="Mail"
            iconPosition="left"
            onClick={() => setShowMessageModal(true)}
          >
            Message Candidates
          </Button>

          <Button
            variant="outline"
            fullWidth
            className="justify-start border-slate-200 text-slate-700 hover:bg-slate-50"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log("Exporting...")}
          >
            Export Applicants (CSV)
          </Button>

          <Button
            variant="outline"
            fullWidth
            className="justify-start border-slate-200 text-slate-700 hover:bg-slate-50"
            iconName="Share2"
            iconPosition="left"
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }}
          >
            Share Posting Link
          </Button>

          <Button
            variant="outline"
            fullWidth
            className="justify-start border-slate-200 text-slate-700 hover:bg-slate-50"
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate Posting
          </Button>
        </div>

        {/* Pro Tip Section */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={18} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-tight">Recruiter Tip</h4>
              <p className="text-[11px] leading-relaxed text-blue-700 mt-1">
                Shortlisted candidates are 3x more likely to join if you message them within 24 hours of applying.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - SEND MESSAGE */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Broadcast Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <Select
                label="Choose a Template"
                options={messageTemplates}
                value={messageData?.template}
                onChange={handleTemplateChange}
                placeholder="Select pre-filled message..."
              />

              <Input
                label="Subject Line"
                type="text"
                placeholder="e.g. Interview scheduled for Monday"
                value={messageData?.subject}
                onChange={(e) => setMessageData({ ...messageData, subject: e?.target?.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Message Body
                </label>
                <textarea
                  value={messageData?.message}
                  onChange={(e) => setMessageData({ ...messageData, message: e?.target?.value })}
                  placeholder="Write your message here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 text-slate-800 bg-white transition-all resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
                  iconName="Send"
                  iconPosition="left"
                  onClick={handleSendMessage}
                >
                  Send to All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;