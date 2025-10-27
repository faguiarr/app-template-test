import { QueryClientProvider } from "@tanstack/react-query";

import Pages from "./pages"
import { queryClient } from "./utils/queryClient";
import ThemeProviderWrapper from "./components/themeProviderWrapper";
import { AppConfigProvider } from "./contexts/appConfigContext/appConfigProvider";
import { BroadcastChannelProvider } from "./contexts/broadcastChannelContext/broadcastChannelProvider";

function App() {
  return (
    <BroadcastChannelProvider>
      <AppConfigProvider>
        <ThemeProviderWrapper>
          <QueryClientProvider client={queryClient}>
            <Pages />
          </QueryClientProvider>
        </ThemeProviderWrapper>
      </AppConfigProvider>
    </BroadcastChannelProvider>
  );
}

export default App;
