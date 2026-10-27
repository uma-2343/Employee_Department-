
package com.vcube.employeedept.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.vcube.employeedept.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Integer> {

}
