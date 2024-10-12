import React, { useState, FormEvent } from "react";

// 定義 props 的類型
interface SearchListProps {
  onSearch: (searchTerm: string) => void;
}

const SearchList: React.FC<SearchListProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // handleSubmit 的事件類型改為 FormEvent<HTMLFormElement>
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm); // 無論點擊搜索還是按回車都會觸發提交
  };

  return (
    <form onSubmit={handleSubmit} id="search" className="mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Somethin'"
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchList;
