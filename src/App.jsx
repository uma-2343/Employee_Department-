
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
      const [employeeResponse, departmentResponse] = await Promise.all([
        fetch(`${API}/employees`),
        fetch(`${API}/departments`)
      ]);

      if (!employeeResponse.ok || !departmentResponse.ok) {
        throw new Error("Could not load data");
      }

      setEmployees(await employeeResponse.json());
      setDepartments(await departmentResponse.json());
    } catch (error) {
      console.error("Load failed:", error);
      setMessage(`Could not load data: ${error.message}`);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(
      tab === "employees"
        ? {
            employeeName: "",
            email: "",
            salary: "",
            designation: "",
            departmentId: ""
          }
        : {
            departmentName: "",
            location: ""
          }
    );
    setMessage("");
  }

  function startEdit(item) {
    setEditingId(
      tab === "employees" ? item.employeeId : item.departmentId
    );

    setForm(
      tab === "employees"
        ? {
            employeeName: item.employeeName ?? "",
            email: item.email ?? "",
            salary: item.salary ?? "",
            designation: item.designation ?? "",
            departmentId: item.department?.departmentId ?? ""
          }
        : {
            departmentName: item.departmentName ?? "",
            location: item.location ?? ""
          }
    );

    setMessage("");
  }

  function changeField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
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
            department: {
              departmentId: Number(form.departmentId)
            }
          }
        : {
            departmentName: form.departmentName,
            location: form.location
          };

      const resource = isEmployee ? "employees" : "departments";

      const url = `${API}/${resource}${
        editingId ? `/${editingId}` : ""
      }`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(
          (await response.text()) || `HTTP ${response.status}`
        );
      }

      setMessage(
        editingId
          ? "Record updated successfully!"
          : "Record added successfully!"
      );

      setForm({});
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error("Save failed:", error);
      setMessage(`Save failed: ${error.message}`);
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const resource =
        tab === "employees" ? "employees" : "departments";

      const response = await fetch(`${API}/${resource}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(
          (await response.text()) || `HTTP ${response.status}`
        );
      }

      setMessage("Record deleted successfully!");
      await loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage(`Delete failed: ${error.message}`);
    }
  }

  const rows = tab === "employees" ? employees : departments;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">MANAGEMENT SYSTEM</p>
          <h1>Employee &amp; Department Portal</h1>
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
            <button
              className={tab === "employees" ? "active" : ""}
              onClick={() => {
                setTab("employees");
                setForm({});
                setEditingId(null);
                setMessage("");
              }}
            >
              Employees
            </button>

            <button
              className={tab === "departments" ? "active" : ""}
              onClick={() => {
                setTab("departments");
                setForm({});
                setEditingId(null);
                setMessage("");
              }}
            >
              Departments
            </button>
          </div>

          <button className="primary" onClick={startAdd}>
            + Add {tab === "employees" ? "Employee" : "Department"}
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {Object.keys(form).length > 0 && (
          <form className="form" onSubmit={save}>
            <h2>
              {editingId ? "Edit" : "Add"}{" "}
              {tab === "employees" ? "Employee" : "Department"}
            </h2>

            {tab === "employees" ? (
              <>
                <input
                  name="employeeName"
                  placeholder="Employee name"
                  value={form.employeeName ?? ""}
                  onChange={changeField}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email ?? ""}
                  onChange={changeField}
                  required
                />

                <input
                  name="salary"
                  type="number"
                  min="0"
                  placeholder="Salary"
                  value={form.salary ?? ""}
                  onChange={changeField}
                  required
                />

                <input
                  name="designation"
                  placeholder="Designation"
                  value={form.designation ?? ""}
                  onChange={changeField}
                  required
                />

                <select
                  name="departmentId"
                  value={form.departmentId ?? ""}
                  onChange={changeField}
                  required
                >
                  <option value="">Select department</option>

                  {departments.map((department) => (
                    <option
                      key={department.departmentId}
                      value={department.departmentId}
                    >
                      {department.departmentName} — {department.location}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <input
                  name="departmentName"
                  placeholder="Department name"
                  value={form.departmentName ?? ""}
                  onChange={changeField}
                  required
                />

                <input
                  name="location"
                  placeholder="Location"
                  value={form.location ?? ""}
                  onChange={changeField}
                  required
                />
              </>
            )}

            <div className="form-actions">
              <button className="primary" type="submit">
                Save
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setForm({});
                  setEditingId(null);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="table-heading">
          <div>
            <h2>
              {tab === "employees"
                ? "Employee Directory"
                : "Department Directory"}
            </h2>
            <p>{rows.length} records found</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            {tab === "employees" ? (
              <>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Salary</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>EMP-{employee.employeeId}</td>
                      <td>{employee.employeeName}</td>
                      <td>{employee.email}</td>
                      <td>
                        ₹{Number(employee.salary).toLocaleString("en-IN")}
                      </td>
                      <td>{employee.designation}</td>
                      <td>
                        {employee.department?.departmentName ?? "—"}
                      </td>
                      <td className="actions">
                        <button onClick={() => startEdit(employee)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => remove(employee.employeeId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {departments.map((department) => (
                    <tr key={department.departmentId}>
                      <td>DEPT-{department.departmentId}</td>
                      <td>{department.departmentName}</td>
                      <td>{department.location}</td>
                      <td className="actions">
                        <button onClick={() => startEdit(department)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => remove(department.departmentId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          {rows.length === 0 && (
            <p className="empty">
              No records yet. Click “Add” to create one.
            </p>
          )}
        </div>
      </main>

      <footer>
        Employee &amp; Department Management · Spring Boot REST API
      </footer>
    </div>
  );
}

export default App;
