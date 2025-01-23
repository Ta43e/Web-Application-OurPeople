import { FC } from "react";
import { Button } from "@nextui-org/react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPages = () => {
    const pages: (string | number)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <Button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        style={{
          minWidth: '50px',
          textAlign: 'center',
        }}
      >
        ←
      </Button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
        {renderPages().map((page, index) => {
          const isEllipsis = typeof page === 'string';
          return isEllipsis ? (
            <span
              key={index}
              style={{
                padding: '0 10px',
                fontSize: '14px',
                color: 'gray',
                cursor: 'default',
              }}
            >
              {page}
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handlePageChange(Number(page))}
              style={{
                backgroundColor: Number(page) === currentPage ? 'blue' : 'white',
                color: Number(page) === currentPage ? 'white' : 'black',
                minWidth: '50px',
                textAlign: 'center',
              }}
              disabled={Number(page) === currentPage}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        style={{
          minWidth: '50px',
          textAlign: 'center',
        }}
      >
        →
      </Button>
    </div>
  );
};


export default Pagination;
