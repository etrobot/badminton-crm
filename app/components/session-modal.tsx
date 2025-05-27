import React, { useEffect, useState } from 'react';
import { BadmintonSession } from '~/types/session';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSession: BadmintonSession | null;
  onSubmit: (session: BadmintonSession) => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  editingSession,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BadmintonSession>({
    id: '',
    title: '',
    coach: '',
    dateTime: '',
    sessionType: '开放式团课', // Default to '开放式团课'
    equipment: [], // equipment is an array of strings
    clientType: '成人', // Default to '成人'
    courtName: '',
    courtNumber: '',
    clients: [], // Initialize with an empty array for clients
 totalClients: 0,
  });

  useEffect(() => {
    if (editingSession) {
      setFormData(editingSession);
    } else {
      setFormData({
        id: '',
        title: '',
        coach: '',
        dateTime: '', // Use an empty string for initial state
        sessionType: '开放式团课', // Default to '开放式团课'
        equipment: [], // equipment is an array of strings
 clientType: '成人',
        courtName: '',
        courtNumber: '',
 clients: [], // Initialize with an empty array for clients
 totalClients: 0,
      });
    }
  }, [editingSession]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === 'totalClients'
          ? parseInt(value, 10) || 0
          : name === 'equipment'
          ? value.split(',').map((item) => item.trim()) // Assuming comma-separated string input for equipment
          : name === 'clientType'
          ? value === '成人' || value === '青少年'
            ? value
            : prevData.clientType // Keep previous value if invalid
          : name === 'sessionType'
          ? ['一对一', '一对二', '一对多', '夏令营', '开放式团课'].includes(value as any) ? value as any : prevData.sessionType
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {editingSession ? 'Edit Session' : 'Add New Session'}
        </h3>
        <div className="mt-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="coach" className="block text-sm font-medium text-gray-700">Coach</label>
              <input
                type="text"
                name="coach"
                id="coach"
                value={formData.coach}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Date and Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                id="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">Session Type</label>
              <select
                name="sessionType"
                id="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="一对一">一对一</option>
                <option value="一对二">一对二</option>
                <option value="一对多">一对多</option>
                <option value="开放式团课">开放式团课</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Equipment</label>
              <input
                type="text"
                name="equipment"
                id="equipment"
                value={formData.equipment.join(', ')} // Display as comma-separated string
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="clientType" className="block text-sm font-medium text-gray-700">Client Type</label>
              <select
                name="clientType"
                id="clientType"
                value={formData.clientType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="成人">成人</option>
                <option value="青少年">青少年</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="courtName" className="block text-sm font-medium text-gray-700">Court Name</label>
              <input
                type="text"
                name="courtName"
                id="courtName"
                value={formData.courtName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courtNumber" className="block text-sm font-medium text-gray-700">Court Number</label>
              <input
                type="text"
                name="courtNumber"
                id="courtNumber"
                value={formData.courtNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalClients" className="block text-sm font-medium text-gray-700">Total Clients</label>
              <input
                type="number"
                name="totalClients"
                id="totalClients"
                value={formData.totalClients}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="items-center px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {editingSession ? 'Save Changes' : 'Add Session'}
              </button>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;