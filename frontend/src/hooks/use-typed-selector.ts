import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";


export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();