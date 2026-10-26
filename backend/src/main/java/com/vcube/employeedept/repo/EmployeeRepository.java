
package com.vcube.employeedept.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.vcube.employeedept.entity.Employee;

public interface EmployeeRepository
        extends JpaRepository<Employee, Integer> {

}
