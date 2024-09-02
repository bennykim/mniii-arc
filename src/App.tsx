import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PostButton from "./components/PostButton";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>React Query Lab</h1>
      <PostButton />
    </QueryClientProvider>
  );
}

export default App;
