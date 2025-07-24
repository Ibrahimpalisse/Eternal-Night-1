import React from 'react';
import Pagination from '../admin/table/Pagination';

export default function MembersPagination({ totalPages, currentPage, setCurrentPage, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 