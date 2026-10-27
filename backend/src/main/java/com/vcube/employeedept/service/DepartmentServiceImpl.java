
package com.vcube.employeedept.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vcube.employeedept.entity.Department;
import com.vcube.employeedept.repo.DepartmentRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository repository;

    public DepartmentServiceImpl(DepartmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Department> getAllDepartments() {
        return repository.findAll();
    }

    @Override
    public Department getDepartmentById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @Override
    public Department saveDepartment(Department department) {
        return repository.save(department);
    }

    @Override
    public Department updateDepartment(Integer id, Department department) {
        Department existing = getDepartmentById(id);

        existing.setDepartmentName(department.getDepartmentName());
        existing.setLocation(department.getLocation());

        return repository.save(existing);
    }

    @Override
    public void deleteDepartment(Integer id) {
        repository.deleteById(id);
    }
}
