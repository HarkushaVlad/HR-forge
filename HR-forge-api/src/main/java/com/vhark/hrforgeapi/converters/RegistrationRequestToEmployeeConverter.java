package com.vhark.hrforgeapi.converters;

import com.vhark.hrforgeapi.auth.RegistrationRequest;
import com.vhark.hrforgeapi.department.Department;
import com.vhark.hrforgeapi.department.DepartmentRepository;
import com.vhark.hrforgeapi.department.exceptions.DepartmentNotFoundException;
import com.vhark.hrforgeapi.employee.Employee;
import com.vhark.hrforgeapi.position.Position;
import com.vhark.hrforgeapi.position.PositionRepository;
import com.vhark.hrforgeapi.position.exceptions.PositionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationRequestToEmployeeConverter
    implements Converter<RegistrationRequest, Employee> {

  private final DepartmentRepository departmentRepository;
  private final PositionRepository positionRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public Employee convert(MappingContext<RegistrationRequest, Employee> mappingContext) {
    RegistrationRequest request = mappingContext.getSource();

    Position employeePosition =
        positionRepository
            .findByName(request.getPositionName())
            .orElseThrow(() -> new PositionNotFoundException(request.getPositionName()));

    Department employeeDepartment =
        departmentRepository
            .findByName(request.getDepartmentName())
            .orElseThrow(() -> new DepartmentNotFoundException(request.getDepartmentName()));

    return Employee.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .email(request.getEmail())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .position(employeePosition)
        .department(employeeDepartment)
        .salary(request.getSalary())
        .birthDate(request.getBirthDate())
        .hireDate(request.getHireDate())
        .build();
  }
}
