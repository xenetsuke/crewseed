import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useDispatch } from "react-redux";
import { removeUser } from "features/UserSlice";


const AccountManagementTab = ({ onLogout, onDeleteAccount }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

    const dispatch = useDispatch();
  
const handleLogout = () => {
    // Logout logic
    dispatch(removeUser());
    console.log("Logging out...");
  };
  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const confirmDelete = () => {
    onDeleteAccount();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Security Options */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Lock" size={20} />
          Security Options
        </h3>
        
        <div className="space-y-3">
          <button className="w-full p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Key" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
          </button>

          <button className="w-full p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Shield" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Not Enabled</span>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </div>
          </button>

          <button className="w-full p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Smartphone" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Login Activity</p>
                <p className="text-sm text-muted-foreground">View recent login sessions</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Data Management
        </h3>
        
        <div className="space-y-3">
          <button className="w-full p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Icon name="Download" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Download My Data</p>
                <p className="text-sm text-muted-foreground">Export your profile and work history</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
          </button>

          <button className="w-full p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Icon name="Share2" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">Share Profile</p>
                <p className="text-sm text-muted-foreground">Generate shareable profile link</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Account Actions
        </h3>
        
        <div className="space-y-3">
          {/* Logout Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            iconName="LogOut"
            iconPosition="left"
          >
            Logout from Account
          </Button>

          {/* Delete Account */}
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleDeleteAccountClick}
              className="text-sm text-red-600 hover:underline flex items-center gap-2"
            >
              <Icon name="Trash2" size={16} />
              Delete My Account
            </button>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently remove your account and all associated data
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Icon name="AlertCircle" size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="p-3 bg-red-50 rounded-lg mb-6">
              <p className="text-sm text-red-700">
                ⚠️ You will lose:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                <li>All profile information</li>
                <li>Work history and ratings</li>
                <li>Document uploads</li>
                <li>Job applications</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagementTab;