package com.campusdual.cd2026mnd1g4.model.repository;

import com.campusdual.cd2026mnd1g4.model.entity.WaiterEntity;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface WaiterRepository extends Repository<WaiterEntity, Long> {

    List<WaiterEntity> findAllByDistributorIdAndStore_IdAndActiveTrue(Long distributorId, Long storeId);

    Optional<WaiterEntity> findByIdAndDistributorId(Long id, Long distributorId);

    WaiterEntity save(WaiterEntity waiter);
}
