import React from 'react';
import { Modal } from './Modal';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userData
}) => {
  if (!userData) return null;

  const details = [
    { label: 'Employee Id', value: userData.employeeId },
    { label: 'Employee Name', value: `${userData.firstName} ${userData.lastName}` },
    { label: 'First Name', value: userData.firstName },
    { label: 'Last Name', value: userData.lastName }, 
    { label: 'Email', value: userData.email },
    { label: 'Contact Number', value: userData.phoneNo },
    { label: 'Valid From', value: userData.validFrom },
    { label: 'Valid To', value: userData.validTo },
    { label: 'Created By', value: userData.createdBy },
    { label: 'Modified By', value: userData.modifiedBy },
    { label: 'Role Name', value: userData.role },

  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`User Details(${userData.firstName} ${userData.lastName})`}
    >
      <div className="p-4 h-[70vh] overflow-auto">
        <div className="grid gap-2">
          {details.map((detail, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-semibold">{detail.label}</div>
              <div>{detail.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}; 