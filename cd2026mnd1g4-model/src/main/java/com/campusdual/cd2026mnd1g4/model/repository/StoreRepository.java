package com.campusdual.cd2026mnd1g4.model.repository;

import com.campusdual.cd2026mnd1g4.model.entity.StoreEntity;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends Repository<StoreEntity, Long> {

    List<StoreEntity> findAllByDistributor_Id(Long distributorId);

    Optional<StoreEntity> findByIdAndDistributor_Id(Long id, Long distributorId);

    StoreEntity save(StoreEntity store);
}
