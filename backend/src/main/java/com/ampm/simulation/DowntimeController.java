package com.ampm.simulation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DowntimeController {

    @Autowired
    private DowntimeEventRepository downtimeEventRepository;

    @GetMapping("/api/downtime")
    public List<DowntimeEvent> getAllDowntimeEvents() {
        return downtimeEventRepository.findAll();
    }
}
