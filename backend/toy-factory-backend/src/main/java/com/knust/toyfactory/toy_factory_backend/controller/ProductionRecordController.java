package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.ProductionRecordRequest;
import com.knust.toyfactory.toy_factory_backend.dto.ProductionRecordResponse;
import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.model.ProductionRecord;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;
import com.knust.toyfactory.toy_factory_backend.repository.ProductionRecordRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/production-records")
@Tag(name = "Production Records", description = "Manage production records")
public class ProductionRecordController {

    private final ProductionRecordRepository productionRecordRepository;
    private final MachineRepository machineRepository;

    public ProductionRecordController(ProductionRecordRepository productionRecordRepository, MachineRepository machineRepository) {
        this.productionRecordRepository = productionRecordRepository;
        this.machineRepository = machineRepository;
    }

    @Operation(summary = "Get all production records")
    @GetMapping
    public List<ProductionRecordResponse> getAll() {
        return productionRecordRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get production records by machine ID")
    @GetMapping("/machine/{machineId}")
    public List<ProductionRecordResponse> getByMachine(@PathVariable Long machineId) {
        return productionRecordRepository.findByMachineId(machineId).stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Create a production record")
    @PostMapping
    public ProductionRecordResponse create(@RequestBody ProductionRecordRequest request) {
        Machine machine = machineRepository.findById(request.getMachineId())
            .orElseThrow(() -> new IllegalArgumentException("Machine not found"));

        ProductionRecord record = new ProductionRecord();
        record.setMachine(machine);
        record.setGoodUnits(request.getGoodUnits());
        record.setDefectiveUnits(request.getDefectiveUnits());
        record.setIdealCycleTime(request.getIdealCycleTime());
        record.setPlannedProductionTime(request.getPlannedProductionTime());
        record.setRecordedAt(request.getRecordedAt());

        return toResponse(productionRecordRepository.save(record));
    }

    @Operation(summary = "Update a production record")
    @PutMapping("/{id}")
    public ResponseEntity<ProductionRecordResponse> update(@PathVariable Long id, @RequestBody ProductionRecordRequest request) {
        return productionRecordRepository.findById(id)
            .map(record -> {
                Machine machine = machineRepository.findById(request.getMachineId())
                    .orElseThrow(() -> new IllegalArgumentException("Machine not found"));
                record.setMachine(machine);
                record.setGoodUnits(request.getGoodUnits());
                record.setDefectiveUnits(request.getDefectiveUnits());
                record.setIdealCycleTime(request.getIdealCycleTime());
                record.setPlannedProductionTime(request.getPlannedProductionTime());
                record.setRecordedAt(request.getRecordedAt());
                return ResponseEntity.ok(toResponse(productionRecordRepository.save(record)));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a production record")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productionRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productionRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProductionRecordResponse toResponse(ProductionRecord record) {
        return new ProductionRecordResponse(
            record.getId(),
            record.getMachine() != null ? record.getMachine().getId() : null,
            record.getGoodUnits(),
            record.getDefectiveUnits(),
            record.getIdealCycleTime(),
            record.getPlannedProductionTime(),
            record.getRecordedAt()
        );
    }
}
