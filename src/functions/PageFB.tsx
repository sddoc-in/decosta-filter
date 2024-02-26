import React from 'react';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PageFB: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
  const PreviousPage = () => {
    onPageChange(currentPage - 1);
  };

  const NextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-end absolute right-7 px-5 mx-3">
      <button
        className={`px-4 py-2 mr-2 text-[16px]  ${
          currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'
        } rounded-md`}
        onClick={PreviousPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <button
        className={`px-4 py-2 ml-2 text-[16px] ${
          currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'
        } rounded-md`}
        onClick={NextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PageFB;
