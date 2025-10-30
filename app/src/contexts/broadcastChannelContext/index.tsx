import { createContext } from "react";
import type { BroadcastChannelContextType } from "./broadcastChannelType";

const BroadcastChannelContext = createContext<BroadcastChannelContextType | null>(null);

export default BroadcastChannelContext;