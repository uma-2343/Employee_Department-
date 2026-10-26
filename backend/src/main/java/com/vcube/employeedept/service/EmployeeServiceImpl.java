
package com.vcube.employeedept.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vcube.employeedept.entity.Employee;
import com.vcube.employeedept.repo.EmployeeRepository;
import com.vcube.employeedept.repo.DepartmentRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        if (employee.getDepartment() != null
                && employee.getDepartment().getDepartmentId() != null) {
            Integer departmentId = employee.getDepartment().getDepartmentId();

            var department = departmentRepository.findById(departmentId)
                    .orElseThrow(() ->
                            new RuntimeException("Department not found"));

            employee.setDepartment(department);
        }

        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Integer id, Employee employee) {
        Employee existing = getEmployeeById(id);

        existing.setEmployeeName(employee.getEmployeeName());
        existing.setEmail(employee.getEmail());
        existing.setSalary(employee.getSalary());
        existing.setDesignation(employee.getDesignation());

        if (employee.getDepartment() != null
                && employee.getDepartment().getDepartmentId() != null) {
            Integer departmentId = employee.getDepartment().getDepartmentId();

            var department = departmentRepository.findById(departmentId)
                    .orElseThrow(() ->
                            new RuntimeException("Department not found"));

            existing.setDepartment(department);
        }

        return employeeRepository.save(existing);
    }

    @Override
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }
}
