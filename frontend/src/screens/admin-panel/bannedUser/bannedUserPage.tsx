import { FC, memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useTypedSelector } from "../../../hooks/use-typed-selector";
import { filterSlice, getBannedUsers } from "../../../store/reducers/all/filter-slice";
import { BannedUserPageView } from "./bannedUserPage.view";

export const BannedUserPage: FC = memo(() => {
    const usersState = useTypedSelector(state => state.mainPage);
    const filterState = useTypedSelector(state => state.filter);
  
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(() => {
      const savedPage = localStorage.getItem('currentPage');
      return savedPage ? Number(savedPage) : 1;
    });
    const itemsPerPage = filterState.limit;
  
    const fetchUsers = useCallback(() => {
      dispatch(getBannedUsers(filterState));
    }, [dispatch, filterState]);
  
    useEffect(() => {
      const savedOffset = localStorage.getItem('currentOffset');
      if (savedOffset) {
        dispatch(filterSlice.actions.setOffsetAction(Number(savedOffset)));
      } else {
        fetchUsers();
      }
    }, [dispatch, fetchUsers]);
  
    useEffect(() => {
      fetchUsers();
    }, [fetchUsers, filterState.offset, filterState.limit]);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      const newOffset = (page - 1) * filterState.limit;
      localStorage.setItem('currentPage', page.toString());
      localStorage.setItem('currentOffset', newOffset.toString());
      dispatch(filterSlice.actions.setOffsetAction(newOffset));
    };
  
    if (usersState.error) {
      return <div>Error loading users: {usersState.error}</div>;
    }
  
    const getProfile = () => {
      navigate('/profile');
    };
  
    const paginatedUsers = usersState.usersList.slice(
      filterState.offset,
      filterState.offset + filterState.limit
    );
  
    const totalPages = Math.ceil(usersState.usersList.length / itemsPerPage);
    return (
      <BannedUserPageView
        usersList={paginatedUsers}
        error={usersState.error}
        getProfile={getProfile}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
});
