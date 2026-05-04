import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import BahanBaku from "./pages/BahanBaku";
import Forecasting from "./pages/Forecasting";
import Penawaran from "./pages/Penawaran";
import AnalisisHarga from "./pages/AnalisisHarga";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner theme="dark" position="top-right" richColors />
      <AppProvider>
        <BrowserRouter>
          <HashRouter>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bahan-baku" element={<BahanBaku />} />
              <Route path="/forecasting" element={<Forecasting />} />
              <Route path="/penawaran" element={<Penawaran />} />
              <Route path="/analisis-harga" element={<AnalisisHarga />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
