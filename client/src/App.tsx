import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ListingDetail from "./pages/ListingDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SellerDashboard from "./pages/SellerDashboard";
import ShopProfile from "./pages/ShopProfile";
import Header from "./components/Header";
import CreateListing from "./pages/CreateListing";
import RoleSelection from "./pages/RoleSelection";
import OrderHistory from "./pages/OrderHistory";
import Reviews from "./pages/Reviews";
import AdminPanel from "./pages/AdminPanel";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/search"} component={Search} />
      <Route path={"/listing/:id"} component={ListingDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout/:orderNumber"} component={Checkout} />
      <Route path={"/seller/dashboard"} component={SellerDashboard} />
      <Route path={"/shop/:id"} component={ShopProfile} />
      <Route path={"/create-listing"} component={CreateListing} />
      <Route path={"/role-selection"} component={RoleSelection} />
      <Route path={"/orders"} component={OrderHistory} />
      <Route path={"/reviews"} component={Reviews} />
      <Route path="/admin" component={AdminPanel} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Header />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
