import React, { useState } from 'react';

interface SearchComponentProps {
  onSearch: (startDate: Date, endDate: Date) => void;
}

const Searchbar: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const handleSearch = () => {
    if (filterStartDate && filterEndDate) {
      onSearch(filterStartDate, filterEndDate);
    } else {
      alert('Please select both start and end dates.');
    }
  };

  return (
    <div className="flex justify-end  position-absolute right-7 px-5">
      <div className="flex flex-row space-x-4">
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold">Start Date</label>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={filterStartDate ? filterStartDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFilterStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold">End Date</label>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={filterEndDate ? filterEndDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFilterEndDate(new Date(e.target.value))}
          />
        </div>
        <button
          className="px-3 py-2 h-10 mt-4 text-[16px] font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
