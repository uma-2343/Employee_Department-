
import { useEffect, useState } from "react";
import "./App.css";

const API = "https://employee-department-backend.onrender.com/api";

function App() {
  const [tab, setTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    try {
      const [e, d] = await Promise.all([
        fetch(`${API}/employees`),
        fetch(`${API}/departments`)
      ]);
      if (!e.ok || !d.ok) throw new Error("Could not load data");
      setEmployees(await e.json());
      setDepartments(await d.json());
    } catch {
      setMessage("Backend run avuthondho check chey (port 8888).");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(tab === "employees"
      ? { employeeName: "", email: "", salary: "", designation: "", departmentId: "" }
      : { departmentName: "", location: "" });
    setMessage("");
  }

  function startEdit(item) {
    setEditingId(tab === "employees" ? item.employeeId : item.departmentId);
    setForm(tab === "employees"
      ? {
          employeeName: item.employeeName,
          email: item.email,
          salary: item.salary,
          designation: item.designation,
          departmentId: item.department?.departmentId ?? ""
        }
      : { departmentName: item.departmentName, location: item.location });
    setMessage("");
  }

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function save(event) {
    event.preventDefault();

    try {
      const isEmployee = tab === "employees";
      const body = isEmployee
        ? {
            employeeName: form.employeeName,
            email: form.email,
            salary: Number(form.salary),
            designation: form.designation,
            department: { departmentId: Number(form.departmentId) }
          }
        : {
            departmentName: form.departmentName,
            location: form.location
          };

      const url = isEmployee
        ? `${API}/employees${editingId ? `/${editingId}` : ""}`
        : `${API}/departments${editingId ? `/${editingId}` : ""}`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error(await response.text());

      setMessage(editingId ? "Record updated successfully!" : "Record added successfully!");
      setForm({});
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage("Save failed. Backend, department ID, and required fields check chey.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const resource = tab === "employees" ? "employees" : "departments";
      const response = await fetch(`${API}/${resource}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setMessage("Record deleted successfully!");
      await loadData();
    } catch {
      setMessage("Delete failed. Department ki employees linked unte first vallani move chey.");
    }
  }

  const rows = tab === "employees" ? employees : departments;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">MANAGEMENT SYSTEM</p>
          <h1>Employee & Department Portal</h1>
          <p>Manage your workforce from one dashboard.</p>
        </div>
        <div className="hero-icon">✦</div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Departments</span>
          <strong>{departments.length}</strong>
        </div>
      </section>

      <main className="panel">
        <div className="toolbar">
          <div className="tabs">
            <button className={tab === "employees" ? "active" : ""} onClick={() => { setTab("employees"); setForm({}); setEditingId(null); }}>
              Employees
            </button>
            <button className={tab === "departments" ? "active" : ""} onClick={() => { setTab("departments"); setForm({}); setEditingId(null); }}>
              Departments
            </button>
          </div>
          <button className="primary" onClick={startAdd}>+ Add {tab === "employees" ? "Employee" : "Department"}</button>
        </div>

        {message && <p className="message">{message}</p>}

        {Object.keys(form).length > 0 && (
          <form className="form" onSubmit={save}>
            <h2>{editingId ? "Edit" : "Add"} {tab === "employees" ? "Employee" : "Department"}</h2>

            {tab === "employees" ? (
              <>
                <input name="employeeName" placeholder="Employee name" value={form.employeeName ?? ""} onChange={changeField} required />
                <input name="email" type="email" placeholder="Email" value={form.email ?? ""} onChange={changeField} required />
                <input name="salary" type="number" min="0" placeholder="Salary" value={form.salary ?? ""} onChange={changeField} required />
                <input name="designation" placeholder="Designation" value={form.designation ?? ""} onChange={changeField} required />
                <select name="departmentId" value={form.departmentId ?? ""} onChange={changeField} required>
                  <option value="">Select department</option>
                  {departments.map(d => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName} — {d.location}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <input name="departmentName" placeholder="Department name" value={form.departmentName ?? ""} onChange={changeField} required />
                <input name="location" placeholder="Location" value={form.location ?? ""} onChange={changeField} required />
              </>
            )}

            <div className="form-actions">
              <button className="primary" type="submit">Save</button>
              <button type="button" className="secondary" onClick={() => { setForm({}); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        )}

        <div className="table-heading">
          <div>
            <h2>{tab === "employees" ? "Employee Directory" : "Department Directory"}</h2>
            <p>{rows.length} records found</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            {tab === "employees" ? (
              <>
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Salary</th><th>Designation</th><th>Department</th><th>Actions</th></tr></thead>
                <tbody>
                  {employees.map(e => (
                    <tr key={e.employeeId}>
                      <td>EMP-{e.employeeId}</td>
                      <td>{e.employeeName}</td>
                      <td>{e.email}</td>
                      <td>₹{Number(e.salary).toLocaleString("en-IN")}</td>
                      <td>{e.designation}</td>
                      <td>{e.department?.departmentName ?? "—"}</td>
                      <td className="actions">
                        <button onClick={() => startEdit(e)}>Edit</button>
                        <button className="danger" onClick={() => remove(e.employeeId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead><tr><th>ID</th><th>Department</th><th>Location</th><th>Actions</th></tr></thead>
                <tbody>
                  {departments.map(d => (
                    <tr key={d.departmentId}>
                      <td>DEPT-{d.departmentId}</td>
                      <td>{d.departmentName}</td>
                      <td>{d.location}</td>
                      <td className="actions">
                        <button onClick={() => startEdit(d)}>Edit</button>
                        <button className="danger" onClick={() => remove(d.departmentId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
          {rows.length === 0 && <p className="empty">No records yet. Click “Add” to create one.</p>}
        </div>
      </main>
      <footer>Employee & Department Management · Spring Boot REST API</footer>
    </div>
  );
}

export default App;


