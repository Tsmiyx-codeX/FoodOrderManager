import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import Menu from "./pages/Menu";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;