package com.vhark.hrforgeapi.department;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DepartmentResponse {

  private Long departmentId;
  private String name;
  private String description;
}
