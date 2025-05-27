import React, { useState, ReactNode } from 'react';
import { BadmintonSession } from '~/types/session';
import SessionModal from "~/components/session-modal"

interface SessionManagementProps {
  initialSessions: BadmintonSession[];
  children: (handleEditSession: (session: BadmintonSession) => void) => ReactNode;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ initialSessions, children }) => {
  const [sessions, setSessions] = useState<BadmintonSession[]>(initialSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<BadmintonSession | null>(null);

  const handleEditSession = (session: BadmintonSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  const handleUpdateSession = (updatedSession: BadmintonSession) => {
    setSessions(sessions.map(s => (s.id === updatedSession.id ? updatedSession : s)));
    handleCloseModal();
  };

  return (
    <>
      {children(handleEditSession)}

      {isModalOpen && editingSession && (
        // Assuming you have a SessionModal component
        <SessionModal
          isOpen={isModalOpen}
          editingSession={editingSession}
          onClose={handleCloseModal}
          onSubmit={handleUpdateSession}
        />
      )}
    </>
  );
};

export default SessionManagement;