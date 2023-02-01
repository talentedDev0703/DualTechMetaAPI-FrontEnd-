import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagenation';
import './pagenation.scss';
const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage =  Math.ceil(totalCount / pageSize);//paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
       <li
        className={classnames('pagination-item-1', {
          disabled: currentPage === 1
        })}
        onClick={() => onPageChange(1)}
      > <span className='text-previous'>&ensp; First </span></li>
      <li
        className={classnames('pagination-item-1', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
        <span className='text-previous'>&ensp; Previous </span>
      </li>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li key={pageNumber}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames('pagination-item-1', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <span className='text-previous'>Next &ensp;</span>
        <div className="arrow right" />
        
      </li>
      <li
        className={classnames('pagination-item-1', {
          disabled: currentPage === lastPage
        })}
        onClick={() => {onPageChange(lastPage);console.log(lastPage)}}
      > <span className='text-previous'> Last </span></li>
    </ul>
  );
};

export default Pagination;
