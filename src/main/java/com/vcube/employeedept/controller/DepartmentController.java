
package com.vcube.employeedept.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.employeedept.entity.Department;
import com.vcube.employeedept.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "https://employee-department.vercel.app")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Department> getAll() {
        return service.getAllDepartments();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Integer id) {
        return service.getDepartmentById(id);
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return service.saveDepartment(department);
    }

    @PutMapping("/{id}")
    public Department update(
            @PathVariable Integer id,
            @RequestBody Department department) {
        return service.updateDepartment(id, department);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.deleteDepartment(id);
        return "Department deleted successfully";
    }
}
