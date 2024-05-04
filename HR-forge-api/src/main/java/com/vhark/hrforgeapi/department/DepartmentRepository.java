package com.vhark.hrforgeapi.department;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

  Optional<Department> findByName(String positionName);
}
