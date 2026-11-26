package com.campusdual.cd2026mnd1g4.model.repository;

import com.campusdual.cd2026mnd1g4.model.entity.DistributorEntity;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface DistributorRepository extends Repository<DistributorEntity, Long> {

    Optional<DistributorEntity> findById(Long id);

    DistributorEntity save(DistributorEntity distributor);
}
