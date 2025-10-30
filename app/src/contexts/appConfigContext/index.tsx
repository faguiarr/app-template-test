import { createContext } from "react";
import type { AppConfigContextType } from "./appConfigType";

const AppConfigContext = createContext<AppConfigContextType | null>(null)
export default AppConfigContext;