
package com.vcube.employeedept.service;

import java.util.List;
import com.vcube.employeedept.entity.Department;

public interface DepartmentService {

    List<Department> getAllDepartments();

    Department getDepartmentById(Integer id);

    Department saveDepartment(Department department);

    Department updateDepartment(Integer id, Department department);

    void deleteDepartment(Integer id);
}
