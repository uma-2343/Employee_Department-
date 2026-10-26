
package com.vcube.employeedept.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.vcube.employeedept.entity.Department;
import com.vcube.employeedept.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5174")
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
