package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.model.DowntimeEvent;
import com.knust.toyfactory.toy_factory_backend.repository.DowntimeEventRepository;

@RestController
@RequestMapping("/api/downtime-events")
public class DowntimeEventController {

    @Autowired
    private DowntimeEventRepository downtimeEventRepository;

    @GetMapping
    public List<DowntimeEvent> getAllDowntimeEvents() {
        return downtimeEventRepository.findAll();
    }

    @PostMapping
    public DowntimeEvent addDowntimeEvent(@RequestBody DowntimeEvent event) {
        return downtimeEventRepository.save(event);
    }
}
