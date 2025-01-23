import { useDispatch } from "react-redux";
import type { AppDispatch } from "../index"; // Убедитесь, что путь к `store` корректный

export const useAppDispatch: () => AppDispatch = useDispatch;
