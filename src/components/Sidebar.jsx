import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  UtensilsCrossed,
  Settings,
  LogOut,
  Utensils,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo-section">
        <div className="logo-icon">
          <UtensilsCrossed size={24} />
        </div>

        <div>
          <h2>FoodOrder</h2>
          <span>MANAGER</span>
        </div>
      </div>

      <div className="menu-label">MENU</div>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <ClipboardList size={19} />
          <span>Orders</span>
        </NavLink>

        <NavLink
  to="/menu"
  className={({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`
  }
>
  <Utensils size={19} />
  <span>Menu</span>
</NavLink>

        <NavLink
          to="/add-order"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <PlusCircle size={19} />
          <span>Add Order</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">

        <NavLink to="#" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <button className="logout-btn">
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;