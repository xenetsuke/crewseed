import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Filter, Download, RefreshCw, Phone, MessageCircle, 
    MapPin, Calendar, IndianRupee, TrendingUp, TrendingDown,
    Users, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight,
    MoreVertical, Eye
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const WorkerAssignmentTracking = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [expandedCard, setExpandedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data
    const [assignments, setAssignments] = useState([
        {
            id: 1,
            workerName: 'Ravi Kumar',
            workerPhone: '+91 98765 43210',
            projectName: 'Warehouse Expansion - Phase 2',
            projectType: 'Construction',
            location: 'Pithampur, Madhya Pradesh',
            startDate: '2025-11-15',
            role: 'Mason',
            dailyWage: 650,
            status: 'active',
            attendance: 23,
            totalDays: 25,
            performanceScore: 92,
            lastUpdate: '2025-12-03'
        },
        {
            id: 2,
            workerName: 'Sunita Devi',
            workerPhone: '+91 87654 32109',
            projectName: 'Textile Factory Operations',
            projectType: 'Manufacturing',
            location: 'Surat, Gujarat',
            startDate: '2025-10-01',
            role: 'Machine Operator',
            dailyWage: 550,
            status: 'active',
            attendance: 58,
            totalDays: 60,
            performanceScore: 88,
            lastUpdate: '2025-12-03'
        },
        {
            id: 3,
            workerName: 'Anil Singh',
            workerPhone: '+91 76543 21098',
            projectName: 'Hotel Renovation',
            projectType: 'Hospitality',
            location: 'Jaipur, Rajasthan',
            startDate: '2025-11-20',
            role: 'Carpenter',
            dailyWage: 700,
            status: 'pending',
            attendance: 15,
            totalDays: 18,
            performanceScore: 85,
            lastUpdate: '2025-12-02'
        },
        {
            id: 4,
            workerName: 'Lakshmi Narayanan',
            workerPhone: '+91 65432 10987',
            projectName: 'Logistics Hub Setup',
            projectType: 'Logistics',
            location: 'Chennai, Tamil Nadu',
            startDate: '2025-09-15',
            role: 'Forklift Operator',
            dailyWage: 800,
            status: 'completed',
            attendance: 90,
            totalDays: 90,
            performanceScore: 95,
            lastUpdate: '2025-11-30'
        }
    ]);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'on-hold', label: 'On Hold' }
    ];

    const projectTypeOptions = [
        { value: 'all', label: 'All Projects' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Logistics', label: 'Logistics' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Agriculture', label: 'Agriculture' }
    ];

    const locationOptions = [
        { value: 'all', label: 'All Locations' },
        { value: 'Pithampur', label: 'Pithampur, MP' },
        { value: 'Surat', label: 'Surat, Gujarat' },
        { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
        { value: 'Chennai', label: 'Chennai, Tamil Nadu' }
    ];

    const filteredAssignments = assignments?.filter(assignment => {
        const matchesSearch = (assignment?.workerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                             assignment?.projectName?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
        const matchesStatus = selectedStatus === 'all' || assignment?.status === selectedStatus;
        const matchesProject = selectedProject === 'all' || assignment?.projectType === selectedProject;
        const matchesLocation = selectedLocation === 'all' || assignment?.location?.includes(selectedLocation);
        
        return matchesSearch && matchesStatus && matchesProject && matchesLocation;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Pending' },
            completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Completed' },
            'on-hold': { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'On Hold' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
            <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.color)}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const calculateTotalWages = (assignment) => (assignment?.dailyWage || 0) * (assignment?.attendance || 0);

    const getAttendancePercentage = (assignment) => {
        if (!assignment?.totalDays) return 0;
        return ((assignment.attendance / assignment.totalDays) * 100).toFixed(1);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleCallWorker = (phone) => { window.location.href = `tel:${phone}`; };

    const handleWhatsAppWorker = (phone) => {
        const formattedPhone = phone?.replace(/\s+/g, '')?.replace('+', '');
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const stats = {
        totalAssignments: assignments?.length,
        activeAssignments: assignments?.filter(a => a?.status === 'active')?.length,
        completedToday: 3,
        totalWages: assignments?.reduce((sum, a) => sum + calculateTotalWages(a), 0)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Worker Assignment Tracking</h1>
                            <p className="text-gray-600 mt-1">Monitor active assignments and worker progress</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* FIX: Passed component reference instead of string */}
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                loading={isLoading}
                                icon={RefreshCw} 
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                icon={Download}
                            >
                                Export
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Total Assignments</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalAssignments}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Active Today</p>
                                    <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeAssignments}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Completed Today</p>
                                    <p className="text-2xl font-bold text-purple-900 mt-1">{stats.completedToday}</p>
                                </div>
                                <Clock className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 font-medium">Total Wages</p>
                                    <p className="text-2xl font-bold text-orange-900 mt-1 flex items-center">
                                        <IndianRupee className="w-5 h-5" />
                                        {stats.totalWages?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <IndianRupee className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                            <Input
                                placeholder="Search workers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            placeholder="Status"
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                        />

                        <Select
                            placeholder="Project"
                            options={projectTypeOptions}
                            value={selectedProject}
                            onChange={(value) => setSelectedProject(value)}
                        />

                        <Select
                            placeholder="Location"
                            options={locationOptions}
                            value={selectedLocation}
                            onChange={(value) => setSelectedLocation(value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredAssignments?.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                        </div>
                    ) : (
                        filteredAssignments.map((assignment) => (
                            <div key={assignment.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{assignment.workerName}</h3>
                                                {getStatusBadge(assignment.status)}
                                            </div>
                                            <p className="text-gray-600 font-medium">{assignment.projectName}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {assignment.location}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Started: {new Date(assignment.startDate).toLocaleDateString('en-IN')}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setExpandedCard(expandedCard === assignment.id ? null : assignment.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Role</p>
                                            <p className="font-semibold text-gray-900">{assignment.role}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Daily Wage</p>
                                            <p className="font-semibold text-gray-900 flex items-center"><IndianRupee className="w-4 h-4" />{assignment.dailyWage}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Attendance</p>
                                            <p className="font-semibold text-gray-900">{assignment.attendance}/{assignment.totalDays} days</p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${getAttendancePercentage(assignment)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Performance</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900">{assignment.performanceScore}%</p>
                                                {assignment.performanceScore >= 90 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-orange-600" />}
                                            </div>
                                        </div>
                                    </div>

                                    {expandedCard === assignment.id && (
                                        <div className="mt-4 pt-4 border-t animate-in fade-in duration-300">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Total Wages Paid</p>
                                                    <p className="text-lg font-bold text-gray-900 flex items-center"><IndianRupee className="w-5 h-5" />{calculateTotalWages(assignment).toLocaleString('en-IN')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                                                    <p className="text-lg font-bold text-gray-900">{new Date(assignment.lastUpdate).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="outline" size="sm" onClick={() => handleCallWorker(assignment.workerPhone)} icon={Phone}>Call</Button>
                                                <Button variant="outline" size="sm" onClick={() => handleWhatsAppWorker(assignment.workerPhone)} icon={MessageCircle}>WhatsApp</Button>
                                                <Button variant="outline" size="sm" onClick={() => navigate(`/worker-profile?id=${assignment.id}`)} icon={Eye}>View Profile</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <span className="text-sm text-gray-600">Project: {assignment.projectType}</span>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setExpandedCard(expandedCard === assignment.id ? null : assignment.id)}
                                            icon={ChevronRight}
                                            iconPosition="right"
                                        >
                                            {expandedCard === assignment.id ? 'Show Less' : 'View Details'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerAssignmentTracking;