package com.ampm.simulation;

import com.ampm.process.Machine;
import com.ampm.process.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class MachineSimulator {

    private final Random random = new Random();
    private final String[] statuses = {"RUNNING", "IDLE", "DOWN"};
    private final String[] reasons = {"Changeover", "Breakdown", "Maintenance"};

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private DowntimeEventRepository downtimeEventRepository;

    @Autowired
    private ProductionRecordRepository productionRecordRepository;

    private boolean seeded = false;

    // Creates our 3 toy-factory machines in the database, only once
    private void seedMachinesIfNeeded() {
        if (!seeded && machineRepository.count() == 0) {
            for (int i = 1; i <= 3; i++) {
                Machine m = new Machine();
                m.setName("Machine " + i);
                m.setLineId("Line-1");
                m.setStatus("IDLE");
                machineRepository.save(m);
            }
        }
        seeded = true;
    }

    // Runs automatically every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void simulateTick() {
        seedMachinesIfNeeded();

        List<Machine> machines = machineRepository.findAll();
        if (machines.isEmpty()) return;

        Machine machine = machines.get(random.nextInt(machines.size()));
        String newStatus = statuses[random.nextInt(statuses.length)];
        machine.setStatus(newStatus);
        machineRepository.save(machine);

        if (newStatus.equals("DOWN")) {
            DowntimeEvent event = new DowntimeEvent();
            event.setMachine(machine);
            event.setReasonCode(reasons[random.nextInt(reasons.length)]);
            event.setStartTime(LocalDateTime.now());
            downtimeEventRepository.save(event);
            System.out.println("[SIMULATION] " + machine.getName() + " went DOWN — reason: " + event.getReasonCode() + " (saved to DB)");
        } else if (newStatus.equals("RUNNING")) {
            ProductionRecord record = new ProductionRecord();
            record.setMachine(machine);
            record.setGoodUnits(random.nextInt(50) + 1);
            record.setDefectiveUnits(random.nextInt(5));
            record.setRecordedAt(LocalDateTime.now());
            productionRecordRepository.save(record);
            System.out.println("[SIMULATION] " + machine.getName() + " RUNNING — good: " + record.getGoodUnits() + ", defective: " + record.getDefectiveUnits() + " (saved to DB)");
        } else {
            System.out.println("[SIMULATION] " + machine.getName() + " is now IDLE (saved to DB)");
        }
    }
}
