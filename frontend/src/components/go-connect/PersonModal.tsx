import { createPortal } from 'react-dom';
import { Person } from '@src/gen/person_pb';

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  personDetails: Person | null;
  loading: boolean;
  error: string | null;
}

function PersonModal({ isOpen, onClose, personDetails, loading, error }: PersonModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-[9999]"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-primary">Person Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {personDetails && !loading && !error && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p className="mt-1">{personDetails.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{personDetails.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{personDetails.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Age</p>
              <p className="mt-1">{personDetails.age}</p>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-secondary hover:bg-secondary-hover text-black font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default PersonModal;
