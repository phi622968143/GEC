import { Outlet, NavLink } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="d-flex">
      <nav className="bg-light p-3" style={{ minWidth: '200px' }}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products/upload">Upload Product</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products/list">Product List</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/orders">Orders</NavLink>
          </li>
        </ul>
      </nav>
      <main className="p-4 flex-grow-1">
        <Outlet /> {/* 嵌套子路由 */}
      </main>
    </div>
  );
}

export default AdminLayout;
