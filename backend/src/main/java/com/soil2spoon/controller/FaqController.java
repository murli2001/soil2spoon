package com.soil2spoon.controller;

import com.soil2spoon.dto.FaqResponse;
import com.soil2spoon.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<List<FaqResponse>> getAll() {
        return ResponseEntity.ok(contentService.getFaqs());
    }
}
