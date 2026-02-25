package com.soil2spoon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnsPolicyResponse {

    private String title;
    private String intro;
    private Integer windowDays;
    private List<String> conditions;
    private String contactNote;
}
