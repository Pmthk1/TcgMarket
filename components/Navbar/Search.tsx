"use client";

import { Input } from "../ui/input";
import { Search as SearchIcon } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-150" />
      <Input
        type="text"
        placeholder="Search Card..."
        spellCheck={false}  // ปิด spellcheck ที่นี่
        className="pl-10 w-full"
      />
    </div>
  );
};

export default SearchBar;
