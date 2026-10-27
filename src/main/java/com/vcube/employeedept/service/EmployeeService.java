
package com.vcube.employeedept.service;

import java.util.List;
import com.vcube.employeedept.entity.Employee;

public interface EmployeeService {

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Integer id);

    Employee saveEmployee(Employee employee);

    Employee updateEmployee(Integer id, Employee employee);

    void deleteEmployee(Integer id);
}
