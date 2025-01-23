import React, { FC, memo, useCallback, useState } from 'react';
import { useAppDispatch, useTypedSelector } from '../../hooks/use-typed-selector';
import { Column } from '../column';
import { Input } from '../input';
import { Spacing } from '../spacing';
import { Button } from '@nextui-org/react';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { filterSlice } from '../../store/reducers/all/filter-slice';
import styled from 'styled-components';
import { Range, getTrackBackground } from 'react-range';

const sortOrder = [
  { value: 'asc', label: 'asc' },
  { value: 'desc', label: 'desc' },
];

const purposeOptions = [
  { value: 'networking', label: 'Networking' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'dating', label: 'Dating' },
  { value: 'business', label: 'Business' },
];

const locationOptions = [
  { value: 'BY', label: 'BY' },
  { value: 'RU', label: 'RU' },
  { value: 'KZ', label: 'KZ' },
];

const sexOptions = [
  { value: 'мужчина', label: '♂' },
  { value: 'женщина', label: '♀' },
];

const FilterWrapper = styled(Column)`
  padding: 100px;
  text-align: center;
  overflow: visible;
`;

const FiltersContainer = styled.div<{ isexpanded: boolean }>`
  max-height: ${({ isexpanded }) => (isexpanded ? '600px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 20px;
`;

const FilterCard = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: visible;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const customSelectStyles: StylesConfig = {
  container: (provided) => ({
    ...provided,
    width: '420px',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const Filter: FC = memo(() => {
  const filterState = useTypedSelector(state => state.filter);
  const { setMinAgeAction, setMaxAgeAction, setPurposeAction, setLocationAction, setSearchQueryAction, setSexAction, setSortOrderAction } = filterSlice.actions;
  const dispatch = useAppDispatch();
  const [isexpanded, setIsExpanded] = useState(false);
  const [minAgeError, setMinAgeError] = useState('');
  const [maxAgeError, setMaxAgeError] = useState('');

  const toggleExpanded = () => {
    setIsExpanded(!isexpanded);
  };

  const setMinAge = useCallback((minAge: number) => {
    setMinAgeError('');
    dispatch(setMinAgeAction(minAge));
  }, [dispatch, setMinAgeAction]);

  const setMaxAge = useCallback((maxAge: number) => {
    setMaxAgeError('');
    dispatch(setMaxAgeAction(maxAge));
  }, [dispatch, setMaxAgeAction]);

  const setPurpose = useCallback((selectedOptions: MultiValue<{ value: string; label: string }> | null) => { 
    console.log(selectedOptions);
    const purposes = selectedOptions ? selectedOptions.map(option => option.value) : []; dispatch(setPurposeAction(purposes));
   }, [dispatch, setPurposeAction]);

   const setLocation = useCallback((selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const locations = selectedOptions.map(option => option.value);
    dispatch(setLocationAction(locations));
  }, [dispatch, setLocationAction]);

  const setOrder = useCallback((selectedOption: { value: string; label: string }) => {

    dispatch(setSortOrderAction(selectedOption.value));
  }, [dispatch, setSortOrderAction]);

  const setSexQuery = useCallback((selectedOption: { value: string; label: string }) => {
    dispatch(setSexAction(selectedOption.value));
  }, [dispatch, setSexAction]);

  const setSearchQuery = useCallback((searchQuery: string) => {
    dispatch(setSearchQueryAction(searchQuery));
  }, [dispatch, setSearchQueryAction]);

  return (
    <FilterWrapper>
      <Button onClick={toggleExpanded}>
        {isexpanded ? 'Скрыть фильтры' : 'Показать фильтры'}
      </Button>
      <FiltersContainer isexpanded={isexpanded}>
        <FilterCard>
          <Range
            values={[filterState.minAge, filterState.maxAge]}
            step={1}
            min={18}
            max={99}
            onChange={(values) => {
              setMinAge(values[0]);
              setMaxAge(values[1]);
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  background: getTrackBackground({
                    values: [filterState.minAge, filterState.maxAge],
                    colors: ['#ccc', '#548BF4', '#ccc'],
                    min: 18,
                    max: 99
                  })
                }}
              >
                {children}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '0',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif'
                  }}
                >
                  {filterState.minAge}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '0',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif'
                  }}
                >
                  {filterState.maxAge}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged, value }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '16px',
                  width: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#548BF4',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 2px 6px #AAA'
                }}
              >
                <div
                  style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: isDragged ? '#548BF4' : '#CCC'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '25px',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif'
                  }}
                >
                  {value}
                </div>
              </div>
            )}
          />
          {minAgeError && <div style={{ color: 'red' }}>{minAgeError}</div>}
          {maxAgeError && <div style={{ color: 'red' }}>{maxAgeError}</div>}
          <><br></br><br></br></>
          <Select
            isMulti
            options={purposeOptions}
            value={purposeOptions.filter(option => filterState.purpose.includes(option.value))}
            onChange={(selectedOptions) => setPurpose(selectedOptions as MultiValue<{ value: string; label: string }>)}
            placeholder="Select Purpose"
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
        </FilterCard>
        
        
        <FilterCard>
          <Spacing variant="Column" themeSpace={10} />
          <Select
            options={sexOptions}
            value={sexOptions.find(option => option.value === filterState.sex)}
            onChange={(selectedOption) => setSexQuery(selectedOption as { value: string; label: string })}
            placeholder="Select Sex"
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
          <Spacing variant="Column" themeSpace={10} />
          <Input
            placeholder="Search Query"
            value={filterState.searchQuery}
            setValue={setSearchQuery}
          />
        </FilterCard>

        <FilterCard>
          <Spacing variant="Column" themeSpace={10} />
          <Select
            isMulti
            options={locationOptions}
            value={locationOptions.filter(option => filterState.location.includes(option.value))}
            onChange={(selectedOptions) => setLocation(selectedOptions as MultiValue<{ value: string; label: string }>)}
            placeholder="Select Location"
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
          <Spacing variant="Column" themeSpace={10} />
          <Select
            options={sortOrder}
            value={sortOrder.find(option => option.value === filterState.sex)}
            onChange={(selectedOption) => setOrder(selectedOption as { value: string; label: string })}
            placeholder="Select Order"
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
        </FilterCard>
      </FiltersContainer>
    </FilterWrapper>
  );
});

export default Filter;