import DefaultLayout from "./layouts/DefaultLayout";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckOut from './pages/CheckOut'
import ProductList from "./pages/ProductsList";
import AllDone from "./pages/AllDone";
import NotFound from "./pages/NotFound";
import DiscountGame from "./pages/DiscountGame";
import WishList from "./pages/WishList";
import { WishlistProvider } from "./contexts/WishlistContext";
import Credits from "./pages/Credits";


function App() {
  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route Component={DefaultLayout}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" Component={HomePage} />
                <Route path="/products/:slug/" Component={ProductPage} />
                <Route path="/checkout" Component={CheckOut} />
                <Route path="/products" Component={ProductList} />
                <Route path="/allDone" Component={AllDone} />
                <Route path="/gameDiscount" Component={DiscountGame} />
                <Route path="/WishList" Component={WishList} />
                <Route path="/credits" Component={Credits} />
                <Route path="*" Component={NotFound} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter></>
  )
}

export default App;
